import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { ChevronDown, Moon, Sun } from 'lucide-react';
import Home from './components/Home';
import CategoryPage from './components/CategoryPage';
import PdfMerger from './components/PdfMerger';
import PdfSplitter from './components/PdfSplitter';
import PdfRotator from './components/PdfRotator';
import ImageToPdf from './components/ImageToPdf';
import PdfToImages from './components/PdfToImages';
import PdfProtector from './components/PdfProtector';
import PdfToWord from './components/PdfToWord';
import PdfCompressor from './components/PdfCompressor';
import PdfWatermarker from './components/PdfWatermarker';
import RemovePdfPages from './components/RemovePdfPages';
import ExtractPdfPages from './components/ExtractPdfPages';
import OrganizePdf from './components/OrganizePdf';
import RedactPdf from './components/RedactPdf';
import SignPdf from './components/SignPdf';
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

function App() {
  const [theme, setTheme] = useState(() => (
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  ));
  const [openCategory, setOpenCategory] = useState(null);
  const categoryNavRef = useRef(null);
  const categoryTriggerRefs = useRef(new Map());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('pdf-tools-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!openCategory) return undefined;
    const closeOnOutsidePointer = (event) => {
      if (!categoryNavRef.current?.contains(event.target)) setOpenCategory(null);
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [openCategory]);

  const closeCategoryMenu = (event) => {
    if (event.key !== 'Escape' || !openCategory) return;
    event.preventDefault();
    setOpenCategory(null);
    categoryTriggerRefs.current.get(openCategory)?.focus();
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
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
                  <Link to="/" className="transition-colors hover:text-blue-600">Home</Link>
                  <Link to="/faq" className="transition-colors hover:text-blue-600">FAQ</Link>
                  <Link to="/resources" className="transition-colors hover:text-blue-600">Guides</Link>
                  <Link to="/privacy" className="transition-colors hover:text-blue-600">Privacy</Link>
                  <Link to="/contact" className="transition-colors hover:text-blue-600">Contact</Link>
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
            <nav
              ref={categoryNavRef}
              aria-label="PDF tool categories"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setOpenCategory(null);
              }}
              onKeyDown={closeCategoryMenu}
              className="category-menu flex flex-wrap justify-center gap-2 text-sm"
            >
              {TOOL_CATEGORIES.map((category) => {
                const isOpen = openCategory === category.id;
                const menuId = `category-tools-${category.id}`;
                const categoryTools = TOOL_REGISTRY.filter((tool) => tool.category === category.id);
                return (
                  <div key={category.id} className="relative">
                    <button
                      ref={(element) => {
                        if (element) categoryTriggerRefs.current.set(category.id, element);
                        else categoryTriggerRefs.current.delete(category.id);
                      }}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={isOpen ? menuId : undefined}
                      onClick={() => setOpenCategory((current) => (current === category.id ? null : category.id))}
                      className="category-menu-trigger inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      {category.name}
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                    {isOpen && (
                      <ul id={menuId} aria-label={`${category.name} tools`} className="category-menu-panel absolute left-0 top-full z-50 mt-1 w-max min-w-56 rounded-xl border p-2 shadow-xl">
                        <li>
                          <Link
                            to={category.path}
                            onClick={() => setOpenCategory(null)}
                            className="category-menu-link category-menu-overview-link block rounded-lg px-3 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                          >
                            All {category.name} tools
                          </Link>
                        </li>
                        {categoryTools.length
                          ? categoryTools.map((tool) => (
                            <li key={tool.id}>
                              <Link to={tool.path} onClick={() => setOpenCategory(null)} className="category-menu-link block rounded-lg px-3 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                                {tool.name}
                              </Link>
                            </li>
                          ))
                          : <li className="px-3 py-2 text-sm text-slate-500">No tools are available in this category yet.</li>}
                      </ul>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-12">
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
            <Route path="/image-to-pdf" element={<ToolPage tool="image"><ImageToPdf /></ToolPage>} />
            <Route path="/pdf-to-images" element={<ToolPage tool="pdf-images"><PdfToImages /></ToolPage>} />
            <Route path="/pdf-to-word" element={<ToolPage tool="word"><PdfToWord /></ToolPage>} />
            <Route path="/compress" element={<ToolPage tool="compress"><PdfCompressor /></ToolPage>} />
            <Route path="/watermark" element={<ToolPage tool="watermark"><PdfWatermarker /></ToolPage>} />
            <Route path="/remove-pages" element={<ToolPage tool="remove"><RemovePdfPages /></ToolPage>} />
            <Route path="/extract-pages" element={<ToolPage tool="extract"><ExtractPdfPages /></ToolPage>} />
            <Route path="/organize" element={<ToolPage tool="organize-pages"><OrganizePdf /></ToolPage>} />
            <Route path="/redact" element={<ToolPage tool="redact"><RedactPdf /></ToolPage>} />
            <Route path="/sign" element={<ToolPage tool="sign"><SignPdf /></ToolPage>} />
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
