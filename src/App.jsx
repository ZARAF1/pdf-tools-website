import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate, useLocation, useParams } from 'react-router-dom';
import {
  BookOpenText,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Grid2X2,
  Home as HomeIcon,
  Info,
  Mail,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Sun
} from 'lucide-react';
import Home from './components/Home';
import CategoryPage from './components/CategoryPage';
const PdfMerger = lazy(() => import('./components/PdfMerger'));
const PdfSplitter = lazy(() => import('./components/PdfSplitter'));
const PdfRotator = lazy(() => import('./components/PdfRotator'));
const PdfProtector = lazy(() => import('./components/PdfProtector'));
const ImagePdf = lazy(() => import('./components/ImagePdf'));
const UnlockPdf = lazy(() => import('./components/UnlockPdf'));
const PdfToWord = lazy(() => import('./components/PdfToWord'));
const PdfPowerPoint = lazy(() => import('./components/PdfPowerPoint'));
const PdfMarkdown = lazy(() => import('./components/PdfMarkdown'));
const OcrPdf = lazy(() => import('./components/OcrPdf'));
const PdfCompressor = lazy(() => import('./components/PdfCompressor'));
const PdfWatermarker = lazy(() => import('./components/PdfWatermarker'));
const RemovePdfPages = lazy(() => import('./components/RemovePdfPages'));
const OrganizePdf = lazy(() => import('./components/OrganizePdf'));
const CropPdf = lazy(() => import('./components/CropPdf'));
const RedactPdf = lazy(() => import('./components/RedactPdf'));
const SignPdf = lazy(() => import('./components/SignPdf'));
const EditPdf = lazy(() => import('./components/EditPdf'));
import OfficeConversionNotice from './components/OfficeConversionNotice';
import ToolPage from './components/ToolPage';
import { ToolExitGuardProvider } from './components/ToolExitGuard';
import { NotFoundPage, SitePages, ToolGuidePage } from './components/SitePages';
import Footer from './components/Footer';
import LanguagePicker from './components/LanguagePicker';
import ToolSearch from './components/ToolSearch';
import { TOOL_CATEGORIES, TOOL_REGISTRY } from './components/toolRegistry';
import { LanguageProvider } from './i18n/LanguageProvider';
import { useLanguage } from './i18n/useLanguage';
import { LANGUAGE_REGIONS, SUPPORTED_LANGUAGES } from './i18n/languageCatalog.mjs';
import { getLocalizedTool } from './i18n/toolTranslations.mjs';

const ResourceArticleRoute = () => {
  const { articleSlug } = useParams();
  return <SitePages page="resources" article={articleSlug} />;
};

const ToolGuideRoute = () => {
  const { toolId } = useParams();
  return <ToolGuidePage toolId={toolId} />;
};

const RouteLoadingFallback = () => {
  const { translate } = useLanguage();
  return <p className="route-loading-status" role="status">{translate('loadingTool')}</p>;
};

const RouteErrorFallback = () => {
  const { translate } = useLanguage();
  return (
    <section className="route-loading-status" role="alert">
      <h1>{translate('routeLoadFailed')}</h1>
      <button
        type="button"
        className="pdf-editor-primary-button"
        onClick={() => window.location.reload()}
      >
        {translate('reloadPage')}
      </button>
    </section>
  );
};

class RouteErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unable to render the requested route.', error, errorInfo);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

const RouteErrorBoundaryWithLocation = ({ children, fallback }) => {
  const { pathname } = useLocation();
  return (
    <RouteErrorBoundary key={pathname} fallback={fallback}>
      {children}
    </RouteErrorBoundary>
  );
};

const NavigationCollapseButton = ({ isSidebarCollapsed, onToggleSidebar, className }) => {
  const { translate } = useLanguage();

  return (
    <button
      type="button"
      className={className}
      aria-label={translate(isSidebarCollapsed ? 'expandNavigation' : 'collapseNavigation')}
      title={translate(isSidebarCollapsed ? 'expandNavigation' : 'collapseNavigation')}
      aria-pressed={isSidebarCollapsed}
      aria-controls="site-left-navigation"
      onClick={onToggleSidebar}
    >
      {isSidebarCollapsed
        ? <PanelLeftOpen className="site-left-collapse-panel-icon" aria-hidden="true" />
        : <PanelLeftClose className="site-left-collapse-panel-icon" aria-hidden="true" />}
      {isSidebarCollapsed
        ? <ChevronRight className="site-left-collapse-arrow-icon" aria-hidden="true" />
        : <ChevronLeft className="site-left-collapse-arrow-icon" aria-hidden="true" />}
    </button>
  );
};

const LeftNavigation = ({ theme, setTheme, isSidebarCollapsed, onToggleSidebar }) => {
  const { pathname } = useLocation();
  const { language, setLanguage, translate } = useLanguage();
  const [activeMenu, setActiveMenu] = useState(null);
  const [megaPosition, setMegaPosition] = useState({ top: 12, left: 252 });
  const megaMenuRef = useRef(null);
  const closeMenuTimerRef = useRef(null);
  const currentTool = TOOL_REGISTRY.find((tool) => tool.path === pathname);
  const activeCategoryId = TOOL_CATEGORIES.find((category) => category.path === pathname)?.id
    || currentTool?.category;
  const menuCategoryId = activeMenu && activeMenu !== 'all' ? activeMenu : null;
  const selectedCategoryId = menuCategoryId || activeCategoryId;
  const activeCategory = TOOL_CATEGORIES.find((category) => category.id === activeMenu);
  const activeCategoryTools = activeCategory
    ? TOOL_REGISTRY.filter((tool) => tool.category === activeCategory.id)
    : [];

  const getMegaTrigger = () => (
    document.querySelector(`[data-mega-trigger="${activeMenu}"]`)
  );

  const cancelMenuClose = () => {
    if (closeMenuTimerRef.current) {
      window.clearTimeout(closeMenuTimerRef.current);
      closeMenuTimerRef.current = null;
    }
  };

  const scheduleMenuClose = () => {
    cancelMenuClose();
    closeMenuTimerRef.current = window.setTimeout(() => {
      setActiveMenu(null);
      closeMenuTimerRef.current = null;
    }, 180);
  };

  const toggleMegaMenu = (event, menuId) => {
    cancelMenuClose();
    const triggerRect = event.currentTarget.getBoundingClientRect();
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    const railWidth = isMobile || isSidebarCollapsed ? 76 : 240;
    const viewportHeight = window.innerHeight;
    const estimatedMenuHeight = window.matchMedia('(max-width: 580px)').matches
      ? viewportHeight - 16
      : 520;
    const categoryNavRect = document.querySelector('.site-left-category-nav')?.getBoundingClientRect();
    const categoryMenuTop = categoryNavRect
      ? categoryNavRect.top - 18
      : triggerRect.top;
    const menuOffset = isMobile ? 8 : menuId === 'all' ? 18 : 0;
    const requestedTop = menuId !== 'all' && menuId !== 'language' && !isMobile
      ? categoryMenuTop
      : triggerRect.top + menuOffset;
    const top = Math.max(8, Math.min(
      requestedTop,
      viewportHeight - estimatedMenuHeight - 8
    ));

    setMegaPosition({
      top: top + 0,
      left: railWidth + 12
    });
    setActiveMenu((current) => current === menuId ? null : menuId);
    event.currentTarget.focus();
  };

  useEffect(() => () => cancelMenuClose(), []);

  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  useEffect(() => {
    setActiveMenu(null);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    if (!activeMenu) return undefined;
    const handlePointerDown = (event) => {
      if (
        megaMenuRef.current?.contains(event.target)
        || event.target.closest('[data-mega-trigger]')
      ) {
        return;
      }
      setActiveMenu(null);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [activeMenu]);

  const focusFirstMegaItem = (event) => {
    if (event.key !== 'Tab' || event.shiftKey) return;
    if (!activeMenu || event.currentTarget.dataset.megaTrigger !== activeMenu) return;
    const firstItem = megaMenuRef.current?.querySelector('[data-mega-menu-item]');
    if (!firstItem) return;
    event.preventDefault();
    firstItem.focus();
  };

  const handleMegaKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setActiveMenu(null);
      getMegaTrigger()?.focus();
      return;
    }

    if (activeMenu === 'language' && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      const options = Array.from(
        megaMenuRef.current?.querySelectorAll('[data-language-option]') || []
      );
      const currentIndex = options.indexOf(document.activeElement);
      const nextIndex = event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? options.length - 1
          : (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      event.preventDefault();
      options[nextIndex]?.focus();
      return;
    }

    if (event.key !== 'Tab') return;
    const items = Array.from(
      megaMenuRef.current?.querySelectorAll('[data-mega-menu-item]') || []
    );
    const currentIndex = items.indexOf(document.activeElement);
    if (event.shiftKey && currentIndex === 0) {
      event.preventDefault();
      getMegaTrigger()?.focus();
    } else if (
      !event.shiftKey
      && currentIndex === items.length - 1
      && items.length > 0
    ) {
      event.preventDefault();
      if (activeMenu === 'all') {
        setActiveMenu(null);
        document.querySelector('[data-mega-trigger="organize"]')?.focus();
        return;
      }
      if (activeMenu === 'language') {
        setActiveMenu(null);
        document.querySelector('[data-mega-trigger="all"]')?.focus();
        return;
      }
      const currentIndexInCategories = TOOL_CATEGORIES.findIndex(
        (category) => category.id === activeMenu
      );
      const nextCategory = TOOL_CATEGORIES[currentIndexInCategories + 1];
      setActiveMenu(null);
      if (nextCategory) {
        document.querySelector(`[data-mega-trigger="${nextCategory.id}"]`)?.focus();
      } else {
        document.querySelector('.site-left-privacy')?.focus();
      }
    }
  };

  return (
    <aside
      id="site-left-navigation"
      className={`site-left-navigation${isSidebarCollapsed ? ' is-collapsed' : ''}${activeMenu ? ' is-mega-menu-open' : ''}`}
      aria-label={translate('mainNavigation')}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setActiveMenu(null);
          getMegaTrigger()?.focus();
        }
      }}
    >
      <div className="site-left-brand-row">
        <Link to="/" className="site-left-brand" aria-label="PDF Merge Pro home">
          <span className="site-left-brand-mark">PDF</span>
          <span className="site-left-brand-name">Merge Pro</span>
        </Link>
      </div>

      <nav className="site-left-primary-nav" aria-label={translate('mainNavigation')}>
        <NavLink to="/" end className="site-left-link" aria-label={translate('home')}>
          <HomeIcon className="site-left-link-icon" aria-hidden="true" />
          <span>{translate('home')}</span>
        </NavLink>
        <NavLink to="/faq" className="site-left-link" aria-label={translate('faq')}>
          <CircleHelp className="site-left-link-icon" aria-hidden="true" />
          <span>{translate('faq')}</span>
        </NavLink>
        <NavLink to="/resources" className="site-left-link" aria-label={translate('guides')}>
          <BookOpenText className="site-left-link-icon" aria-hidden="true" />
          <span>{translate('guides')}</span>
        </NavLink>
        <LanguagePicker
          placement="sidebar"
          isOpen={activeMenu === 'language'}
          onToggle={(event) => toggleMegaMenu(event, 'language')}
          onSelected={() => {
            setActiveMenu(null);
            getMegaTrigger()?.focus();
          }}
          onKeyDown={focusFirstMegaItem}
        />
      </nav>

      <div className="site-left-divider" />

      <button
        type="button"
        className={`site-left-all-tools${activeMenu === 'all' ? ' is-active' : ''}`}
        aria-expanded={activeMenu === 'all'}
        aria-controls="site-tools-mega-menu"
        aria-haspopup="menu"
        aria-label={translate('allTools')}
        data-mega-trigger="all"
        onClick={(event) => toggleMegaMenu(event, 'all')}
        onKeyDown={focusFirstMegaItem}
      >
        <Grid2X2 className="site-left-link-icon" aria-hidden="true" />
        <span>{translate('allTools')}</span>
        <ChevronRight className="site-left-link-chevron" aria-hidden="true" />
      </button>

      <nav aria-label={translate('categories')} className="site-left-category-nav">
        <p className="site-left-section-label">{translate('categories')}</p>
        {TOOL_CATEGORIES.map((category) => {
          const CategoryIcon = TOOL_REGISTRY.find((tool) => tool.category === category.id)?.icon;
          const isSelected = selectedCategoryId === category.id;
          const isRouteActive = activeCategoryId === category.id && (!activeMenu || activeMenu === 'all');
          return (
            <button
              key={category.id}
              type="button"
              aria-current={isRouteActive
                ? category.path === pathname ? 'page' : 'location'
                : undefined}
              className={`site-left-category-link${isSelected ? ' is-active' : ''}`}
              data-mega-trigger={category.id}
              aria-expanded={activeMenu === category.id}
              aria-controls="site-tools-mega-menu"
              aria-label={translate(`category.${category.id}`)}
              title={translate(`category.${category.id}`)}
              onClick={(event) => toggleMegaMenu(event, category.id)}
              onKeyDown={focusFirstMegaItem}
            >
              {CategoryIcon && <CategoryIcon className="site-left-link-icon" aria-hidden="true" />}
              <span>{translate(`category.${category.id}`)}</span>
              <ChevronRight className="site-left-link-chevron" aria-hidden="true" />
            </button>
          );
        })}
      </nav>

      <div className="site-left-collapse-control">
        <NavigationCollapseButton
          className="site-left-collapse-button"
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => {
            setActiveMenu(null);
            onToggleSidebar();
          }}
        />
      </div>

      <div className="site-left-bottom">
        <NavLink to="/privacy" className="site-left-link site-left-privacy" aria-label={translate('privacy')} title={translate('privacy')}>
          <ShieldCheck className="site-left-link-icon" aria-hidden="true" />
          <span>{translate('privacy')}</span>
        </NavLink>
        <NavLink to="/contact" className="site-left-link site-left-contact" aria-label={translate('contact')} title={translate('contact')}>
          <Mail className="site-left-link-icon" aria-hidden="true" />
          <span>{translate('contact')}</span>
        </NavLink>
        <NavLink to="/about" className="site-left-link site-left-about" aria-label={translate('about')} title={translate('about')}>
          <Info className="site-left-link-icon" aria-hidden="true" />
          <span>{translate('about')}</span>
        </NavLink>
        <button
          type="button"
          className="site-left-theme-button"
          onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          aria-label={translate(theme === 'dark' ? 'switchToLightMode' : 'switchToDarkMode')}
          title={translate(theme === 'dark' ? 'switchToLightMode' : 'switchToDarkMode')}
        >
          {theme === 'dark'
            ? <Sun className="site-left-link-icon" aria-hidden="true" />
            : <Moon className="site-left-link-icon" aria-hidden="true" />}
          <span>{translate(theme === 'dark' ? 'lightMode' : 'darkMode')}</span>
        </button>
      </div>

      {activeMenu && (
        <div
          ref={megaMenuRef}
          id="site-tools-mega-menu"
          className={`site-tools-mega-menu${activeMenu !== 'all' && activeMenu !== 'language' ? ' is-category' : ''}${activeMenu === 'language' ? ' site-language-mega-menu' : ''}`}
          role="dialog"
          aria-label={activeMenu === 'all'
            ? translate('allTools')
            : activeMenu === 'language'
              ? translate('chooseLanguage')
              : `${translate('categories')}: ${translate(`category.${activeCategory?.id}`)}`}
          onKeyDown={handleMegaKeyDown}
          onBlur={(event) => {
            if (!megaMenuRef.current?.contains(event.relatedTarget)) setActiveMenu(null);
          }}
          onMouseEnter={cancelMenuClose}
          onMouseLeave={scheduleMenuClose}
          style={{ '--mega-menu-top': `${megaPosition.top}px`, '--mega-menu-left': `${megaPosition.left}px` }}
        >
          {activeMenu === 'language' ? (
            <>
              <div className="site-tools-mega-heading">
                <div>
                  <span className="site-tools-mega-eyebrow">{translate('pdfToolkit')}</span>
                  <h2>{translate('chooseLanguage')}</h2>
                </div>
              </div>
              <div className="site-language-columns">
                {LANGUAGE_REGIONS.map((region) => (
                  <section
                    key={region.name}
                    className="site-language-column"
                    aria-label={region.name}
                  >
                    <h3 className="site-tools-mega-category">{region.name}</h3>
                    <div className="site-language-list">
                      {region.languages.map((code) => {
                        const option = SUPPORTED_LANGUAGES.find((item) => item.code === code);
                        return (
                          <button
                            key={code}
                            type="button"
                            className="site-tools-mega-tool site-language-option"
                            aria-pressed={language === code}
                            data-mega-menu-item
                            data-language-option
                            lang={code}
                            dir={code === 'ar' ? 'rtl' : 'ltr'}
                            onClick={() => {
                              setLanguage(code);
                              setActiveMenu(null);
                              getMegaTrigger()?.focus();
                            }}
                          >
                            <span>{option.name}</span>
                            {language === code && <Check aria-hidden="true" />}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </>
          ) : activeMenu === 'all' ? (
            <>
              <div className="site-tools-mega-heading">
                <div>
                  <span className="site-tools-mega-eyebrow">{translate('pdfToolkit')}</span>
                  <h2>{translate('allTools')}</h2>
                </div>
              </div>
              <div className="site-tools-mega-columns">
                {TOOL_CATEGORIES.map((category) => {
                  const categoryTools = TOOL_REGISTRY.filter((tool) => tool.category === category.id);
                  return (
                    <section key={category.id} className="site-tools-mega-column">
                      <Link
                        to={category.path}
                        className="site-tools-mega-category"
                        data-mega-menu-item
                        onClick={() => setActiveMenu(null)}
                      >
                        <span>{translate(`category.${category.id}`)}</span>
                      </Link>
                      <div className="site-tools-mega-list">
                        {categoryTools.map((tool) => {
                          const localizedTool = getLocalizedTool(language, tool);
                          const ToolIcon = localizedTool.icon;
                          return (
                            <Link
                              key={localizedTool.id}
                              to={localizedTool.path}
                              className="site-tools-mega-tool"
                              data-mega-menu-item
                              onClick={() => setActiveMenu(null)}
                            >
                              <span className={`site-tools-mega-tool-icon ${localizedTool.color}`}>
                                <ToolIcon aria-hidden="true" />
                              </span>
                              <span>{localizedTool.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="site-tools-mega-heading">
                <div>
                  <span className="site-tools-mega-eyebrow">{translate('categories')}</span>
                  <h2>{translate(`category.${activeCategory?.id}`)}</h2>
                </div>
              </div>
              <div className="site-tools-mega-category-list">
                <Link
                  to={activeCategory?.path}
                  className="site-tools-mega-category"
                  data-mega-menu-item
                  onClick={() => setActiveMenu(null)}
                >
                  {translate('viewCategory')} {translate(`category.${activeCategory?.id}`)}
                </Link>
                {activeCategoryTools.map((tool) => {
                  const localizedTool = getLocalizedTool(language, tool);
                  const ToolIcon = localizedTool.icon;
                  return (
                    <Link
                      key={localizedTool.id}
                      to={localizedTool.path}
                      className="site-tools-mega-tool"
                      data-mega-menu-item
                      onClick={() => setActiveMenu(null)}
                    >
                      <span className={`site-tools-mega-tool-icon ${localizedTool.color}`}>
                        <ToolIcon aria-hidden="true" />
                      </span>
                      <span>{localizedTool.name}</span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </aside>
  );
};

const RouteFocusManager = () => {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;

    const mainContent = document.querySelector('#main-content');
    if (!mainContent) return;

    const focusHeading = () => {
      const heading = mainContent.querySelector('h1');
      if (!heading) return false;
      heading.tabIndex = -1;
      heading.focus();
      return true;
    };

    if (focusHeading()) return;

    const observer = new MutationObserver(() => {
      if (focusHeading()) observer.disconnect();
    });
    observer.observe(mainContent, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
};

function App() {
  const [theme, setTheme] = useState(() => (
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  ));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('pdf-tools-theme', theme);
  }, [theme]);

  return (
    <LanguageProvider>
    <Router>
      <ToolExitGuardProvider>
      <div className={`site-app-shell${isSidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}>
        <RouteFocusManager />
        <a className="skip-to-content" href="#tool-search">Skip to main content</a>
        <div className="site-workspace">
          <header className="site-topbar">
            <div className="site-topbar-search">
              <ToolSearch />
            </div>
          </header>

          <LeftNavigation
            theme={theme}
            setTheme={setTheme}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed((current) => !current)}
          />

          <main id="main-content" tabIndex={-1} className="site-main-content">
          <RouteErrorBoundaryWithLocation fallback={<RouteErrorFallback />}>
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                {TOOL_CATEGORIES.map((category) => (
                  <Route
                    key={category.id}
                    path={category.path}
                    element={<CategoryPage category={category} />}
                  />
                ))}
                <Route path="/merge" element={<ToolPage tool="merge"><PdfMerger /></ToolPage>} />
                <Route path="/split" element={<ToolPage tool="split"><PdfSplitter /></ToolPage>} />
                <Route path="/rotate" element={<ToolPage tool="rotate"><PdfRotator /></ToolPage>} />
                <Route path="/protect" element={<ToolPage tool="protect"><PdfProtector /></ToolPage>} />
                <Route path="/unlock" element={<ToolPage tool="unlock"><UnlockPdf /></ToolPage>} />
                <Route path="/image-pdf" element={<ToolPage tool="image-pdf"><ImagePdf /></ToolPage>} />
                <Route path="/image-to-pdf" element={<Navigate to="/image-pdf?direction=images-to-pdf" replace />} />
                <Route path="/pdf-to-images" element={<Navigate to="/image-pdf?direction=pdf-to-images" replace />} />
                <Route path="/resources/tools/image" element={<Navigate to="/resources/tools/image-pdf" replace />} />
                <Route path="/resources/tools/pdf-images" element={<Navigate to="/resources/tools/image-pdf" replace />} />
                <Route path="/pdf-to-word" element={<ToolPage tool="word"><PdfToWord /></ToolPage>} />
                <Route path="/pdf-to-powerpoint" element={<ToolPage tool="powerpoint"><PdfPowerPoint /></ToolPage>} />
                <Route path="/pdf-to-markdown" element={<ToolPage tool="markdown"><PdfMarkdown /></ToolPage>} />
                <Route path="/ocr-pdf" element={<ToolPage tool="ocr"><OcrPdf /></ToolPage>} />
                <Route path="/compress" element={<ToolPage tool="compress"><PdfCompressor /></ToolPage>} />
                <Route path="/watermark" element={<ToolPage tool="watermark"><PdfWatermarker /></ToolPage>} />
                <Route path="/remove-pages" element={<ToolPage tool="remove"><RemovePdfPages /></ToolPage>} />
                <Route path="/extract-pages" element={<Navigate to="/split" replace />} />
                <Route path="/organize" element={<ToolPage tool="organize-pages"><OrganizePdf /></ToolPage>} />
                <Route path="/crop-pdf" element={<ToolPage tool="crop"><CropPdf /></ToolPage>} />
                <Route path="/redact" element={<ToolPage tool="redact"><RedactPdf /></ToolPage>} />
                <Route path="/sign" element={<ToolPage tool="sign"><SignPdf /></ToolPage>} />
                <Route path="/edit-pdf" element={<ToolPage tool="edit"><EditPdf /></ToolPage>} />
                <Route path="/excel-to-pdf" element={<ToolPage tool="excel"><OfficeConversionNotice format="Excel" /></ToolPage>} />
                <Route path="/powerpoint-to-pdf" element={<Navigate to="/pdf-to-powerpoint" replace />} />
                <Route path="/faq" element={<SitePages page="faq" />} />
                <Route path="/resources" element={<SitePages page="resources" />} />
                <Route path="/resources/tools/:toolId" element={<ToolGuideRoute />} />
                <Route path="/resources/:articleSlug" element={<ResourceArticleRoute />} />
                <Route path="/privacy" element={<SitePages page="privacy" />} />
                <Route path="/security" element={<SitePages page="security" />} />
                <Route path="/terms" element={<SitePages page="terms" />} />
                <Route path="/cookies" element={<SitePages page="cookies" />} />
                <Route path="/about" element={<SitePages page="about" />} />
                <Route path="/contact" element={<SitePages page="contact" />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </RouteErrorBoundaryWithLocation>
        </main>

        <Footer />
        </div>
      </div>
      </ToolExitGuardProvider>
    </Router>
    </LanguageProvider>
  );
}

export default App;
