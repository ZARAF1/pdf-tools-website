import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import { PDFDocument } from 'pdf-lib';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { ArrowLeft, ArrowRight, CheckCircle2, Download, Loader2, RotateCcw, Trash2, Upload } from 'lucide-react';
import pdfjsLib from '../lib/pdfjsClient';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';

const MAX_PAGES = 15;

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

  const downloadPdf = () => {
    if (!output || !file) return;
    const url = URL.createObjectURL(output);
    const anchor = window.document.createElement('a');
    anchor.href = url;
    anchor.download = `${file.name.replace(/\.pdf$/i, '')}_redacted.pdf`;
    anchor.style.display = 'none';
    window.document.body.appendChild(anchor);
    anchor.click();
    markOutputDownloaded();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const pageMarks = marksByPage[currentPage] || [];

  return (
    <div className="space-y-6">
      <div
        {...getRootProps({
          role: 'group',
          'aria-label': file ? `Selected PDF ${file.name}` : 'Choose a PDF to redact'
        })}
        className={`pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone edit-sign-upload-zone ${file ? 'has-file' : ''} transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : file
              ? 'border-slate-300 bg-white'
              : 'cursor-pointer border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="merge-pdf-upload-content">
            <AttachedFileIcon />
            <div className="merge-pdf-upload-copy">
              <h3 className="truncate">{file.name}</h3>
              <p>{(file.size / 1024).toFixed(1)} KB · {pageCount} pages</p>
            </div>
            <AttachedFileActions
              fileName={file.name}
              onReplace={open}
              onRemove={clearFile}
              disabled={isLoading || isProcessing}
            />
          </div>
        ) : (
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
        )}
      </div>

      {previewError && <p className="text-sm text-amber-700" role="alert">{previewError}</p>}
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

      {file && pageCount > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} aria-label="Previous page" className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                Page
                <select value={currentPage} onChange={(event) => setCurrentPage(Number(event.target.value))} className="rounded-lg border border-slate-200 bg-white px-2 py-1">
                  {Array.from({ length: pageCount }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
                </select>
                of {pageCount}
              </label>
              <button type="button" onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} disabled={currentPage === pageCount} aria-label="Next page" className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={undoMark} disabled={!pageMarks.length} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> Undo mark
              </button>
              <button type="button" onClick={clearPageMarks} disabled={!pageMarks.length} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">
                <Trash2 className="h-4 w-4" aria-hidden="true" /> Clear page
              </button>
            </div>
          </div>

          <div
            className="relative mx-auto w-full max-w-3xl touch-none select-none overflow-hidden rounded-lg border border-slate-300 bg-slate-100"
            role="group"
            aria-label={`Visual preview and redaction drawing area for page ${currentPage}`}
            aria-describedby={`redact-page-${currentPage}-description`}
            onPointerDown={startDrawing}
            onPointerMove={updateDrawing}
            onPointerUp={finishDrawing}
            onPointerCancel={cancelDrawing}
          >
            {previews[currentPage - 1]
              ? <img src={previews[currentPage - 1]} alt={`Visual preview of page ${currentPage}`} draggable="false" className="block h-auto w-full" />
              : <div className="flex aspect-[3/4] items-center justify-center text-sm text-slate-500">Rendering page preview…</div>}
            {pageMarks.map((mark, index) => (
              <span
                key={`${currentPage}-${index}`}
                aria-label={`Redaction mark ${index + 1}`}
                className="pointer-events-none absolute bg-black"
                style={{ left: `${mark.x * 100}%`, top: `${mark.y * 100}%`, width: `${mark.width * 100}%`, height: `${mark.height * 100}%` }}
              />
            ))}
            {draft && <span className="pointer-events-none absolute border-2 border-red-600 bg-black/70" style={{ left: `${draft.x * 100}%`, top: `${draft.y * 100}%`, width: `${draft.width * 100}%`, height: `${draft.height * 100}%` }} />}
          </div>
          <p id={`redact-page-${currentPage}-description`} className="sr-only">
            {pageSummaries[currentPage - 1] || 'No selectable text was found on this page; its preview is visual-only.'}
          </p>
          <p className="text-center text-sm text-slate-500">Drag across the page to add an opaque black redaction. You can also enter coordinates below using the keyboard. {pageMarks.length} mark{pageMarks.length === 1 ? '' : 's'} on this page.</p>
          <fieldset className="space-y-3 rounded-xl border border-slate-200 p-4">
            <legend className="px-1 text-sm font-semibold text-slate-700">Add redaction by coordinates (percent from top left)</legend>
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                ['x', 'Left'],
                ['y', 'Top'],
                ['width', 'Width'],
                ['height', 'Height']
              ].map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <label htmlFor={`redact-${key}`} className="text-sm font-medium text-slate-700">{label} (%)</label>
                  <input
                    id={`redact-${key}`}
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={coordinateBox[key]}
                    onChange={(event) => setCoordinateBox((current) => ({ ...current, [key]: event.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
              ))}
            </div>
            <button type="button" onClick={addCoordinateMark} disabled={isProcessing || !previews[currentPage - 1]} className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
              Add redaction box
            </button>
          </fieldset>
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {pageMarks.length} redaction {pageMarks.length === 1 ? 'mark' : 'marks'} on page {currentPage}.
          </p>
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            Redaction rasterizes every page and removes selectable text, vector content, links, forms, and other interactive features. Inspect the downloaded PDF before sharing it.
          </p>
        </div>
      )}

      {file && (
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={createRedactedPdf} disabled={isLoading || isProcessing} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
            {isProcessing ? 'Redacting PDF…' : 'Create Redacted PDF'}
          </button>
          <button type="button" onClick={clearFile} disabled={isProcessing} className="rounded-lg border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">Reset</button>
          {output && (
            <button type="button" onClick={downloadPdf} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700">
              <Download className="h-5 w-5" aria-hidden="true" /> Download Redacted PDF
            </button>
          )}
        </div>
      )}
      {isProcessing && <p className="sr-only" role="status">Creating the redacted PDF.</p>}
    </div>
  );
};

export default RedactPdf;
