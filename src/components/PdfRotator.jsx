import React, { useState, useCallback, useEffect, useRef } from 'react';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { PDFDocument, degrees } from 'pdf-lib';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import { motion } from 'framer-motion';
import pdfjsLib from '../lib/pdfjsClient';
import { formatPageRanges, parsePageRanges, parsePageRangesWhileTyping } from '../lib/pageSelection.mjs';
import { applyRotationToPages, rotatePageClockwise } from '../lib/pageRotations.mjs';
import { 
  Upload, 
  Download, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  RotateCw,
  Settings2
} from 'lucide-react';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';

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
  const [outputBytes, setOutputBytes] = useState(null);
  const renderedRotationsRef = useRef([]);
  const previewRenderTaskRef = useRef(null);

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
      setOutputBytes(pdfBytes);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred during rotation.");
    } finally {
      setIsProcessing(false);
    }
  };

  const outputName = `rotated_${file?.name || 'document.pdf'}`;
  const downloadRotatedPdf = () => {
    if (!outputBytes) return;
    const url = URL.createObjectURL(new Blob([outputBytes], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = outputName;
    link.click();
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
              <p>One PDF file · processed in your browser</p>
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
        <div className="space-y-6">
          <div className="pdf-attached-file-card flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <AttachedFileIcon />
              <div className="truncate max-w-[200px] md:max-w-sm">
                <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <AttachedFileActions
              fileName={file.name}
              onReplace={open}
              onRemove={removeFile}
              disabled={isProcessing}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <Settings2 className="w-5 h-5 text-slate-400" />
              <h3 className="font-semibold text-slate-700">Rotation Settings</h3>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-slate-700">Rotation Angle</legend>
              <div className="flex flex-wrap gap-2">
                  {[90, 180, 270].map((angle) => (
                    <button
                      type="button"
                      key={angle}
                      onClick={() => setTargetRotation(angle)}
                      aria-pressed={isPresetActive(angle)}
                      disabled={isLoading || isProcessing || (mode === 'selected' && selectedPages.size === 0)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                      isPresetActive(0)
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Reset
                  </button>
              </div>
              <p className="text-xs text-slate-500">
                Angle buttons update the page previews immediately. In Selected Pages mode, they apply only to selected pages; use each page&apos;s rotate button for an individual adjustment.
              </p>
            </fieldset>

            <div className="rotate-page-tabs" role="tablist" aria-label="Pages to rotate">
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
                    Selected Pages
                  </button>
            </div>

            <section
              id={mode === 'all' ? 'rotate-all-pages-panel' : 'rotate-selected-pages-panel'}
              role="tabpanel"
              aria-labelledby={mode === 'all' ? 'rotate-all-pages-tab' : 'rotate-selected-pages-tab'}
              className="space-y-4"
            >
              {mode === 'selected' && (
                <div className="space-y-2">
                  <label htmlFor="rotate-page-ranges" className="text-sm font-semibold text-slate-700">
                    Page Numbers / Ranges
                  </label>
                  <input
                    id="rotate-page-ranges"
                    type="text"
                    inputMode="text"
                    placeholder="e.g. 1-3, 5"
                    aria-describedby="rotate-page-ranges-help"
                    aria-invalid={Boolean(rangeInput.trim()) && parsePageRangesWhileTyping(rangeInput, pageCount) === null}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    value={rangeInput}
                    onChange={(event) => handleRangeChange(event.target.value)}
                  />
                  <p id="rotate-page-ranges-help" className="text-xs text-slate-500">
                    Select tiles or type page numbers and ranges. Separate entries with commas.
                  </p>
                  {rangeInput.trim() && parsePageRangesWhileTyping(rangeInput, pageCount) === null && (
                    <p className="text-sm text-red-600" role="status">
                      Enter valid page numbers or ascending ranges from 1 to {pageCount}.
                    </p>
                  )}
                  <p className="text-sm font-medium text-slate-600" aria-live="polite">
                    {selectedPages.size} {selectedPages.size === 1 ? 'page' : 'pages'} selected
                  </p>
                </div>
              )}

              {isLoading ? (
                <p className="flex items-center gap-2 text-sm text-slate-500" role="status">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Loading PDF pages…
                </p>
              ) : (
                <div className="rotate-page-grid" aria-label={mode === 'all' ? 'All PDF pages' : 'Select pages to rotate'}>
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

            <button
              type="button"
              onClick={handleRotate}
              disabled={isLoading || isProcessing || !canRotate}
              className={`
                w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white transition-all
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
            {isProcessing && <p className="sr-only" role="status">Rotating your PDF.</p>}
          </div>
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

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          role="status"
          className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200"
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium">{outputName} is ready. Click to download.</span>
            <button type="button" onClick={downloadRotatedPdf} className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700">
              <Download className="h-4 w-4" aria-hidden="true" /> Download PDF
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PdfRotator;
