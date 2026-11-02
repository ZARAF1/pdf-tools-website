import React, { useEffect, useRef, useState } from 'react';
import { Check, Eye, Loader2, X } from 'lucide-react';
import pdfjsLib from '../lib/pdfjsClient';

const INITIAL_PREVIEW_COUNT = 12;

const PdfMergePagePicker = ({ fileEntry, selectedPages, onTogglePage, onSelectVisible, onClear, onPreviewsReady, disabled }) => {
  const [previews, setPreviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_PREVIEW_COUNT);
  const [isRendering, setIsRendering] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [largePreview, setLargePreview] = useState(null);
  const previewTriggerRef = useRef(null);
  const closePreviewRef = useRef(null);
  const visiblePageCount = Math.min(fileEntry.pageCount, visibleCount);

  useEffect(() => {
    let active = true;
    let loadingTask;

    const renderPreviews = async () => {
      setIsRendering(true);
      setPreviewError('');
      try {
        const data = new Uint8Array(await fileEntry.file.arrayBuffer());
        loadingTask = pdfjsLib.getDocument({ data });
        const document = await loadingTask.promise;
        const results = [];

        for (let pageNumber = 1; pageNumber <= visiblePageCount; pageNumber += 1) {
          if (!active) return;
          const page = await document.getPage(pageNumber);
          const originalViewport = page.getViewport({ scale: 1 });
          const scale = Math.min(1.5, 520 / originalViewport.width, 740 / originalViewport.height);
          const viewport = page.getViewport({ scale });
          const canvas = window.document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Your browser could not render a page preview.');

          await page.render({ canvasContext: context, viewport, intent: 'print' }).promise;
          results.push({
            preview: canvas.toDataURL('image/jpeg', 0.86),
            width: originalViewport.width,
            height: originalViewport.height
          });
          canvas.width = 0;
          canvas.height = 0;
        }

        if (active) {
          setPreviews(results);
          onPreviewsReady(fileEntry.id, results);
        }
        await document.destroy();
      } catch (error) {
        if (active) {
          console.error(`Unable to render Merge PDF previews for ${fileEntry.name}:`, error);
          setPreviewError('Page previews could not be rendered. You can still merge all pages, or replace this PDF.');
        }
      } finally {
        if (active) setIsRendering(false);
      }
    };

    renderPreviews();
    return () => {
      active = false;
      loadingTask?.destroy();
    };
  }, [fileEntry, onPreviewsReady, visiblePageCount]);

  useEffect(() => {
    setVisibleCount(INITIAL_PREVIEW_COUNT);
    setPreviews([]);
    onPreviewsReady(fileEntry.id, []);
  }, [fileEntry.id, fileEntry.file, onPreviewsReady]);

  useEffect(() => {
    if (!largePreview) return undefined;
    closePreviewRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLargePreview(null);
        previewTriggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [largePreview]);

  const selectedCount = selectedPages.filter((page) => page.fileId === fileEntry.id).length;

  return (
    <section className="merge-page-source" aria-labelledby={`merge-source-${fileEntry.id}`}>
      <div className="merge-page-source-header">
        <div className="min-w-0">
          <h4 id={`merge-source-${fileEntry.id}`} className="merge-page-source-title">{fileEntry.name}</h4>
          <p>{fileEntry.pageCount} pages · {selectedCount} selected</p>
        </div>
        <div className="merge-page-source-action-group">
          <h5 className="merge-selected-files-title">Preview</h5>
          <p>Choose which pages to include in the output.</p>
          <div className="merge-page-source-actions">
            <button type="button" onClick={() => onSelectVisible(fileEntry.id, previews.length)} disabled={!previews.length || disabled}>
              Select All
            </button>
            <button type="button" onClick={() => onClear(fileEntry.id)} disabled={!selectedCount || disabled}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {previewError && <p className="merge-page-preview-error" role="status">{previewError}</p>}
      {isRendering && (
        <p className="merge-page-preview-status" role="status">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Rendering larger page previews…
        </p>
      )}
      <div className="merge-page-source-grid">
        {previews.map((preview, pageIndex) => {
          const selected = selectedPages.some(
            (page) => page.fileId === fileEntry.id && page.pageIndex === pageIndex
          );
          return (
            <div className={`merge-page-source-card${selected ? ' is-selected' : ''}`} key={pageIndex}>
              <button
                type="button"
                className="merge-page-source-select"
                aria-pressed={selected}
                aria-label={`${selected ? 'Remove' : 'Add'} page ${pageIndex + 1} from ${fileEntry.name} ${selected ? 'from' : 'to'} the live output`}
                onClick={() => onTogglePage(fileEntry, pageIndex)}
                disabled={disabled}
              >
                <span className="merge-page-source-image">
                  <img src={preview.preview} alt="" />
                  <span className={`merge-page-selection-mark${selected ? ' is-selected' : ''}`} aria-hidden="true">
                    {selected && <Check className="h-4 w-4" />}
                  </span>
                </span>
                <span className="merge-page-source-label">Page {pageIndex + 1}</span>
              </button>
              <button
                type="button"
                className="merge-page-preview-button"
                onClick={(event) => {
                  previewTriggerRef.current = event.currentTarget;
                  setLargePreview({ ...preview, pageNumber: pageIndex + 1 });
                }}
                disabled={disabled}
                aria-label={`View larger preview of ${fileEntry.name}, page ${pageIndex + 1}`}
                title={`Larger preview, page ${pageIndex + 1}`}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
      {visiblePageCount < fileEntry.pageCount && !previewError && (
        <button
          type="button"
          className="merge-page-load-more"
          onClick={() => setVisibleCount((count) => count + INITIAL_PREVIEW_COUNT)}
          disabled={isRendering || disabled}
        >
          Show next {Math.min(INITIAL_PREVIEW_COUNT, fileEntry.pageCount - visiblePageCount)} pages
        </button>
      )}

      {largePreview && (
        <div className="merge-page-preview-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setLargePreview(null);
        }}>
          <section
            className="merge-page-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`${fileEntry.name}, page ${largePreview.pageNumber} preview`}
          >
            <div className="merge-page-preview-dialog-header">
              <h3>{fileEntry.name} · Page {largePreview.pageNumber}</h3>
              <button ref={closePreviewRef} type="button" onClick={() => {
                setLargePreview(null);
                previewTriggerRef.current?.focus();
              }} aria-label="Close larger page preview">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <img src={largePreview.preview} alt={`Larger preview of page ${largePreview.pageNumber}`} />
          </section>
        </div>
      )}
    </section>
  );
};

export default PdfMergePagePicker;
