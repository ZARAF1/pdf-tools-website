import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';
import { createDownloadStateTracker } from '../lib/toolExitDownloadState.mjs';

const ToolExitContext = createContext(null);
let popStateGuard = null;
let historyListenerInstalled = false;

export const installToolExitHistoryListener = () => {
  if (typeof window === 'undefined' || historyListenerInstalled) return;

  window.addEventListener('popstate', (event) => {
    popStateGuard?.(event);
  }, true);
  historyListenerInstalled = true;
};

export const useToolExitGuard = (hasAttachedFiles, downloadableOutputs = null) => {
  const context = useContext(ToolExitContext);

  if (!context) {
    throw new Error('useToolExitGuard must be used within ToolExitGuardProvider.');
  }

  useLayoutEffect(() => {
    context.setToolState(Boolean(hasAttachedFiles), downloadableOutputs);
  }, [context.setToolState, hasAttachedFiles, downloadableOutputs]);

  useLayoutEffect(() => (
    () => context.setToolState(false, null)
  ), [context.setToolState]);

  return context.markOutputDownloaded;
};

export const useToolExitControls = () => {
  const context = useContext(ToolExitContext);

  if (!context) {
    throw new Error('useToolExitControls must be used within ToolExitGuardProvider.');
  }

  return context;
};

export const ToolExitGuardProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useLanguage();
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const attachedFilesRef = useRef(false);
  const downloadTrackerRef = useRef(createDownloadStateTracker());
  const historyIndexRef = useRef(window.history.state?.idx ?? 0);
  const historyRestoreRef = useRef(false);
  const popDeltaRef = useRef(-1);
  const allowNextPopRef = useRef(false);
  const focusReturnRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const locationRef = useRef(location);
  locationRef.current = location;

  const reportToolState = useCallback((attached, outputs) => {
    attachedFilesRef.current = attached;
    downloadTrackerRef.current.update(outputs);
  }, []);

  const markOutputDownloaded = useCallback((outputId) => {
    downloadTrackerRef.current.markDownloaded(outputId);
  }, []);

  const hasPendingChanges = () => (
    attachedFilesRef.current || downloadTrackerRef.current.getPendingCount() > 0
  );

  const createPendingNavigation = (action) => ({
    action,
    undownloadedOutputCount: downloadTrackerRef.current.getPendingCount()
  });

  const requestNavigation = useCallback((action, focusTarget = document.activeElement) => {
    if (!hasPendingChanges()) {
      action();
      return;
    }

    focusReturnRef.current = focusTarget;
    setPendingNavigation(createPendingNavigation(action));
  }, []);

  const requestToolNavigation = useCallback((path, focusTarget) => {
    if (path === locationRef.current.pathname) {
      navigate(path);
      return;
    }

    requestNavigation(() => navigate(path), focusTarget);
  }, [navigate, requestNavigation]);

  useLayoutEffect(() => {
    historyIndexRef.current = window.history.state?.idx ?? historyIndexRef.current;
  }, [location]);

  useEffect(() => {
    if (!pendingNavigation) return undefined;
    cancelButtonRef.current?.focus();
    return undefined;
  }, [pendingNavigation]);

  useEffect(() => {
    const handleClick = (event) => {
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) {
        return;
      }

      const link = event.target.closest('a[href]');
      if (!link || link.target || link.hasAttribute('download')) return;

      const target = new URL(link.href, window.location.href);
      if (target.origin !== window.location.origin) return;

      const current = locationRef.current;
      if (target.pathname === current.pathname) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      requestNavigation(
        () => navigate(`${target.pathname}${target.search}${target.hash}`),
        link
      );
    };

    const handlePopState = (event) => {
      if (allowNextPopRef.current) {
        allowNextPopRef.current = false;
        historyIndexRef.current = window.history.state?.idx ?? historyIndexRef.current;
        return;
      }

      if (historyRestoreRef.current) {
        historyRestoreRef.current = false;
        event.stopImmediatePropagation();
        const delta = popDeltaRef.current;
        focusReturnRef.current = document.activeElement;
        setPendingNavigation(createPendingNavigation(
          () => {
            allowNextPopRef.current = true;
            window.history.go(delta);
          }
        ));
        return;
      }

      if (!hasPendingChanges()) {
        historyIndexRef.current = window.history.state?.idx ?? historyIndexRef.current;
        return;
      }

      event.stopImmediatePropagation();
      const targetIndex = window.history.state?.idx;
      const currentIndex = historyIndexRef.current;
      const delta = Number.isInteger(targetIndex) && Number.isInteger(currentIndex)
        ? targetIndex - currentIndex
        : -1;

      if (delta === 0) return;

      popDeltaRef.current = delta;
      historyRestoreRef.current = true;
      window.history.go(-delta);
    };

    const handleBeforeUnload = (event) => {
      if (!hasPendingChanges()) return;
      event.preventDefault();
      event.returnValue = '';
    };

    popStateGuard = handlePopState;
    document.addEventListener('click', handleClick, true);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      if (popStateGuard === handlePopState) popStateGuard = null;
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate, requestNavigation]);

  const cancelNavigation = () => {
    setPendingNavigation(null);
    if (focusReturnRef.current?.isConnected) focusReturnRef.current.focus();
  };

  const confirmNavigation = () => {
    const action = pendingNavigation?.action;
    setPendingNavigation(null);
    action?.();
  };

  const handleDialogKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelNavigation();
      return;
    }

    if (event.key !== 'Tab') return;

    const buttons = event.currentTarget.querySelectorAll('button');
    const firstButton = buttons[0];
    const lastButton = buttons[buttons.length - 1];

    if (event.shiftKey && document.activeElement === firstButton) {
      event.preventDefault();
      lastButton.focus();
    } else if (!event.shiftKey && document.activeElement === lastButton) {
      event.preventDefault();
      firstButton.focus();
    }
  };

  return (
    <ToolExitContext.Provider
      value={{
        setToolState: reportToolState,
        markOutputDownloaded,
        requestToolNavigation
      }}
    >
      {children}
      {pendingNavigation && (
        <div className="tool-exit-dialog-backdrop">
          <section
            aria-labelledby="tool-exit-dialog-title"
            aria-describedby="tool-exit-dialog-description"
            aria-modal="true"
            className="tool-exit-dialog"
            onKeyDown={handleDialogKeyDown}
            role="alertdialog"
          >
            <h2 id="tool-exit-dialog-title">{translate('discardAttachedFiles')}</h2>
            <p id="tool-exit-dialog-description">
              {pendingNavigation.undownloadedOutputCount > 0
                ? translate(
                  pendingNavigation.undownloadedOutputCount === 1
                    ? 'discardReadyFileMessage'
                    : 'discardReadyFilesMessage'
                ).replace('{count}', String(pendingNavigation.undownloadedOutputCount))
                : translate('discardAttachedFilesMessage')}
            </p>
            <div className="tool-exit-dialog-actions">
              <button
                ref={cancelButtonRef}
                type="button"
                className="tool-exit-cancel-button"
                onClick={cancelNavigation}
              >
                {translate('stayOnPage')}
              </button>
              <button
                type="button"
                className="tool-exit-confirm-button"
                onClick={confirmNavigation}
              >
                {translate('leavePage')}
              </button>
            </div>
          </section>
        </div>
      )}
    </ToolExitContext.Provider>
  );
};
