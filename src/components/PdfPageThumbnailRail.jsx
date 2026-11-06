import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const PdfPageThumbnailPreview = ({ document, pageNumber, rootRef }) => {
  const paperRef = useRef(null);
  const canvasRef = useRef(null);
  const [previewState, setPreviewState] = useState('loading');

  useEffect(() => {
    let active = true;
    let renderTask;
    let started = false;

    const renderPreview = async () => {
      if (started) return;
      started = true;
      setPreviewState('loading');
      try {
        const page = await document.getPage(pageNumber);
        if (!active) return;
        const baseViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: Math.min(1, 150 / baseViewport.width) });
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) throw new Error('Your browser could not render a page thumbnail.');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        renderTask = page.render({ canvasContext: context, viewport, intent: 'display' });
        await renderTask.promise;
        if (active) setPreviewState('ready');
      } catch (renderError) {
        if (active && renderError?.name !== 'RenderingCancelledException') {
          console.error(`Unable to render PDF thumbnail for page ${pageNumber}:`, renderError);
          setPreviewState('error');
        }
      }
    };

    const paper = paperRef.current;
    let observer;
    if (paper && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void renderPreview();
          observer.disconnect();
        }
      }, {
        root: rootRef.current,
        rootMargin: '120px 0px'
      });
      observer.observe(paper);
    } else {
      void renderPreview();
    }

    return () => {
      active = false;
      observer?.disconnect();
      renderTask?.cancel();
    };
  }, [document, pageNumber, rootRef]);

  return (
    <span ref={paperRef} className="pdf-page-thumbnail-paper">
      {previewState !== 'ready' && (
        <span className="pdf-page-thumbnail-status">
          {previewState === 'error' ? 'Preview unavailable' : 'Loading…'}
        </span>
      )}
      <canvas
        ref={canvasRef}
        className="pdf-page-thumbnail-canvas"
        aria-hidden="true"
        style={{ display: previewState === 'ready' ? 'block' : 'none' }}
      />
    </span>
  );
};

const PdfPageThumbnailRail = ({
  document,
  pageNumbers,
  currentPage,
  onSelectPage,
  disabled = false,
  showPageNavigation = true,
  showSelectedMark = false,
  selectedPageNumbers,
  onTogglePageSelection,
  getPageSelectionLabel
}) => {
  const rootRef = useRef(null);
  const currentThumbnailRef = useRef(null);
  const currentIndex = pageNumbers.indexOf(currentPage);
  const safeCurrentIndex = currentIndex < 0 ? 0 : currentIndex;

  useEffect(() => {
    const rail = rootRef.current;
    const ensureCurrentThumbnailVisible = () => {
      const activeThumbnail = currentThumbnailRef.current;
      if (!activeThumbnail || !rail) return;

      const railBounds = rail.getBoundingClientRect();
      const thumbnailBounds = activeThumbnail.getBoundingClientRect();
      if (thumbnailBounds.top < railBounds.top) {
        rail.scrollTop -= railBounds.top - thumbnailBounds.top;
      } else if (thumbnailBounds.bottom > railBounds.bottom) {
        rail.scrollTop += thumbnailBounds.bottom - railBounds.bottom;
      }

      if (thumbnailBounds.left < railBounds.left) {
        rail.scrollLeft -= railBounds.left - thumbnailBounds.left;
      } else if (thumbnailBounds.right > railBounds.right) {
        rail.scrollLeft += thumbnailBounds.right - railBounds.right;
      }
    };

    ensureCurrentThumbnailVisible();
    if (!rail || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(ensureCurrentThumbnailVisible);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [currentPage]);

  return (
    <aside
      className="pdf-page-thumbnail-rail"
      aria-label={showPageNavigation ? 'Page preview navigation' : 'PDF page thumbnails'}
    >
      {showPageNavigation && (
        <header className="pdf-page-thumbnail-rail-header">
          <p className="pdf-page-thumbnail-rail-title"><Eye aria-hidden="true" />Preview page</p>
          <div className="pdf-page-thumbnail-navigation">
            <button
              type="button"
              onClick={() => onSelectPage(pageNumbers[safeCurrentIndex - 1])}
              disabled={disabled || safeCurrentIndex <= 0}
              aria-label="Previous page"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <span aria-live="polite">Page {safeCurrentIndex + 1} of {pageNumbers.length}</span>
            <button
              type="button"
              onClick={() => onSelectPage(pageNumbers[safeCurrentIndex + 1])}
              disabled={disabled || safeCurrentIndex >= pageNumbers.length - 1}
              aria-label="Next page"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </header>
      )}
      <div ref={rootRef} className="pdf-page-thumbnail-list" role="group" aria-label="PDF page thumbnails">
        {pageNumbers.map((pageNumber) => {
          const isExportSelected = selectedPageNumbers?.has(pageNumber) ?? false;
          const isSelected = onTogglePageSelection
            ? isExportSelected
            : pageNumber === currentPage;
          const pageSelectionLabel = getPageSelectionLabel
            ? getPageSelectionLabel(pageNumber, isExportSelected)
            : isExportSelected
              ? `Remove page ${pageNumber} from export`
              : `Select page ${pageNumber} for export`;

          return (
            <button
              key={pageNumber}
              type="button"
              className="pdf-page-thumbnail-button"
              disabled={disabled}
              aria-label={onTogglePageSelection ? pageSelectionLabel : `Preview page ${pageNumber}`}
              aria-pressed={onTogglePageSelection
                ? isExportSelected
                : showSelectedMark ? pageNumber === currentPage : undefined}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
              ref={pageNumber === currentPage ? currentThumbnailRef : undefined}
              onClick={() => {
                onSelectPage(pageNumber);
                onTogglePageSelection?.(pageNumber);
              }}
            >
              <PdfPageThumbnailPreview
                document={document}
                pageNumber={pageNumber}
                rootRef={rootRef}
              />
              <span className="pdf-page-thumbnail-label">Page {pageNumber}</span>
              {showSelectedMark && isSelected && (
                <span className="pdf-page-thumbnail-selected-mark" aria-hidden="true">
                  <Check />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default PdfPageThumbnailRail;
