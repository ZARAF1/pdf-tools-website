import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import { degrees, PDFDocument } from 'pdf-lib';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { ArrowDown, ArrowUp, CheckCircle2, Download, Loader2, RotateCw, Trash2, Upload } from 'lucide-react';
import pdfjsLib from '../lib/pdfjsClient';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';

const MAX_PAGES = 30;

const formatBytes = (bytes) => (
  bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
);

const OrganizePdf = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [previewSummaries, setPreviewSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState(null);
  const markOutputDownloaded = useToolExitGuard(Boolean(file), output);
  const [error, setError] = useState('');
  const [previewError, setPreviewError] = useState('');
  const [draggedPage, setDraggedPage] = useState(null);
  const requestId = useRef(0);
  const previewRotationKey = pages
    .map(({ sourceIndex, rotation }) => `${sourceIndex}:${rotation}`)
    .sort()
    .join('|');

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
        setPreviews([]);
        setPreviewSummaries([]);
        setFile(selectedFile);
        setPages(Array.from({ length: count }, (_, sourceIndex) => ({ sourceIndex, rotation: 0 })));
      }
    } catch (loadError) {
      console.error('Unable to load PDF for organizing:', loadError);
      if (requestId.current === currentRequest) {
        setError(loadError.message || 'This PDF is invalid or could not be opened.');
      }
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
    if (!file || !pages.length) return undefined;
    let active = true;
    let loadingTask;
    const rotationsBySourceIndex = new Map(
      pages.map(({ sourceIndex, rotation }) => [sourceIndex, rotation])
    );

    const renderPreviews = async () => {
      setPreviewError('');
      try {
        const data = new Uint8Array(await file.arrayBuffer());
        loadingTask = pdfjsLib.getDocument({ data });
        const document = await loadingTask.promise;
        const rendered = [];
        for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
          if (!active) return;
          const page = await document.getPage(pageNumber);
          const rotation = page.rotate + (rotationsBySourceIndex.get(pageNumber - 1) || 0);
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
          rendered.push({
            sourceIndex: pageNumber - 1,
            preview: canvas.toDataURL('image/jpeg', 0.75),
            summary
          });
          canvas.width = 0;
          canvas.height = 0;
        }
        if (active) {
          const nextPreviews = Array(document.numPages);
          const nextSummaries = Array(document.numPages);
          rendered.forEach(({ sourceIndex, preview, summary }) => {
            nextPreviews[sourceIndex] = preview;
            nextSummaries[sourceIndex] = summary;
          });
          setPreviews(nextPreviews);
          setPreviewSummaries(nextSummaries);
        }
        await document.destroy();
      } catch (renderError) {
        if (active) console.error('Unable to render PDF organization previews:', renderError);
        if (active) setPreviewError('Page previews could not be rendered, but the page controls remain available.');
      }
    };

    renderPreviews();
    return () => {
      active = false;
      loadingTask?.destroy();
    };
  }, [file, pages.length, previewRotationKey]);

  const clearFile = () => {
    requestId.current += 1;
    setFile(null);
    setPages([]);
    setPreviews([]);
    setPreviewSummaries([]);
    setError('');
    setPreviewError('');
    setIsLoading(false);
    clearOutput();
  };

  const reorderPage = (fromIndex, toIndex) => {
    if (fromIndex === toIndex || fromIndex == null || toIndex < 0 || toIndex >= pages.length) return;
    setPages((current) => {
      const updated = [...current];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
    clearOutput();
    setError('');
  };

  const rotatePage = (index) => {
    setPages((current) => current.map((page, pageIndex) => (
      pageIndex === index ? { ...page, rotation: (page.rotation + 90) % 360 } : page
    )));
    clearOutput();
    setError('');
  };

  const removePage = (index) => {
    if (pages.length <= 1) {
      setError('At least one page must remain in the output PDF.');
      return;
    }
    setPages((current) => current.filter((_, pageIndex) => pageIndex !== index));
    clearOutput();
    setError('');
  };

  const createPdf = async () => {
    if (!file || !pages.length) {
      setError('Choose a PDF with at least one page.');
      return;
    }
    setIsProcessing(true);
    setError('');
    clearOutput();
    try {
      const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
      if (source.isEncrypted) throw new Error('Password-protected PDFs are not supported.');
      const result = await PDFDocument.create();
      for (const item of pages) {
        const [page] = await result.copyPages(source, [item.sourceIndex]);
        const currentAngle = page.getRotation().angle;
        page.setRotation(degrees((currentAngle + item.rotation) % 360));
        result.addPage(page);
      }
      const bytes = await result.save();
      const verified = await PDFDocument.load(bytes);
      if (verified.getPageCount() !== pages.length) {
        throw new Error('The generated PDF did not contain the expected number of pages.');
      }
      setOutput(new Blob([bytes], { type: 'application/pdf' }));
    } catch (processError) {
      console.error('Unable to organize PDF:', processError);
      setError(processError.message || 'The PDF could not be organized. Try another document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!output || !file) return;
    const url = URL.createObjectURL(output);
    const anchor = window.document.createElement('a');
    anchor.href = url;
    anchor.download = `${file.name.replace(/\.pdf$/i, '')}_organized.pdf`;
    anchor.style.display = 'none';
    window.document.body.appendChild(anchor);
    anchor.click();
    markOutputDownloaded();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="pdf-tool-workflow space-y-6">
      <div
        {...getRootProps({
          role: 'group',
          'aria-label': file ? `Selected PDF ${file.name}` : 'Choose a PDF to organize'
        })}
        className={`pdf-workflow-selected pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone rounded-2xl border-2 border-dashed p-8 text-center transition-all ${file ? 'has-attached-file' : ''} ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'cursor-pointer border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex flex-wrap items-center justify-between gap-4 text-left">
            <div className="flex min-w-0 items-center gap-3">
              <AttachedFileIcon />
              <div>
                <p className="font-semibold text-slate-800">{file.name}</p>
                <p className="text-sm text-slate-500">{formatBytes(file.size)} · {pages.length} pages</p>
              </div>
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
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-blue-600" aria-hidden="true" /> : <Upload className="h-6 w-6 text-blue-600" aria-hidden="true" />}
            </div>
            <div className="merge-pdf-upload-copy">
              <h3 aria-live="polite">{isLoading ? 'Reading PDF…' : isDragActive ? 'Drop the PDF here' : 'Choose or drop a PDF to organize'}</h3>
              <p>Reorder, rotate, or remove PDF pages.</p>
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

      {previewError && <p className="text-sm text-amber-700" role="status">{previewError}</p>}
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

      {pages.length > 0 && (
        <div className="pdf-workflow-controls space-y-4">
          <p className="text-sm text-slate-500">Drag page cards to reorder, or use the controls on each page. At least one page must remain. Screen readers can hear extracted page text where available.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {pages.map((page, index) => (
              <article
                key={page.sourceIndex}
                draggable
                onDragStart={() => setDraggedPage(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  reorderPage(draggedPage, index);
                  setDraggedPage(null);
                }}
                onDragEnd={() => setDraggedPage(null)}
                className={`min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm ${draggedPage === index ? 'opacity-50' : ''}`}
              >
                <div className="mb-2 flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                  {previews[page.sourceIndex]
                    ? <img src={previews[page.sourceIndex]} alt={`Preview of source page ${page.sourceIndex + 1}, ${page.rotation ? `rotated clockwise ${page.rotation} degrees` : 'original orientation'}`} aria-describedby={`organize-page-${page.sourceIndex + 1}-description`} className="h-full w-full object-contain" />
                    : <span className="text-xs text-slate-400">Page {page.sourceIndex + 1}</span>}
                </div>
                <p id={`organize-page-${page.sourceIndex + 1}-description`} className="sr-only">
                  {previewSummaries[page.sourceIndex] || 'No selectable text was found on this page; its preview is visual-only.'}
                </p>
                <p className="mb-2 text-center text-sm font-semibold text-slate-700">
                  Position {index + 1} · Source page {page.sourceIndex + 1}{page.rotation ? ` · +${page.rotation}°` : ''}
                </p>
                <div className="flex justify-center gap-1">
                  <button type="button" onClick={() => reorderPage(index, index - 1)} disabled={index === 0} aria-label={`Move page ${index + 1} earlier`} className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 disabled:opacity-30">
                    <ArrowUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => reorderPage(index, index + 1)} disabled={index === pages.length - 1} aria-label={`Move page ${index + 1} later`} className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 disabled:opacity-30">
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => rotatePage(index)} aria-label={`Rotate page ${index + 1} clockwise`} className="rounded-md p-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700">
                    <RotateCw className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => removePage(index)} aria-label={`Remove page ${index + 1}`} className="rounded-md p-2 text-slate-600 transition hover:bg-rose-50 hover:text-rose-700">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="pdf-workflow-actions flex flex-wrap gap-3">
        {file && (
          <>
            <button type="button" onClick={createPdf} disabled={isLoading || isProcessing} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
              {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
              {isProcessing ? 'Creating PDF…' : 'Organize PDF'}
            </button>
            <button type="button" onClick={clearFile} disabled={isProcessing} className="rounded-lg border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
              Reset
            </button>
          </>
        )}
        {output && (
          <button type="button" onClick={downloadPdf} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700">
            <Download className="h-5 w-5" aria-hidden="true" />
            Download Organized PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default OrganizePdf;
