import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation, useParams } from 'react-router-dom';
import {
  BookOpenText,
  ChevronRight,
  CircleHelp,
  Grid2X2,
  Home as HomeIcon,
  Info,
  Mail,
  Moon,
  ShieldCheck,
  Sun
} from 'lucide-react';
import Home from './components/Home';
import CategoryPage from './components/CategoryPage';
import PdfMerger from './components/PdfMerger';
import PdfSplitter from './components/PdfSplitter';
import PdfRotator from './components/PdfRotator';
import ImageToPdf from './components/ImageToPdf';
import PdfToImages from './components/PdfToImages';
import PdfProtector from './components/PdfProtector';
import UnlockPdf from './components/UnlockPdf';
import PdfToWord from './components/PdfToWord';
import OcrPdf from './components/OcrPdf';
import PdfCompressor from './components/PdfCompressor';
import PdfWatermarker from './components/PdfWatermarker';
import RemovePdfPages from './components/RemovePdfPages';
import ExtractPdfPages from './components/ExtractPdfPages';
import OrganizePdf from './components/OrganizePdf';
import CropPdf from './components/CropPdf';
import RedactPdf from './components/RedactPdf';
import SignPdf from './components/SignPdf';
import EditPdf from './components/EditPdf';
import OfficeConversionNotice from './components/OfficeConversionNotice';
import ToolPage from './components/ToolPage';
import { NotFoundPage, SitePages } from './components/SitePages';
import Footer from './components/Footer';
import ToolSearch from './components/ToolSearch';
import { TOOL_CATEGORIES, TOOL_REGISTRY } from './components/toolRegistry';

const ResourceArticleRoute = () => {
  const { articleSlug } = useParams();
  return <SitePages page="resources" article={articleSlug} />;
};

const LeftNavigation = ({ theme, setTheme }) => {
  const { pathname } = useLocation();
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
    const railWidth = window.matchMedia('(max-width: 900px)').matches ? 76 : 240;
    const viewportHeight = window.innerHeight;
    const estimatedMenuHeight = window.matchMedia('(max-width: 580px)').matches
      ? viewportHeight - 16
      : 520;
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    const categoryNavRect = document.querySelector('.site-left-category-nav')?.getBoundingClientRect();
    const categoryMenuTop = categoryNavRect
      ? categoryNavRect.top - 18
      : triggerRect.top;
    const menuOffset = isMobile ? 8 : menuId === 'all' ? 18 : 0;
    const requestedTop = menuId !== 'all' && !isMobile
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

    if (event.key !== 'Tab') return;
    const items = Array.from(
      megaMenuRef.current?.querySelectorAll('[data-mega-menu-item]') || []
    );
    const currentIndex = items.indexOf(document.activeElement);
    if (event.shiftKey && currentIndex === 0) {
      event.preventDefault();
      getMegaTrigger()?.focus();
    } else if (!event.shiftKey && currentIndex === items.length - 1 && items.length > 0) {
      event.preventDefault();
      if (activeMenu === 'all') {
        items[0]?.focus();
      } else {
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
    }
  };

  return (
    <aside
      className={`site-left-navigation${activeMenu ? ' is-mega-menu-open' : ''}`}
      aria-label="Website navigation"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setActiveMenu(null);
          getMegaTrigger()?.focus();
        }
      }}
    >
      <Link to="/" className="site-left-brand" aria-label="PDF Merge Pro home">
        <span className="site-left-brand-mark">PDF</span>
        <span className="site-left-brand-name">Merge Pro</span>
      </Link>

      <nav className="site-left-primary-nav" aria-label="Main navigation">
        <NavLink to="/" end className="site-left-link" aria-label="Home">
          <HomeIcon className="site-left-link-icon" aria-hidden="true" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/faq" className="site-left-link" aria-label="FAQ">
          <CircleHelp className="site-left-link-icon" aria-hidden="true" />
          <span>FAQ</span>
        </NavLink>
        <NavLink to="/resources" className="site-left-link" aria-label="Guides">
          <BookOpenText className="site-left-link-icon" aria-hidden="true" />
          <span>Guides</span>
        </NavLink>
      </nav>

      <div className="site-left-divider" />

      <button
        type="button"
        className={`site-left-all-tools${activeMenu === 'all' ? ' is-active' : ''}`}
        aria-expanded={activeMenu === 'all'}
        aria-controls="site-tools-mega-menu"
        aria-haspopup="menu"
        aria-label="All PDF tools"
        data-mega-trigger="all"
        onClick={(event) => toggleMegaMenu(event, 'all')}
        onKeyDown={focusFirstMegaItem}
      >
        <Grid2X2 className="site-left-link-icon" aria-hidden="true" />
        <span>All tools</span>
        <ChevronRight className="site-left-link-chevron" aria-hidden="true" />
      </button>

      <nav aria-label="PDF tool categories" className="site-left-category-nav">
        <p className="site-left-section-label">Categories</p>
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
              aria-label={`${category.name} PDF tools`}
              onClick={(event) => toggleMegaMenu(event, category.id)}
              onKeyDown={focusFirstMegaItem}
            >
              {CategoryIcon && <CategoryIcon className="site-left-link-icon" aria-hidden="true" />}
              <span>{category.name}</span>
              <ChevronRight className="site-left-link-chevron" aria-hidden="true" />
            </button>
          );
        })}
      </nav>

      <div className="site-left-bottom">
        <NavLink to="/privacy" className="site-left-link site-left-privacy" aria-label="Privacy" title="Privacy">
          <ShieldCheck className="site-left-link-icon" aria-hidden="true" />
          <span>Privacy</span>
        </NavLink>
        <NavLink to="/contact" className="site-left-link site-left-contact" aria-label="Contact" title="Contact">
          <Mail className="site-left-link-icon" aria-hidden="true" />
          <span>Contact</span>
        </NavLink>
        <NavLink to="/about" className="site-left-link site-left-about" aria-label="About" title="About">
          <Info className="site-left-link-icon" aria-hidden="true" />
          <span>About</span>
        </NavLink>
        <button
          type="button"
          className="site-left-theme-button"
          onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark'
            ? <Sun className="site-left-link-icon" aria-hidden="true" />
            : <Moon className="site-left-link-icon" aria-hidden="true" />}
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </div>

      {activeMenu && (
        <div
          ref={megaMenuRef}
          id="site-tools-mega-menu"
          className={`site-tools-mega-menu${activeMenu !== 'all' ? ' is-category' : ''}`}
          role="dialog"
          aria-label={activeMenu === 'all' ? 'All PDF tools' : `${activeCategory?.name} PDF tools`}
          onKeyDown={handleMegaKeyDown}
          onMouseEnter={cancelMenuClose}
          onMouseLeave={scheduleMenuClose}
          style={{ '--mega-menu-top': `${megaPosition.top}px`, '--mega-menu-left': `${megaPosition.left}px` }}
        >
          {activeMenu === 'all' ? (
            <>
              <div className="site-tools-mega-heading">
                <div>
                  <span className="site-tools-mega-eyebrow">PDF toolkit</span>
                  <h2>All tools</h2>
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
                        <span>{category.name}</span>
                      </Link>
                      <div className="site-tools-mega-list">
                        {categoryTools.map((tool) => {
                          const ToolIcon = tool.icon;
                          return (
                            <Link
                              key={tool.id}
                              to={tool.path}
                              className="site-tools-mega-tool"
                              data-mega-menu-item
                              onClick={() => setActiveMenu(null)}
                            >
                              <span className={`site-tools-mega-tool-icon ${tool.color}`}>
                                <ToolIcon aria-hidden="true" />
                              </span>
                              <span>{tool.name}</span>
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
                  <span className="site-tools-mega-eyebrow">Category</span>
                  <h2>{activeCategory?.name}</h2>
                </div>
              </div>
              <div className="site-tools-mega-category-list">
                <Link
                  to={activeCategory?.path}
                  className="site-tools-mega-category"
                  data-mega-menu-item
                  onClick={() => setActiveMenu(null)}
                >
                  View {activeCategory?.name} category
                </Link>
                {activeCategoryTools.map((tool) => {
                  const ToolIcon = tool.icon;
                  return (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="site-tools-mega-tool"
                      data-mega-menu-item
                      onClick={() => setActiveMenu(null)}
                    >
                      <span className={`site-tools-mega-tool-icon ${tool.color}`}>
                        <ToolIcon aria-hidden="true" />
                      </span>
                      <span>{tool.name}</span>
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

    if (document.activeElement?.closest('nav')) return;

    const heading = document.querySelector('#main-content h1');
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus();
  }, [pathname]);

  return null;
};

function App() {
  const [theme, setTheme] = useState(() => (
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  ));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('pdf-tools-theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="site-app-shell">
        <RouteFocusManager />
        <a className="skip-to-content" href="#main-content">Skip to main content</a>
        <LeftNavigation theme={theme} setTheme={setTheme} />
        <div className="site-workspace">
          <header className="site-topbar">
            <div className="site-topbar-search">
              <ToolSearch />
            </div>
          </header>

          <main id="main-content" tabIndex={-1} className="site-main-content">
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
            <Route path="/image-to-pdf" element={<ToolPage tool="image"><ImageToPdf /></ToolPage>} />
            <Route path="/pdf-to-images" element={<ToolPage tool="pdf-images"><PdfToImages /></ToolPage>} />
            <Route path="/pdf-to-word" element={<ToolPage tool="word"><PdfToWord /></ToolPage>} />
            <Route path="/ocr-pdf" element={<ToolPage tool="ocr"><OcrPdf /></ToolPage>} />
            <Route path="/compress" element={<ToolPage tool="compress"><PdfCompressor /></ToolPage>} />
            <Route path="/watermark" element={<ToolPage tool="watermark"><PdfWatermarker /></ToolPage>} />
            <Route path="/remove-pages" element={<ToolPage tool="remove"><RemovePdfPages /></ToolPage>} />
            <Route path="/extract-pages" element={<ToolPage tool="extract"><ExtractPdfPages /></ToolPage>} />
            <Route path="/organize" element={<ToolPage tool="organize-pages"><OrganizePdf /></ToolPage>} />
            <Route path="/crop-pdf" element={<ToolPage tool="crop"><CropPdf /></ToolPage>} />
            <Route path="/redact" element={<ToolPage tool="redact"><RedactPdf /></ToolPage>} />
            <Route path="/sign" element={<ToolPage tool="sign"><SignPdf /></ToolPage>} />
            <Route path="/edit-pdf" element={<ToolPage tool="edit"><EditPdf /></ToolPage>} />
            <Route path="/excel-to-pdf" element={<ToolPage tool="excel"><OfficeConversionNotice format="Excel" /></ToolPage>} />
            <Route path="/powerpoint-to-pdf" element={<ToolPage tool="powerpoint"><OfficeConversionNotice format="PowerPoint" /></ToolPage>} />
            <Route path="/faq" element={<SitePages page="faq" />} />
            <Route path="/resources" element={<SitePages page="resources" />} />
            <Route path="/resources/:articleSlug" element={<ResourceArticleRoute />} />
            <Route path="/privacy" element={<SitePages page="privacy" />} />
            <Route path="/terms" element={<SitePages page="terms" />} />
            <Route path="/about" element={<SitePages page="about" />} />
            <Route path="/contact" element={<SitePages page="contact" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
