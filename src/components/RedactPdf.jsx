import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import { PDFDocument } from 'pdf-lib';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { CheckCircle2, ChevronLeft, ChevronRight, Eye, FileText, Loader2, RotateCcw, Settings2, Trash2, Upload } from 'lucide-react';
import pdfjsLib from '../lib/pdfjsClient';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';
import DownloadReadyCard from './DownloadReadyCard';
import { normalizeOutputFileName } from '../lib/outputFileName.mjs';

const MAX_PAGES = 30;

const clamp = (value) => Math.min(1, Math.max(0, value));

const canvasBlob = (canvas) => new Promise((resolve, reject) => {
  canvas.toBlob((blob) => {
    if (blob) resolve(blob);
    else reject(new Error('The browser could not encode a redacted page.'));
  }, 'image/png');
});

const RedactPdf = () => {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [previews, setPreviews] = useState([]);
  const [pageSummaries, setPageSummaries] = useState([]);
  const [marksByPage, setMarksByPage] = useState({});
  const [coordinateBox, setCoordinateBox] = useState({ x: '10', y: '10', width: '30', height: '15' });
  const [draft, setDraft] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState(null);
  const [outputFileName, setOutputFileName] = useState('');
  const markOutputDownloaded = useToolExitGuard(Boolean(file), output);
  const [error, setError] = useState('');
  const [previewError, setPreviewError] = useState('');
  const requestId = useRef(0);
  const drawing = useRef(null);

  const clearOutput = () => setOutput(null);

  const onDrop = useCallback(async (acceptedFiles, rejections) => {
    setError('');
    clearOutput();
    if (rejections.length) {
      setError('Please choose one valid PDF file.');
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;
    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;
    setIsLoading(true);

    try {
      const source = await validateUnencryptedPdf(selectedFile);
      const count = source.getPageCount();
      if (!count) throw new Error('This PDF does not contain any pages.');
      if (count > MAX_PAGES) throw new Error(`This tool supports PDFs with up to ${MAX_PAGES} pages; this file has ${count}.`);
      if (requestId.current === currentRequest) {
        setCurrentPage(1);
        setPreviews([]);
        setPageSummaries([]);
        setMarksByPage({});
        setFile(selectedFile);
        setPageCount(count);
        setOutputFileName(`${selectedFile.name.replace(/\.pdf$/i, '')}_redacted.pdf`);
      }
    } catch (loadError) {
      console.error('Unable to load PDF for redaction:', loadError);
      if (requestId.current === currentRequest) setError(loadError.message || 'This PDF is invalid or could not be opened.');
    } finally {
      if (requestId.current === currentRequest) setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isLoading || isProcessing,
    noClick: Boolean(file),
    noKeyboard: Boolean(file)
  });

  useEffect(() => {
    if (!file || !pageCount) return undefined;
    let active = true;
    let loadingTask;

    const renderPreviews = async () => {
      setPreviews([]);
      setPageSummaries([]);
      setPreviewError('');
      try {
        const data = new Uint8Array(await file.arrayBuffer());
        loadingTask = pdfjsLib.getDocument({ data });
        const document = await loadingTask.promise;
        const rendered = [];
        for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
          if (!active) return;
          const page = await document.getPage(pageNumber);
          const baseViewport = page.getViewport({ scale: 1 });
          const scale = Math.min(
            1.25,
            900 / baseViewport.width,
            Math.sqrt(1200000 / (baseViewport.width * baseViewport.height))
          );
          const viewport = page.getViewport({ scale });
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
          rendered.push({ preview: canvas.toDataURL('image/jpeg', 0.82), summary });
          canvas.width = 0;
          canvas.height = 0;
        }
        if (active) {
          setPreviews(rendered.map((result) => result.preview));
          setPageSummaries(rendered.map((result) => result.summary));
        }
        await document.destroy();
      } catch (renderError) {
        console.error('Unable to render PDF redaction previews:', renderError);
        if (active) setPreviewError('Page previews could not be rendered. Try a different PDF or browser.');
      }
    };

    renderPreviews();
    return () => {
      active = false;
      loadingTask?.destroy();
    };
  }, [file, pageCount]);

  const clearFile = () => {
    requestId.current += 1;
    setFile(null);
    setPageCount(0);
    setCurrentPage(1);
    setPreviews([]);
    setPageSummaries([]);
    setMarksByPage({});
    setDraft(null);
    setOutputFileName('');
    setError('');
    setPreviewError('');
    setIsLoading(false);
    clearOutput();
  };

  const getCoordinates = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: clamp((event.clientX - bounds.left) / bounds.width),
      y: clamp((event.clientY - bounds.top) / bounds.height)
    };
  };

  const startDrawing = (event) => {
    if (!previews[currentPage - 1] || isProcessing || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = getCoordinates(event);
    drawing.current = { ...point, pointerId: event.pointerId };
    setDraft({ ...point, width: 0, height: 0 });
    clearOutput();
    setError('');
  };

  const updateDrawing = (event) => {
    if (!drawing.current || drawing.current.pointerId !== event.pointerId) return;
    const point = getCoordinates(event);
    const { x, y } = drawing.current;
    setDraft({
      x: Math.min(x, point.x),
      y: Math.min(y, point.y),
      width: Math.abs(point.x - x),
      height: Math.abs(point.y - y)
    });
  };

  const finishDrawing = (event) => {
    if (!drawing.current || drawing.current.pointerId !== event.pointerId) return;
    const point = getCoordinates(event);
    const { x, y } = drawing.current;
    const mark = {
      x: Math.min(x, point.x),
      y: Math.min(y, point.y),
      width: Math.abs(point.x - x),
      height: Math.abs(point.y - y)
    };
    drawing.current = null;
    setDraft(null);
    if (mark.width < 0.004 || mark.height < 0.004) return;
    setMarksByPage((current) => ({
      ...current,
      [currentPage]: [...(current[currentPage] || []), mark]
    }));
    clearOutput();
  };

  const addCoordinateMark = () => {
    const values = Object.fromEntries(
      Object.entries(coordinateBox).map(([key, value]) => [key, Number(value)])
    );
    const { x, y, width, height } = values;
    if (
      !Object.values(values).every(Number.isFinite)
      || x < 0 || y < 0 || width <= 0 || height <= 0
      || x + width > 100 || y + height > 100
    ) {
      setError('Enter positive width and height, with the entire redaction box inside the page (0–100%).');
      return;
    }

    setMarksByPage((current) => ({
      ...current,
      [currentPage]: [...(current[currentPage] || []), {
        x: x / 100,
        y: y / 100,
        width: width / 100,
        height: height / 100
      }]
    }));
    clearOutput();
    setError('');
  };

  const cancelDrawing = () => {
    drawing.current = null;
    setDraft(null);
  };

  const undoMark = () => {
    setMarksByPage((current) => ({
      ...current,
      [currentPage]: (current[currentPage] || []).slice(0, -1)
    }));
    clearOutput();
  };

  const clearPageMarks = () => {
    setMarksByPage((current) => ({ ...current, [currentPage]: [] }));
    clearOutput();
  };

  const createRedactedPdf = async () => {
    const markedPages = Object.values(marksByPage).filter((marks) => marks.length).length;
    if (!file || !pageCount) {
      setError('Choose a PDF before creating a redacted copy.');
      return;
    }
    if (!markedPages) {
      setError('Draw at least one redaction box before processing the PDF.');
      return;
    }

    setIsProcessing(true);
    setError('');
    clearOutput();
    let loadingTask;
    try {
      const data = new Uint8Array(await file.arrayBuffer());
      loadingTask = pdfjsLib.getDocument({ data });
      const source = await loadingTask.promise;
      if (source.numPages !== pageCount) throw new Error('The PDF page count changed. Select the file again.');
      const result = await PDFDocument.create();

      for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
        const page = await source.getPage(pageNumber);
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = Math.min(
          1.75,
          1800 / baseViewport.width,
          Math.sqrt(4000000 / (baseViewport.width * baseViewport.height))
        );
        const viewport = page.getViewport({ scale });
        const canvas = window.document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) throw new Error('Your browser could not prepare a page for redaction.');
        await page.render({ canvasContext: context, viewport, intent: 'print' }).promise;

        for (const mark of marksByPage[pageNumber] || []) {
          context.fillStyle = '#000000';
          context.fillRect(
            Math.floor(mark.x * canvas.width),
            Math.floor(mark.y * canvas.height),
            Math.ceil(mark.width * canvas.width),
            Math.ceil(mark.height * canvas.height)
          );
        }

        const imageBlob = await canvasBlob(canvas);
        const image = await result.embedPng(await imageBlob.arrayBuffer());
        const outputPage = result.addPage([viewport.width / scale, viewport.height / scale]);
        outputPage.drawImage(image, {
          x: 0,
          y: 0,
          width: viewport.width / scale,
          height: viewport.height / scale
        });
        canvas.width = 0;
        canvas.height = 0;
      }

      const bytes = await result.save();
      const verified = await PDFDocument.load(bytes);
      if (verified.getPageCount() !== pageCount) throw new Error('The redacted PDF did not preserve the page count.');
      setOutput(new Blob([bytes], { type: 'application/pdf' }));
      await source.destroy();
    } catch (processError) {
      console.error('Unable to redact PDF:', processError);
      setError(processError.message || 'The PDF could not be redacted. Try another document.');
    } finally {
      loadingTask?.destroy();
      setIsProcessing(false);
    }
  };

  const downloadPdf = (downloadFileName) => {
    if (!output || !file) return;
    const url = URL.createObjectURL(output);
    const anchor = window.document.createElement('a');
    anchor.href = url;
    anchor.download = downloadFileName || `${file.name.replace(/\.pdf$/i, '')}_redacted.pdf`;
    anchor.style.display = 'none';
    window.document.body.appendChild(anchor);
    anchor.click();
    markOutputDownloaded();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const pageMarks = marksByPage[currentPage] || [];
  const defaultOutputName = file
    ? `${file.name.replace(/\.pdf$/i, '')}_redacted.pdf`
    : 'redacted.pdf';
  const safeOutputFileName = normalizeOutputFileName(outputFileName, defaultOutputName);

  return (
    <div className="redact-pdf-workspace space-y-6">
      <input {...getInputProps()} className="sr-only" />
      {!file && (
        <div
          {...getRootProps({
            role: 'group',
            'aria-label': 'Choose a PDF to redact'
          })}
          className={`redact-pdf-upload pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone edit-sign-upload-zone transition-all ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'cursor-pointer border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
          }`}
        >
          <div className="merge-pdf-upload-content">
            <div className="pdf-upload-icon" aria-hidden="true">
              {isLoading
                ? <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                : <Upload className="h-6 w-6 text-blue-600" />}
            </div>
            <div className="merge-pdf-upload-copy">
              <h3>{isLoading ? 'Checking PDF pages…' : isDragActive ? 'Drop the PDF here' : 'Choose or drop a PDF to redact'}</h3>
              <p>Permanently cover selected content on PDF pages.</p>
            </div>
            <button
              type="button"
              className="pdf-editor-primary-button merge-pdf-upload-button"
              onClick={(event) => {
                event.stopPropagation();
                open();
              }}
              disabled={isLoading || isProcessing}
            >
              Choose PDF
            </button>
          </div>
        </div>
      )}

      {file && (
        <section className="redact-pdf-file-section" aria-labelledby="redact-pdf-file-heading">
          <header>
            <div className="redact-pdf-panel-title">
              <FileText aria-hidden="true" />
              <h3 id="redact-pdf-file-heading">PDF to redact</h3>
            </div>
            <p>One PDF selected. Replace it or remove it to choose another.</p>
          </header>
          <div className="pdf-workflow-selected pdf-attached-file-card flex items-center justify-between gap-4 p-3">
            <div className="flex min-w-0 items-center gap-3">
              <AttachedFileIcon />
              <div className="min-w-0">
                <strong className="block truncate">{file.name}</strong>
                <span className="block text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB · {pageCount} pages</span>
              </div>
            </div>
            <AttachedFileActions
              fileName={file.name}
              onReplace={open}
              onRemove={clearFile}
              disabled={isLoading || isProcessing}
            />
          </div>
        </section>
      )}

      {previewError && <p className="text-sm text-amber-700" role="alert">{previewError}</p>}
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

      {file && pageCount > 0 && (
        <section className="redact-pdf-settings-panel" aria-labelledby="redact-pdf-settings-heading">
          <header>
            <div className="redact-pdf-panel-title">
              <Settings2 aria-hidden="true" />
              <h3 id="redact-pdf-settings-heading">Redaction Settings</h3>
            </div>
            <p>Set precise redaction areas, then review each page before creating the redacted PDF.</p>
          </header>
          <div className="redact-pdf-settings-content">
            <fieldset className="redact-pdf-coordinate-controls">
              <legend>Add redaction by coordinates (percent from top left)</legend>
              <div className="grid gap-3 sm:grid-cols-4">
                {[
                  ['x', 'Left'],
                  ['y', 'Top'],
                  ['width', 'Width'],
                  ['height', 'Height']
                ].map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <label htmlFor={`redact-${key}`}>{label} (%)</label>
                    <input
                      id={`redact-${key}`}
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={coordinateBox[key]}
                      onChange={(event) => setCoordinateBox((current) => ({ ...current, [key]: event.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div className="redact-pdf-mark-actions">
                <button type="button" onClick={addCoordinateMark} disabled={isProcessing || !previews[currentPage - 1]}>
                  Add redaction box
                </button>
                <span className="redact-pdf-mark-count">{pageMarks.length} mark{pageMarks.length === 1 ? '' : 's'} on this page</span>
                <button type="button" onClick={undoMark} disabled={!pageMarks.length}>
                  <RotateCcw aria-hidden="true" /> Undo mark
                </button>
                <button type="button" onClick={clearPageMarks} disabled={!pageMarks.length}>
                  <Trash2 aria-hidden="true" /> Clear page
                </button>
              </div>
              <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {pageMarks.length} redaction {pageMarks.length === 1 ? 'mark' : 'marks'} on page {currentPage}.
              </p>
            </fieldset>

            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              Redaction rasterizes every page and removes selectable text, vector content, links, forms, and other interactive features. Inspect the downloaded PDF before sharing it.
            </p>

            <section className="redact-pdf-preview-panel watermark-preview-panel" aria-labelledby="redact-pdf-preview-heading">
              <div className="watermark-section-heading">
                <div className="watermark-section-title">
                  <Eye aria-hidden="true" />
                  <h2 id="redact-pdf-preview-heading">Redaction Preview</h2>
                </div>
              </div>
              <p className="watermark-preview-guidance">
                Review every page. Drag over sensitive content to add opaque redaction marks; use the page tiles or arrows to navigate.
              </p>
              <div className="watermark-preview-layout">
                <div className="watermark-preview-main">
                  <div
                    id="redact-pdf-active-page-preview"
                    className="watermark-preview-canvas-wrap redact-pdf-preview-canvas-wrap"
                    role="group"
                    aria-label={`Visual preview and redaction drawing area for page ${currentPage}`}
                    aria-describedby={`redact-page-${currentPage}-description`}
                    onPointerDown={startDrawing}
                    onPointerMove={updateDrawing}
                    onPointerUp={finishDrawing}
                    onPointerCancel={cancelDrawing}
                  >
                    {previews[currentPage - 1]
                      ? <img src={previews[currentPage - 1]} alt={`Visual preview of page ${currentPage}`} draggable="false" />
                      : <div className="redact-pdf-preview-loading">Rendering page preview…</div>}
                    {pageMarks.map((mark, index) => (
                      <span
                        key={`${currentPage}-${index}`}
                        aria-label={`Redaction mark ${index + 1}`}
                        className="redact-pdf-preview-mark"
                        style={{ left: `${mark.x * 100}%`, top: `${mark.y * 100}%`, width: `${mark.width * 100}%`, height: `${mark.height * 100}%` }}
                      />
                    ))}
                    {draft && (
                      <span
                        className="redact-pdf-preview-mark is-draft"
                        style={{ left: `${draft.x * 100}%`, top: `${draft.y * 100}%`, width: `${draft.width * 100}%`, height: `${draft.height * 100}%` }}
                      />
                    )}
                  </div>
                  <p id={`redact-page-${currentPage}-description`} className="sr-only">
                    {pageSummaries[currentPage - 1] || 'No selectable text was found on this page; its preview is visual-only.'}
                  </p>
                  <p className="pdf-preview-instructions">
                    Drag across the page to add an opaque black redaction. You can also enter coordinates above using the keyboard.
                  </p>
                </div>

                <aside className="watermark-preview-page-rail" aria-label="Page preview navigation">
                  <div className="watermark-preview-controls">
                    <p>Preview page</p>
                    <div className="watermark-preview-page-navigation redact-pdf-preview-page-navigation">
                      <button
                        type="button"
                        aria-label="Preview previous page"
                        aria-controls="redact-pdf-active-page-preview"
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        disabled={currentPage === 1 || isLoading}
                      >
                        <ChevronLeft aria-hidden="true" />
                      </button>
                      <span aria-live="polite">Page {currentPage} of {pageCount}</span>
                      <button
                        type="button"
                        aria-label="Preview next page"
                        aria-controls="redact-pdf-active-page-preview"
                        onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                        disabled={currentPage === pageCount || isLoading}
                      >
                        <ChevronRight aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="watermark-preview-page-thumbnails" role="group" aria-label="PDF page thumbnails">
                    {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        className="watermark-preview-page-thumbnail redact-pdf-preview-page-thumbnail"
                        aria-label={`Preview page ${pageNumber}`}
                        aria-controls="redact-pdf-active-page-preview"
                        aria-pressed={pageNumber === currentPage}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        <span className="watermark-page-thumbnail-canvas-wrap redact-pdf-page-thumbnail-wrap">
                          {previews[pageNumber - 1]
                            ? <img src={previews[pageNumber - 1]} alt="" draggable="false" />
                            : <span className="redact-pdf-page-thumbnail-placeholder">Page preview loading…</span>}
                          {(marksByPage[pageNumber] || []).map((mark, index) => (
                            <span
                              key={`${pageNumber}-${index}`}
                              className="redact-pdf-page-thumbnail-mark"
                              aria-hidden="true"
                              style={{ left: `${mark.x * 100}%`, top: `${mark.y * 100}%`, width: `${mark.width * 100}%`, height: `${mark.height * 100}%` }}
                            />
                          ))}
                          {draft && pageNumber === currentPage && (
                            <span
                              className="redact-pdf-page-thumbnail-mark is-draft"
                              aria-hidden="true"
                              style={{ left: `${draft.x * 100}%`, top: `${draft.y * 100}%`, width: `${draft.width * 100}%`, height: `${draft.height * 100}%` }}
                            />
                          )}
                        </span>
                        <span className="watermark-page-thumbnail-label">Page {pageNumber}</span>
                      </button>
                    ))}
                  </div>
                </aside>
              </div>
              <p className="watermark-preview-status" aria-live="polite">
                {pageMarks.length} mark{pageMarks.length === 1 ? '' : 's'} on page {currentPage}.
              </p>
            </section>
          </div>
        </section>
      )}

      {file && (
        <div className="watermark-output-actions redact-pdf-output-actions">
          <label htmlFor="redact-pdf-output-filename">Output Filename</label>
          <input
            id="redact-pdf-output-filename"
            className="watermark-output-filename redact-pdf-output-filename"
            type="text"
            value={outputFileName}
            onChange={(event) => setOutputFileName(event.target.value)}
            maxLength={120}
            autoComplete="off"
            disabled={isProcessing}
          />
          <div className="redact-pdf-output-buttons watermark-apply-button">
            <button type="button" onClick={createRedactedPdf} disabled={isLoading || isProcessing} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
              {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
              {isProcessing ? 'Redacting PDF…' : 'Create Redacted PDF'}
            </button>
            <button type="button" onClick={clearFile} disabled={isProcessing} className="rounded-lg border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">Reset</button>
          </div>
        </div>
      )}
      {output && file && (
        <DownloadReadyCard
          fileName={safeOutputFileName}
          sizeBytes={output.size}
          onDownload={downloadPdf}
          downloadLabel="Download Redacted PDF"
          showFilenameEditor={false}
        />
      )}
      {isProcessing && <p className="sr-only" role="status">Creating the redacted PDF.</p>}
    </div>
  );
};

export default RedactPdf;
