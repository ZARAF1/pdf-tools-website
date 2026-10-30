import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, Languages } from 'lucide-react';
import { getLanguageName, SUPPORTED_LANGUAGES } from '../i18n/languageCatalog.mjs';
import { useLanguage } from '../i18n/useLanguage';

const LanguagePicker = ({ placement, isOpen: sidebarIsOpen, onToggle, onSelected, onKeyDown }) => {
  const { language, setLanguage, translate } = useLanguage();
  const [footerIsOpen, setFooterIsOpen] = useState(false);
  const pickerRef = useRef(null);
  const triggerRef = useRef(null);
  const suppressFocusOpen = useRef(false);
  const menuId = useId();
  const isSidebar = placement === 'sidebar';
  const isOpen = isSidebar ? sidebarIsOpen : footerIsOpen;

  useEffect(() => {
    if (isSidebar || !isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!pickerRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        suppressFocusOpen.current = true;
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSidebar]);

  const setIsOpen = (open) => {
    if (!isSidebar) setFooterIsOpen(open);
  };

  const selectLanguage = (code) => {
    setLanguage(code);
    if (isSidebar) {
      onSelected?.();
      return;
    }
    setIsOpen(false);
    suppressFocusOpen.current = true;
  };

  return (
    <div
      ref={pickerRef}
      className={`language-picker language-picker-${placement}${isOpen ? ' is-open' : ''}`}
      onMouseEnter={() => {
        if (placement === 'footer') setIsOpen(true);
      }}
      onMouseLeave={() => {
        if (placement === 'footer' && !pickerRef.current?.contains(document.activeElement)) {
          setIsOpen(false);
        }
      }}
      onFocusCapture={() => {
        if (placement !== 'footer') return;
        if (suppressFocusOpen.current) {
          suppressFocusOpen.current = false;
          return;
        }
        setIsOpen(true);
      }}
      onBlurCapture={(event) => {
        if (placement === 'footer' && !pickerRef.current?.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`language-picker-trigger${placement === 'sidebar' ? ' site-left-link' : ' footer-link'}`}
        aria-label={`${translate('language')}: ${getLanguageName(language)}`}
        aria-expanded={isOpen}
        aria-controls={isSidebar ? 'site-tools-mega-menu' : menuId}
        aria-haspopup={isSidebar ? 'dialog' : 'listbox'}
        {...(isSidebar ? { 'data-mega-trigger': 'language' } : {})}
        onClick={isSidebar ? onToggle : () => setIsOpen(true)}
        onKeyDown={isSidebar ? onKeyDown : undefined}
      >
        <Languages aria-hidden="true" />
        <span>{placement === 'sidebar' ? translate('language') : getLanguageName(language)}</span>
      </button>
      {!isSidebar && (
        <div
          id={menuId}
          className="language-picker-menu"
          role="listbox"
          aria-label={translate('chooseLanguage')}
        >
          <div className="language-picker-options">
            {SUPPORTED_LANGUAGES.map(({ code, name }) => (
              <button
                key={code}
                type="button"
                role="option"
                className="language-picker-option"
                aria-selected={language === code}
                lang={code}
                dir={code === 'ar' ? 'rtl' : 'ltr'}
                onClick={() => selectLanguage(code)}
              >
                <span>{name}</span>
                {language === code && <Check className="language-picker-selected-icon" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguagePicker;
