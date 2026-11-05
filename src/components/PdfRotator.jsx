import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { PDFDocument, degrees } from 'pdf-lib';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import { motion } from 'framer-motion';
import pdfjsLib from '../lib/pdfjsClient';
import { formatPageRanges, parsePageRanges, parsePageRangesWhileTyping } from '../lib/pageSelection.mjs';
import { applyRotationToPages, rotatePageClockwise } from '../lib/pageRotations.mjs';
import { normalizeOutputFileName } from '../lib/outputFileName.mjs';
import { 
  Upload, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Check,
  RotateCw,
  Eye,
  X,
  FileText,
  Settings2
} from 'lucide-react';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';
import DownloadReadyCard from './DownloadReadyCard';

const PdfRotator = () => {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagePreviews, setPagePreviews] = useState([]);
  const [pdfJsDocument, setPdfJsDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState('all');
  const [pageRotations, setPageRotations] = useState([]);
  const [rangeInput, setRangeInput] = useState('');
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [outputFileName, setOutputFileName] = useState('');
  const [outputBytes, setOutputBytes] = useState(null);
  const [largePreview, setLargePreview] = useState(null);
  const markOutputDownloaded = useToolExitGuard(Boolean(file), outputBytes);
  const renderedRotationsRef = useRef([]);
  const previewRenderTaskRef = useRef(null);
  const largePreviewRenderTaskRef = useRef(null);
  const largePreviewRequestRef = useRef(0);
  const largePreviewTriggerRef = useRef(null);
  const closeLargePreviewRef = useRef(null);

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    setError(null);
    setSuccess(false);
    setOutputBytes(null);

    if (fileRejections.length > 0) {
      setError('Please choose a valid PDF file.');
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const source = await validateUnencryptedPdf(selectedFile);
      const count = source.getPageCount();
      if (!count) throw new Error('This PDF does not contain any pages.');
      setFile(selectedFile);
      setOutputFileName(`rotated_${selectedFile.name}`);
      setPageCount(count);
      setPageRotations(Array(count).fill(0));
      setSelectedPages(new Set());
      setRangeInput('');
    } catch (validationError) {
      console.error('Unable to validate PDF for rotation:', validationError);
      setError(validationError.message || 'This PDF is invalid or could not be opened.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isLoading || isProcessing
  });

  useEffect(() => {
    if (!file || !pageCount) return undefined;
    let active = true;
    let loadingTask;
    let document;
    setPagePreviews([]);
    renderedRotationsRef.current = [];

    const loadPdfDocument = async () => {
      try {
        loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
        document = await loadingTask.promise;
        if (active) setPdfJsDocument({ file, document });
      } catch (previewError) {
        if (active) {
          console.error('Unable to load PDF rotation page previews:', previewError);
          setError('Page previews could not be loaded, but you can still rotate by page number or range.');
        }
      }
    };

    loadPdfDocument();
    return () => {
      active = false;
      previewRenderTaskRef.current?.cancel();
      if (document) document.destroy();
      else loadingTask?.destroy();
    };
  }, [file, pageCount]);

  useEffect(() => {
    const document = pdfJsDocument?.file === file ? pdfJsDocument.document : null;
    if (!document || !pageRotations.length) return undefined;
    let active = true;
    let renderTask;

    const renderUpdatedPreviews = async () => {
      try {
        for (let index = 0; index < pageRotations.length; index += 1) {
          if (!active) return;
          if (renderedRotationsRef.current[index] === pageRotations[index]) continue;
          const page = await document.getPage(index + 1);
          const rotation = ((page.rotate + pageRotations[index]) % 360 + 360) % 360;
          const baseViewport = page.getViewport({ scale: 1, rotation });
          const viewport = page.getViewport({
            scale: Math.min(1, 180 / baseViewport.width),
            rotation
          });
          const canvas = window.document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Your browser could not render a page preview.');
          renderTask = page.render({ canvasContext: context, viewport, intent: 'print' });
          previewRenderTaskRef.current = renderTask;
          await renderTask.promise;
          if (!active) return;
          const preview = canvas.toDataURL('image/jpeg', 0.75);
          canvas.width = 0;
          canvas.height = 0;
          renderedRotationsRef.current[index] = pageRotations[index];
          setPagePreviews((current) => {
            const updated = [...current];
            updated[index] = preview;
            return updated;
          });
        }
      } catch (previewError) {
        if (active) {
          console.error('Unable to render PDF rotation page tiles:', previewError);
          setError('Page previews could not be rendered, but you can still rotate by page number or range.');
        }
      } finally {
        if (previewRenderTaskRef.current === renderTask) previewRenderTaskRef.current = null;
      }
    };

    renderUpdatedPreviews();
    return () => {
      active = false;
      renderTask?.cancel();
    };
  }, [file, pageRotations, pdfJsDocument]);

  const removeFile = () => {
    setFile(null);
    setPageCount(0);
    setPagePreviews([]);
    setPageRotations([]);
    setPdfJsDocument(null);
    setError(null);
    setSuccess(false);
    setOutputBytes(null);
    setRangeInput('');
    setSelectedPages(new Set());
    setOutputFileName('');
  };

  const clearResult = () => {
    setSuccess(false);
    setOutputBytes(null);
  };

  const handleRangeChange = (value) => {
    setRangeInput(value);
    const updatedSelection = parsePageRangesWhileTyping(value, pageCount);
    if (updatedSelection !== null) setSelectedPages(new Set(updatedSelection));
    setError(null);
    clearResult();
  };

  const togglePageSelection = (pageNumber) => {
    const updated = new Set(selectedPages);
    if (updated.has(pageNumber)) updated.delete(pageNumber);
    else updated.add(pageNumber);
    setSelectedPages(updated);
    setRangeInput(formatPageRanges([...updated]));
    setError(null);
    clearResult();
  };

  const closeLargePreview = useCallback(() => {
    largePreviewRequestRef.current += 1;
    largePreviewRenderTaskRef.current?.cancel();
    largePreviewRenderTaskRef.current = null;
    setLargePreview(null);
    largePreviewTriggerRef.current?.focus();
  }, []);

  const openLargePreview = async (pageNumber, event) => {
    largePreviewTriggerRef.current = event.currentTarget;
    const document = pdfJsDocument?.file === file ? pdfJsDocument.document : null;
    if (!document) return;

    largePreviewRenderTaskRef.current?.cancel();
    largePreviewRenderTaskRef.current = null;
    const requestId = largePreviewRequestRef.current + 1;
    largePreviewRequestRef.current = requestId;
    setLargePreview({ pageNumber, preview: null, error: null });
    let canvas;
    let renderTask;

    try {
      const page = await document.getPage(pageNumber);
      if (largePreviewRequestRef.current !== requestId) return;
      const rotation = ((page.rotate + (pageRotations[pageNumber - 1] || 0)) % 360 + 360) % 360;
      const baseViewport = page.getViewport({ scale: 1, rotation });
      const scale = Math.min(1.5, 1200 / baseViewport.width, 1200 / baseViewport.height);
      const viewport = page.getViewport({ scale, rotation });
      canvas = window.document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Your browser could not render a page preview.');

      renderTask = page.render({ canvasContext: context, viewport, intent: 'print' });
      largePreviewRenderTaskRef.current = renderTask;
      await renderTask.promise;
      if (largePreviewRequestRef.current === requestId) {
        setLargePreview({ pageNumber, preview: canvas.toDataURL('image/jpeg', 0.86), error: null });
      }
    } catch (previewError) {
      if (largePreviewRequestRef.current === requestId) {
        console.error('Unable to render larger PDF rotation preview:', previewError);
        setLargePreview({ pageNumber, preview: null, error: 'A larger preview could not be rendered.' });
      }
    } finally {
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
      if (largePreviewRenderTaskRef.current === renderTask) {
        largePreviewRenderTaskRef.current = null;
      }
    }
  };

  useEffect(() => {
    if (!largePreview) return undefined;
    closeLargePreviewRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeLargePreview();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [largePreview, closeLargePreview]);

  useEffect(() => () => {
    largePreviewRequestRef.current += 1;
    largePreviewRenderTaskRef.current?.cancel();
  }, []);

  const getTargetPageNumbers = () => (
    mode === 'all'
      ? Array.from({ length: pageCount }, (_, index) => index + 1)
      : [...selectedPages].sort((a, b) => a - b)
  );

  const setTargetRotation = (rotation) => {
    const targetPages = getTargetPageNumbers();
    if (!targetPages.length) {
      setError('Select at least one page before applying a rotation.');
      return;
    }
    setPageRotations((current) => applyRotationToPages(current, targetPages, rotation));
    setError(null);
    clearResult();
  };

  const rotateSinglePage = (pageNumber) => {
    setPageRotations((current) => rotatePageClockwise(current, pageNumber));
    if (mode === 'selected' && !selectedPages.has(pageNumber)) {
      const updatedSelection = new Set([...selectedPages, pageNumber]);
      setSelectedPages(updatedSelection);
      setRangeInput(formatPageRanges([...updatedSelection]));
    }
    setError(null);
    clearResult();
  };

  const targetPageNumbers = getTargetPageNumbers();
  const isPresetActive = (rotation) => (
    targetPageNumbers.length > 0
    && targetPageNumbers.every((pageNumber) => pageRotations[pageNumber - 1] === rotation)
  );
  const canRotate = mode === 'all'
    ? pageRotations.some((rotation) => rotation !== 0)
    : selectedPages.size > 0
      && [...selectedPages].some((pageNumber) => pageRotations[pageNumber - 1] !== 0);

  const handleTabKeyDown = (event) => {
    const nextMode = event.key === 'ArrowRight' || event.key === 'ArrowDown'
      ? 'selected'
      : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
        ? 'all'
        : null;
    if (!nextMode) return;
    event.preventDefault();
    setMode(nextMode);
    window.document.getElementById(`rotate-${nextMode}-pages-tab`)?.focus();
  };

  const handleRotate = async () => {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setOutputBytes(null);

    try {
      const normalizedOutputFileName = normalizeOutputFileName(outputFileName, `rotated_${file.name}`);
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();

      let pagesToRotate = [];
      if (mode === 'all') {
        pagesToRotate = Array.from({ length: pageCount }, (_, i) => i);
      } else {
        const pageNumbers = parsePageRanges(rangeInput, pageCount);
        if (!pageNumbers.length) {
          throw new Error("Please enter at least one valid page or range.");
        }
        pagesToRotate = pageNumbers.map((pageNumber) => pageNumber - 1);
      }

      for (const index of pagesToRotate) {
        const page = pdfDoc.getPage(index);
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + pageRotations[index]) % 360));
      }

      const pdfBytes = await pdfDoc.save();
      setOutputFileName(normalizedOutputFileName);
      setOutputBytes(pdfBytes);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred during rotation.");
    } finally {
      setIsProcessing(false);
    }
  };

  const outputName = outputFileName || (file ? `rotated_${file.name}` : 'rotated_document.pdf');
  const downloadRotatedPdf = (downloadFileName) => {
    if (!outputBytes) return;
    const url = URL.createObjectURL(new Blob([outputBytes], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFileName || outputName;
    link.click();
    markOutputDownloaded();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div>
      <input {...getInputProps()} />
      {!file ? (
        <div 
          {...getRootProps({ role: 'group', 'aria-label': 'Choose a PDF to rotate' })}
          className={`
            pdf-workflow-upload merge-pdf-upload-zone border-2 border-dashed rounded-2xl cursor-pointer transition-all
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
          `}
        >
          <div className="merge-pdf-upload-content">
            <div className="pdf-upload-icon" aria-hidden="true">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div className="merge-pdf-upload-copy">
              <h3>{isDragActive ? 'Drop the PDF here' : 'Choose or drop a PDF to rotate'}</h3>
              <p>Rotate all pages or selected pages in a PDF.</p>
            </div>
            <button
              type="button"
              className="pdf-editor-primary-button merge-pdf-upload-button"
              onClick={(event) => {
                event.stopPropagation();
                open();
              }}
            >
              Choose PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="rotate-pdf-workspace">
          <section className="rotate-selected-file-section" aria-labelledby="rotate-selected-file-heading">
            <header>
              <div className="merge-panel-title">
                <FileText aria-hidden="true" />
                <h3 id="rotate-selected-file-heading" className="merge-selected-files-title">File to Rotate</h3>
              </div>
              <p>One PDF selected. Replace it or remove it to choose another.</p>
            </header>
            <div className="pdf-attached-file-card rotate-selected-file-card">
              <div className="rotate-selected-file-main">
                <AttachedFileIcon />
                <div className="rotate-selected-file-details">
                  <p className="rotate-selected-file-name" title={file.name}>{file.name}</p>
                  <p className="rotate-selected-file-meta">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <AttachedFileActions
                fileName={file.name}
                onReplace={open}
                onRemove={removeFile}
                disabled={isProcessing}
              />
            </div>
          </section>

          <div className="rotate-settings-shell">
            <div className="merge-control-intro">
              <h3 className="merge-selected-files-title">Rotation Settings &amp; Preview</h3>
              <p>Choose a rotation, select pages, and review each page before processing.</p>
            </div>

            <div className="rotate-page-tabs" role="tablist" aria-label="Pages to Rotate">
              <button
                type="button"
                onClick={() => setMode('all')}
                id="rotate-all-pages-tab"
                role="tab"
                aria-selected={mode === 'all'}
                aria-controls="rotate-all-pages-panel"
                tabIndex={mode === 'all' ? 0 : -1}
                className={`rotate-page-tab ${mode === 'all' ? 'is-active' : ''}`}
                onKeyDown={handleTabKeyDown}
              >
                All Pages
              </button>
              <button
                type="button"
                onClick={() => setMode('selected')}
                id="rotate-selected-pages-tab"
                role="tab"
                aria-selected={mode === 'selected'}
                aria-controls="rotate-selected-pages-panel"
                tabIndex={mode === 'selected' ? 0 : -1}
                className={`rotate-page-tab ${mode === 'selected' ? 'is-active' : ''}`}
                onKeyDown={handleTabKeyDown}
              >
                Select Pages
              </button>
            </div>

            <section
              id={mode === 'all' ? 'rotate-all-pages-panel' : 'rotate-selected-pages-panel'}
              role="tabpanel"
              aria-labelledby={mode === 'all' ? 'rotate-all-pages-tab' : 'rotate-selected-pages-tab'}
              className="rotate-page-workspace"
            >
            <section className="rotate-settings-panel">
              <div className="merge-section-heading merge-output-settings-heading">
                <div>
                  <div className="merge-panel-title">
                    <Settings2 aria-hidden="true" />
                    <h3 className="merge-section-heading-title merge-output-settings-title">Settings</h3>
                  </div>
                  <p>Angles preview immediately and apply to all or selected pages; rotate individual pages with their buttons.</p>
                </div>
              </div>

              {mode === 'selected' && (
                <div className="rotate-page-range-controls">
                  <label htmlFor="rotate-page-ranges">Page numbers or ranges</label>
                  <input
                    id="rotate-page-ranges"
                    type="text"
                    inputMode="text"
                    placeholder="e.g. 1-3, 5"
                    aria-describedby="rotate-page-ranges-help"
                    aria-invalid={Boolean(rangeInput.trim()) && parsePageRangesWhileTyping(rangeInput, pageCount) === null}
                    value={rangeInput}
                    onChange={(event) => handleRangeChange(event.target.value)}
                  />
                  <p id="rotate-page-ranges-help">
                    Select tiles or type page numbers and ranges. Separate entries with commas.
                  </p>
                  {rangeInput.trim() && parsePageRangesWhileTyping(rangeInput, pageCount) === null && (
                    <p className="rotate-page-range-error" role="status">
                      Enter valid page numbers or ascending ranges from 1 to {pageCount}.
                    </p>
                  )}
                  <p className="rotate-page-selection-count" aria-live="polite">
                    {selectedPages.size} {selectedPages.size === 1 ? 'page' : 'pages'} selected
                  </p>
                </div>
              )}

              <fieldset className="rotate-angle-fieldset">
                <legend>Rotation angle</legend>
                <div className="flex flex-wrap gap-2">
                  {[90, 180, 270].map((angle) => (
                    <button
                      type="button"
                      key={angle}
                      onClick={() => setTargetRotation(angle)}
                      aria-pressed={isPresetActive(angle)}
                      disabled={isLoading || isProcessing || (mode === 'selected' && selectedPages.size === 0)}
                      className={`rotate-angle-button px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                        isPresetActive(angle)
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {angle}° {isPresetActive(angle) && <CheckCircle2 className="inline ml-1 w-4 h-4" />}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTargetRotation(0)}
                    aria-pressed={isPresetActive(0)}
                    disabled={isLoading || isProcessing || (mode === 'selected' && selectedPages.size === 0)}
                    className={`rotate-angle-button px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                      isPresetActive(0)
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Reset
                  </button>
                </div>
              </fieldset>
            </section>

            <section className="rotate-page-preview-panel" aria-labelledby="rotate-page-preview-heading">
              <div className="merge-section-heading merge-output-settings-heading">
                <div>
                  <div className="merge-panel-title">
                    <Eye aria-hidden="true" />
                    <h3 id="rotate-page-preview-heading" className="merge-section-heading-title merge-output-settings-title">Preview</h3>
                  </div>
                  <p>Review each page and rotate it individually with its button.</p>
                </div>
              </div>

              {isLoading ? (
                <p className="flex items-center gap-2 text-sm text-slate-500" role="status">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Loading PDF pages…
                </p>
              ) : (
                <div className="rotate-page-grid" aria-label={mode === 'all' ? 'All PDF pages' : 'Select Pages to Rotate'}>
                  {Array.from({ length: pageCount }, (_, index) => {
                    const pageNumber = index + 1;
                    const isSelected = selectedPages.has(pageNumber);
                    const pageRotation = pageRotations[index] || 0;
                    const pageTile = (
                      <>
                        <span className="rotate-page-thumbnail">
                          {pagePreviews[index]
                            ? <img src={pagePreviews[index]} alt="" />
                            : <span>Preview unavailable</span>}
                        </span>
                        <span className="rotate-page-number">
                          Page {pageNumber}{pageRotation ? ` · +${pageRotation}°` : ''}
                        </span>
                      </>
                    );

                    return (
                      <article
                        key={pageNumber}
                        className={`rotate-page-tile ${mode === 'selected' && isSelected ? 'is-selected' : ''}`}
                      >
                        <div className="rotate-page-content-wrap">
                          {mode === 'selected' ? (
                            <button
                              type="button"
                              aria-label={`Select page ${pageNumber}${pageRotation ? `, rotated clockwise ${pageRotation} degrees` : ''}`}
                              aria-pressed={isSelected}
                              onClick={() => togglePageSelection(pageNumber)}
                              disabled={isProcessing}
                              className="rotate-page-select"
                            >
                              {pageTile}
                            </button>
                          ) : (
                            <div className="rotate-page-content">{pageTile}</div>
                          )}
                          <button
                            type="button"
                            className="rotate-page-preview-button"
                            onClick={(event) => openLargePreview(pageNumber, event)}
                            disabled={isLoading || isProcessing || !pagePreviews[index]}
                            aria-label={`View larger preview of page ${pageNumber}`}
                            title={`Larger preview, page ${pageNumber}`}
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          </button>
                          {mode === 'selected' && isSelected && (
                            <span className="rotate-page-selected-indicator" aria-hidden="true">
                              <Check className="h-4 w-4" aria-hidden="true" />
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => rotateSinglePage(pageNumber)}
                          aria-label={`Rotate page ${pageNumber} clockwise by 90 degrees`}
                          title={`Rotate page ${pageNumber} clockwise`}
                          disabled={isLoading || isProcessing}
                          className="rotate-page-action"
                        >
                          <RotateCw className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
            {largePreview && (
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
                    <h3>{file.name} · Page {largePreview.pageNumber}</h3>
                    <button
                      ref={closeLargePreviewRef}
                      type="button"
                      onClick={closeLargePreview}
                      aria-label="Close larger page preview"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  {largePreview.preview ? (
                    <img src={largePreview.preview} alt={`Larger preview of page ${largePreview.pageNumber}`} />
                  ) : largePreview.error ? (
                    <p role="alert">{largePreview.error}</p>
                  ) : (
                    <p role="status">Rendering larger page preview…</p>
                  )}
                </section>
              </div>
            )}
            </section>
          </div>

            <div className="rotate-output-actions">
              <label htmlFor="rotate-output-filename">Output filename</label>
              <input
                id="rotate-output-filename"
                type="text"
                value={outputFileName}
                disabled={isProcessing}
                onChange={(event) => {
                  setOutputFileName(event.target.value);
                  setError(null);
                  clearResult();
                }}
                maxLength={120}
                autoComplete="off"
              />
              <p>The .pdf extension is added automatically when needed.</p>
              <button
                type="button"
                onClick={handleRotate}
                disabled={isLoading || isProcessing || !canRotate}
                className={`rotate-process-button flex items-center justify-center gap-2 px-6 rounded-xl font-bold text-white transition-all
                  ${isProcessing || !canRotate ? 'bg-slate-300 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-200 active:scale-[0.98]'}
                `}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RotateCw className="w-5 h-5" />
                    Rotate PDF
                  </>
                )}
              </button>
            </div>
            {isProcessing && <p className="sr-only" role="status">Rotating your PDF.</p>}
        </div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </motion.div>
      )}

      {success && outputBytes && (
        <DownloadReadyCard
          fileName={outputName}
          sizeBytes={outputBytes.length}
          showFilenameEditor={false}
          onDownload={downloadRotatedPdf}
        />
      )}
    </div>
  );
};

export default PdfRotator;
