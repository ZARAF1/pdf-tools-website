import React, { useEffect, useRef, useState } from 'react';
import pdfjsLib from '../lib/pdfjsClient';
import { Check, Eye, X } from 'lucide-react';

const PdfPageGrid = ({
  file,
  pageCount,
  selectedPages,
  onToggle,
  actionLabel,
  selectionEnabled = true,
  startPage = 1,
  endPage,
  pageLabels = {},
  showPreviewButton = false
}) => {
  const [previews, setPreviews] = useState([]);
  const [pageSummaries, setPageSummaries] = useState([]);
  const [rendering, setRendering] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [largePreview, setLargePreview] = useState(null);
  const closeLargePreviewRef = useRef(null);
  const previewTriggerRef = useRef(null);
  const visibleStartPage = Math.max(1, startPage);
  const visibleEndPage = Math.min(endPage ?? pageCount, pageCount);

  useEffect(() => {
    let active = true;
    let loadingTask;

    const renderPages = async () => {
      setPreviews([]);
      setPageSummaries([]);
      setPreviewError('');
      setRendering(true);
      try {
        const data = new Uint8Array(await file.arrayBuffer());
        loadingTask = pdfjsLib.getDocument({ data });
        const document = await loadingTask.promise;
        const results = [];

        for (let pageNumber = visibleStartPage; pageNumber <= visibleEndPage; pageNumber += 1) {
          if (!active) return;
          const page = await document.getPage(pageNumber);
          const baseViewport = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: Math.min(1, 150 / baseViewport.width) });
          const canvas = window.document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Your browser could not render a page preview.');

          await page.render({ canvasContext: context, viewport, intent: 'print' }).promise;
          let summary = '';
          try {
            const textContent = await page.getTextContent();
            summary = textContent.items
              .map((item) => ('str' in item ? item.str : ''))
              .filter(Boolean)
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 320);
          } catch {
            summary = 'Page text could not be extracted; the preview is visual-only.';
          }
          results.push({ preview: canvas.toDataURL('image/jpeg', 0.72), summary });
          canvas.width = 0;
          canvas.height = 0;
        }

        if (active) {
          setPreviews(results.map((result) => result.preview));
          setPageSummaries(results.map((result) => result.summary));
        }
        await document.destroy();
      } catch (renderError) {
        if (active) {
          console.error('Unable to render PDF page previews:', renderError);
          setPreviewError('Page previews could not be rendered. Try a different PDF or browser.');
        }
      } finally {
        if (active) setRendering(false);
      }
    };

    renderPages();
    return () => {
      active = false;
      loadingTask?.destroy();
    };
  }, [file, pageCount, visibleStartPage, visibleEndPage]);

  const closeLargePreview = () => {
    setLargePreview(null);
    previewTriggerRef.current?.focus();
  };

  useEffect(() => {
    if (!largePreview) return undefined;
    closeLargePreviewRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeLargePreview();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [largePreview]);

  return (
    <div>
      {rendering && (
        <p className="mb-3 text-sm text-slate-500" role="status">
          Rendering previews for pages {visibleStartPage}–{visibleEndPage} of {pageCount}…
        </p>
      )}
      {previewError && <p className="mb-3 text-sm text-amber-700" role="status">{previewError}</p>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: Math.max(0, visibleEndPage - visibleStartPage + 1) }, (_, index) => {
          const pageNumber = visibleStartPage + index;
          const selected = selectedPages.has(pageNumber);
          const pageLabel = typeof pageLabels === 'function' ? pageLabels(pageNumber) : pageLabels[pageNumber];
          const PageElement = selectionEnabled ? 'button' : 'div';
          return (
            <div className="pdf-page-grid-item" key={pageNumber}>
              <PageElement
                {...(selectionEnabled
                  ? {
                      type: 'button',
                      onClick: () => onToggle(pageNumber),
                      'aria-pressed': selected
                    }
                  : {
                      role: 'group'
                    })}
                aria-label={selectionEnabled
                  ? `${selected ? 'Deselect' : 'Select'} page ${pageNumber} ${actionLabel}`
                  : `Page ${pageNumber}${pageLabel ? `, ${pageLabel}` : ''}`}
                aria-describedby={`pdf-page-${pageNumber}-description`}
                className={`pdf-page-grid-select group relative min-w-0 overflow-hidden rounded-xl border-2 p-2 text-left ${
                  selectionEnabled
                    ? 'transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:transform-none'
                    : ''
                } ${
                  selected
                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                    : 'border-slate-200 bg-white shadow-sm'
                }`}
              >
                {selectionEnabled && (
                  <span className={`absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-transform ${
                    selected ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white/90 text-transparent'
                  }`}>
                    {selected && <Check className="h-4 w-4" aria-hidden="true" />}
                  </span>
                )}
                <span className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                  {pageLabel && (
                    <span className="absolute left-3 top-3 z-10 max-w-[calc(100%-3.5rem)] truncate rounded-md bg-slate-900/80 px-2 py-1 text-[10px] font-semibold text-white">
                      {pageLabel}
                    </span>
                  )}
                  {previews[index]
                    ? <img src={previews[index]} alt="" draggable={false} className="h-full w-full object-contain" />
                    : <span className="text-sm text-slate-400">{rendering ? 'Loading…' : 'Preview unavailable'}</span>}
                </span>
                <span className="mt-2 block text-center text-xs font-semibold text-slate-600">Page {pageNumber}</span>
                <span id={`pdf-page-${pageNumber}-description`} className="sr-only">
                  {pageSummaries[index] || 'No selectable text was found on this page; its preview is visual-only.'}
                </span>
              </PageElement>
              {showPreviewButton && (
                <button
                  type="button"
                  className="merge-page-preview-button pdf-page-grid-preview-button"
                  onClick={(event) => {
                    previewTriggerRef.current = event.currentTarget;
                    setLargePreview({ pageNumber, preview: previews[index] });
                  }}
                  disabled={!previews[index]}
                  aria-label={`View larger preview of page ${pageNumber}`}
                  title={`Larger preview, page ${pageNumber}`}
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      {showPreviewButton && largePreview && (
        <div
          className="merge-page-preview-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeLargePreview();
          }}
        >
          <section
            className="merge-page-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`Page ${largePreview.pageNumber} preview`}
          >
            <div className="merge-page-preview-dialog-header">
              <h3>Page {largePreview.pageNumber} preview</h3>
              <button
                ref={closeLargePreviewRef}
                type="button"
                onClick={closeLargePreview}
                aria-label="Close larger page preview"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <img src={largePreview.preview} alt={`Larger preview of page ${largePreview.pageNumber}`} />
          </section>
        </div>
      )}
    </div>
  );
};

export default PdfPageGrid;
