import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, FileText, Menu, X } from 'lucide-react';
import { TOOL_CATEGORIES, TOOL_REGISTRY } from '../toolRegistry';
import { getLocalizedTool } from '../../i18n/toolTranslations.mjs';
import { useLanguage } from '../../i18n/useLanguage';
import LanguagePicker from '../LanguagePicker';

const utilityLinkStyle = {
  paddingBlock: '8px',
  color: '#475569',
  fontSize: '14px',
  fontWeight: 500,
};

const EditorialLightHeader = () => {
  const { language, translate } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const navigationRef = useRef(null);
  const toolsByCategory = TOOL_CATEGORIES.map((category) => ({
    ...category,
    tools: TOOL_REGISTRY
      .filter((tool) => tool.category === category.id)
      .map((tool) => getLocalizedTool(language, tool)),
  }));

  useEffect(() => {
    const closeOnOutsidePointer = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setIsOpen(false);
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return undefined;
    navigationRef.current?.querySelector('a[href], button:not([disabled])')?.focus();
    return undefined;
  }, [isMobileOpen]);

  const closeOnKeyDown = (event) => {
    if (event.key === 'Escape' && isMobileOpen) {
      event.preventDefault();
      setIsOpen(false);
      setIsMobileOpen(false);
      mobileToggleRef.current?.focus();
      return;
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      setIsOpen(false);
      toggleRef.current?.focus();
      return;
    }

    if (event.key !== 'Tab' || !isMobileOpen || !navigationRef.current) return;
    const focusableElements = Array.from(
      navigationRef.current.querySelectorAll('a[href], button:not([disabled])')
    ).filter((element) => element.getClientRects().length > 0);
    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <header
      ref={headerRef}
      className="v6-header"
      onKeyDown={closeOnKeyDown}
      onBlur={(event) => {
        if (!headerRef.current?.contains(event.relatedTarget)) {
          setIsOpen(false);
          setIsMobileOpen(false);
        }
      }}
    >
      <div className="v6-utility-bar">
        <nav className="v6-utility-links" aria-label={translate('footerNavigation')} style={{ gap: '16px' }}>
          <a href="/about" style={utilityLinkStyle}>{translate('about')}</a>
          <a href="/contact" style={utilityLinkStyle}>{translate('contact')}</a>
          <a href="/faq" style={utilityLinkStyle}>{translate('faq')}</a>
          <a href="/privacy" style={utilityLinkStyle}>{translate('privacy')}</a>
          <a href="/security" style={utilityLinkStyle}>{translate('security')}</a>
          <a href="/terms" style={utilityLinkStyle}>{translate('terms')}</a>
          <a href="/cookies" style={utilityLinkStyle}>{translate('cookiePolicy')}</a>
        </nav>
      </div>
      <div className="v6-header-inner">
        <a className="v6-wordmark" href="/" aria-label={`PDF Merge Pro ${translate('home')}`}>
          <span className="v6-wordmark-icon" aria-hidden="true">
            <FileText />
          </span>
          <span>PDF Merge Pro</span>
        </a>
        <button
          ref={mobileToggleRef}
          className="v6-mobile-menu-toggle"
          type="button"
          aria-label={translate('browseTools')}
          aria-expanded={isMobileOpen}
          aria-controls="v6-primary-navigation"
          onClick={() => {
            setIsMobileOpen((open) => !open);
            setIsOpen(false);
          }}
        >
          {isMobileOpen
            ? <X aria-hidden="true" />
            : <Menu aria-hidden="true" />}
        </button>
        <nav
          ref={navigationRef}
          id="v6-primary-navigation"
          className={`v6-primary-navigation${isMobileOpen ? ' is-mobile-open' : ''}`}
          aria-label={translate('mainNavigation')}
        >
          <div className="v6-all-tools-accordion">
            <button
              ref={toggleRef}
              className="v6-all-tools-toggle"
              type="button"
              aria-expanded={isOpen}
              aria-controls="v6-mega-menu"
              onClick={() => setIsOpen((open) => !open)}
            >
              <span>{translate('allTools')}</span>
              <ChevronDown aria-hidden="true" />
            </button>
            <nav
              id="v6-mega-menu"
              className="v6-mega-menu"
              aria-label={translate('allTools')}
              hidden={!isOpen}
            >
              <div className="v6-mega-menu-heading">
                <p>{translate('pdfToolkit')}</p>
                <h2>{translate('allPdfTools')}</h2>
                <a className="v6-all-tools-link" href="/tools">{translate('allTools')}</a>
              </div>
              <ul className="v6-mega-menu-categories">
                {toolsByCategory.map((category) => (
                  <li key={category.id} className="v6-mega-menu-category">
                    <h3><a href={category.path}>{translate(`category.${category.id}`)}</a></h3>
                    <ul>
                      {category.tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <li key={tool.id}>
                            <a className="v6-mega-menu-tool" href={tool.path}>
                              <Icon aria-hidden="true" />
                              <span>{tool.name}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <a className="v6-primary-link" href="/resources">{translate('guides')}</a>
          <a className="v6-primary-link v6-mobile-nav-link" href="/about">{translate('about')}</a>
          <a className="v6-primary-link v6-mobile-nav-link" href="/contact">{translate('contact')}</a>
          <a className="v6-primary-link v6-mobile-nav-link" href="/faq">{translate('faq')}</a>
          <a className="v6-primary-link v6-mobile-nav-link" href="/privacy">{translate('privacy')}</a>
          <a className="v6-primary-link v6-mobile-nav-link" href="/security">{translate('security')}</a>
          <a className="v6-primary-link v6-mobile-nav-link" href="/terms">{translate('terms')}</a>
          <a className="v6-primary-link v6-mobile-nav-link" href="/cookies">{translate('cookiePolicy')}</a>
          <LanguagePicker
            placement="header"
            onSelected={() => {
              setIsMobileOpen(false);
              setIsOpen(false);
              if (window.matchMedia('(max-width: 768px)').matches) {
                mobileToggleRef.current?.focus();
              }
            }}
          />
        </nav>
      </div>
    </header>
  );
};

export default EditorialLightHeader;
