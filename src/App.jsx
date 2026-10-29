import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
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

const CategoryNavigation = () => {
  const { pathname } = useLocation();
  const currentTool = TOOL_REGISTRY.find((tool) => tool.path === pathname);
  const activeCategoryId = TOOL_CATEGORIES.find((category) => category.path === pathname)?.id
    || currentTool?.category;

  return (
    <nav aria-label="PDF tool categories" className="category-tab-bar">
      {TOOL_CATEGORIES.map((category) => {
        const CategoryIcon = TOOL_REGISTRY.find((tool) => tool.category === category.id)?.icon;
        const isActive = activeCategoryId === category.id;
        return (
          <Link
            key={category.id}
            to={category.path}
            aria-current={category.path === pathname ? 'page' : isActive ? 'location' : undefined}
            className="category-tab-link"
          >
            {CategoryIcon && <CategoryIcon className="h-5 w-5" aria-hidden="true" />}
            <span className="category-tab-label">{category.name}</span>
          </Link>
        );
      })}
    </nav>
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
      <div className="min-h-screen flex flex-col">
        <RouteFocusManager />
        <a className="skip-to-content" href="#main-content">Skip to main content</a>
        <header className="site-surface border-b border-slate-200 py-5">
          <div className="container mx-auto space-y-5 px-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <Link to="/" className="flex flex-col items-center md:items-start">
                <span className="text-3xl font-bold text-slate-800 tracking-tight">
                  PDF <span className="text-blue-600">Merge</span> Pro
                </span>
                <p className="text-center md:text-left text-slate-500 text-sm">
                  Browser-based PDF tools for everyday documents.
                </p>
              </Link>
              <div className="flex items-center justify-center gap-5">
                <nav aria-label="Main navigation" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium text-slate-600">
                  <NavLink to="/" end className="site-utility-link">Home</NavLink>
                  <NavLink to="/faq" className="site-utility-link">FAQ</NavLink>
                  <NavLink to="/resources" className="site-utility-link">Guides</NavLink>
                  <NavLink to="/privacy" className="site-utility-link">Privacy</NavLink>
                  <NavLink to="/contact" className="site-utility-link">Contact</NavLink>
                </nav>
                <button
                  type="button"
                  onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  {theme === 'dark'
                    ? <Sun className="h-5 w-5" aria-hidden="true" />
                    : <Moon className="h-5 w-5" aria-hidden="true" />}
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <ToolSearch />
            </div>
            <CategoryNavigation />
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="flex-grow container mx-auto px-4 py-12">
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
    </Router>
  );
}

export default App;
