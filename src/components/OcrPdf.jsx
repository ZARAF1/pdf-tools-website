import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { FILE_DOWNLOAD_READY_MESSAGE } from '../lib/toolMessages.mjs';
import { createWorker } from 'tesseract.js';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  ScanText,
  Upload,
  X
} from 'lucide-react';
import { PASSWORD_PROTECTED_PDF_MESSAGE, validateUnencryptedPdf } from '../lib/pdfValidation';
import pdfjsLib from '../lib/pdfjsClient';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';

const MAX_PAGES = 50;
const MAX_PAGE_PIXELS = 16_000_000;
const MIN_USABLE_TEXT_LENGTH = 5;

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getOutputName = (filename) => {
  const base = filename.replace(/\.pdf$/i, '').trim();
  const safe = base.replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  return `${safe || 'document'}_ocr.pdf`;
};

const getPageText = (content) => content.items
  .filter((item) => typeof item.str === 'string' && item.str.trim())
  .map((item) => item.str)
  .join(' ')
  .trim();

const getOcrWords = (data) => (data.blocks || [])
  .flatMap((block) => block.paragraphs || [])
  .flatMap((paragraph) => paragraph.lines || [])
  .flatMap((line) => line.words || [])
  .filter((word) => word.text?.trim() && word.bbox);

const normalizeSearchText = (value) => value
  .normalize('NFKC')
  .toLocaleLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, ' ')
  .trim();

const getPdfPoint = (viewport, x, y, mediaBox) => {
  const [a, b, c, d, e, f] = viewport.transform;
  const determinant = a * d - b * c;
  if (!Number.isFinite(determinant) || determinant === 0) {
    throw new Error('The PDF page has an invalid rendering transform.');
  }

  return {
    x: (d * (x - e) - c * (y - f)) / determinant - mediaBox.x,
    y: (-b * (x - e) + a * (y - f)) / determinant - mediaBox.y
  };
};

const createPreview = async (file, runId, validationRunRef, loadingTaskRef, renderTaskRef) => {
  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjsLib.getDocument({ data });
  loadingTaskRef.current = loadingTask;
  let document;
  let page;
  let canvas;

  try {
    document = await loadingTask.promise;
    if (validationRunRef.current !== runId) return null;
    if (document.numPages < 1 || document.numPages > MAX_PAGES) {
      throw new Error(`Choose a PDF with 1–${MAX_PAGES} pages.`);
    }

    page = await document.getPage(1);
    if (validationRunRef.current !== runId) return null;
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = Math.min(0.65, Math.sqrt(1_500_000 / (baseViewport.width * baseViewport.height)));
    const viewport = page.getViewport({ scale });
    canvas = window.document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Your browser could not prepare a PDF preview.');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const renderTask = page.render({ canvasContext: context, viewport, intent: 'print' });
    renderTaskRef.current = renderTask;
    await renderTask.promise;
    renderTaskRef.current = null;
    if (validationRunRef.current !== runId) return null;

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) resolve(result);
        else reject(new Error('Your browser could not create a PDF preview.'));
      }, 'image/png');
    });

    return {
      pageCount: document.numPages,
      url: URL.createObjectURL(blob)
    };
  } finally {
    renderTaskRef.current = null;
    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
    }
    if (page) page.cleanup();
    if (loadingTaskRef.current === loadingTask) {
      loadingTaskRef.current = null;
      await loadingTask.destroy().catch((error) => {
        console.error('Unable to release the PDF preview task:', error);
      });
    }
  }
};

const addInvisibleOcrText = (page, words, viewport, font) => {
  const mediaBox = page.getMediaBox();

  words.forEach((word) => {
    const { x0, y0, x1, y1 } = word.bbox;
    if (![x0, y0, x1, y1].every(Number.isFinite) || x1 <= x0 || y1 <= y0) return;

    const origin = getPdfPoint(viewport, x0, y1, mediaBox);
    const horizontal = getPdfPoint(viewport, x1, y1, mediaBox);
    const vertical = getPdfPoint(viewport, x0, y0, mediaBox);
    const boxWidth = Math.hypot(horizontal.x - origin.x, horizontal.y - origin.y);
    const boxHeight = Math.hypot(vertical.x - origin.x, vertical.y - origin.y);
    if (boxWidth <= 0 || boxHeight <= 0) return;

    const nominalSize = boxHeight * 1.05;
    const nominalWidth = font.widthOfTextAtSize(word.text, nominalSize);
    const fontSize = nominalWidth > boxWidth
      ? Math.max(1, nominalSize * (boxWidth / nominalWidth))
      : nominalSize;

    page.drawText(word.text, {
      x: origin.x,
      y: origin.y,
      font,
      size: fontSize,
      opacity: 0
    });
  });
};

const OcrPdf = () => {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ message: '', value: 0 });
  const [error, setError] = useState('');
  const [outputBlob, setOutputBlob] = useState(null);
  const markOutputDownloaded = useToolExitGuard(Boolean(file), outputBlob);
  const [outputName, setOutputName] = useState('');
  const [outputSummary, setOutputSummary] = useState('');

  const validationRunRef = useRef(0);
  const processingRunRef = useRef(0);
  const processingRef = useRef(false);
  const validatingRef = useRef(false);
  const previewUrlRef = useRef('');
  const previewLoadingTaskRef = useRef(null);
  const loadingTaskRef = useRef(null);
  const outputLoadingTaskRef = useRef(null);
  const renderTaskRef = useRef(null);
  const workerRef = useRef(null);

  const clearPreview = useCallback(() => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = '';
    setPreviewUrl('');
  }, []);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (processingRef.current || validatingRef.current) return;
    if (!acceptedFiles.length && !rejectedFiles.length) return;
    if (rejectedFiles.length || acceptedFiles.length !== 1) {
      setError('Choose one unencrypted PDF file at a time.');
      return;
    }

    const [selectedFile] = acceptedFiles;
    const validationRun = ++validationRunRef.current;
    validatingRef.current = true;
    setIsValidating(true);
    setValidationStatus('Checking the PDF and counting its pages…');
    setError('');

    let preview;
    try {
      const validatedPdf = await validateUnencryptedPdf(selectedFile);
      const validatedPageCount = validatedPdf.getPageCount();
      if (validatedPageCount < 1 || validatedPageCount > MAX_PAGES) {
        throw new Error(`Choose a PDF with 1–${MAX_PAGES} pages.`);
      }

      setValidationStatus('Rendering the first-page preview…');
      preview = await createPreview(
        selectedFile,
        validationRun,
        validationRunRef,
        previewLoadingTaskRef,
        renderTaskRef
      );
      if (validationRunRef.current !== validationRun || !preview) {
        if (preview?.url) URL.revokeObjectURL(preview.url);
        return;
      }
      if (preview.pageCount !== validatedPageCount) {
        throw new Error('The PDF page count could not be confirmed. Select the file again and retry.');
      }

      clearPreview();
      previewUrlRef.current = preview.url;
      setPreviewUrl(preview.url);
      setFile(selectedFile);
      setPageCount(validatedPageCount);
      setOutputBlob(null);
      setOutputName('');
      setOutputSummary('');
      setProgress({ message: '', value: 0 });
    } catch (validationError) {
      if (validationRunRef.current === validationRun) {
        console.error('Unable to validate the PDF for OCR:', validationError);
        const message = validationError?.message || '';
        setError(
          message === PASSWORD_PROTECTED_PDF_MESSAGE || message.startsWith('Choose a PDF')
            ? message
            : 'This file is unreadable or is not a valid, unencrypted PDF.'
        );
        if (preview?.url) URL.revokeObjectURL(preview.url);
      }
    } finally {
      if (validationRunRef.current === validationRun) {
        validatingRef.current = false;
        setIsValidating(false);
        setValidationStatus('');
      }
    }
  }, [clearPreview]);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxFiles: 1,
    disabled: isValidating || isProcessing,
    noClick: true,
    noKeyboard: true
  });

  const reset = () => {
    validationRunRef.current += 1;
    clearPreview();
    setFile(null);
    setPageCount(0);
    setError('');
    setOutputBlob(null);
    setOutputName('');
    setOutputSummary('');
    setProgress({ message: '', value: 0 });
  };

  const cancelProcessing = () => {
    if (!processingRef.current) return;
    processingRunRef.current += 1;
    processingRef.current = false;
    renderTaskRef.current?.cancel();
    renderTaskRef.current = null;
    [loadingTaskRef, outputLoadingTaskRef].forEach((taskRef) => {
      const loadingTask = taskRef.current;
      taskRef.current = null;
      if (loadingTask) {
        void loadingTask.destroy().catch((destroyError) => {
          console.error('Unable to cancel the PDF processing task:', destroyError);
        });
      }
    });
    const worker = workerRef.current;
    workerRef.current = null;
    if (worker) {
      void worker.terminate().catch((terminateError) => {
        console.error('Unable to stop the OCR worker:', terminateError);
      });
    }
    setIsProcessing(false);
    setOutputBlob(null);
    setOutputName('');
    setOutputSummary('');
    setProgress({ message: '', value: 0 });
    setError('OCR cancelled. Your selected PDF is still available to try again.');
  };

  const downloadOutput = () => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = outputName;
    link.click();
    markOutputDownloaded();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const processPdf = async () => {
    if (processingRef.current || !file || pageCount < 1) return;
    const runId = ++processingRunRef.current;
    processingRef.current = true;
    setIsProcessing(true);
    setError('');
    setOutputBlob(null);
    setOutputName('');
    setOutputSummary('');
    setProgress({ message: 'Opening the PDF…', value: 0 });

    let loadingTask;
    let worker;
    const ocrWordsByPage = new Map();
    const sourceTextByPage = [];
    let pagesWithExistingText = 0;
    let pagesOcrProcessed = 0;
    let totalRecognizedWords = 0;

    const updateProgress = (message, pageNumber, pageProgress = 0) => {
      if (processingRunRef.current !== runId) return;
      const completed = Math.max(0, pageNumber - 1);
      const value = Math.min(99, Math.round(((completed + pageProgress) / pageCount) * 100));
      setProgress({ message, value });
    };

    try {
      const inputBytes = new Uint8Array(await file.arrayBuffer());
      if (processingRunRef.current !== runId) return;
      const outputDocument = await PDFDocument.load(inputBytes, { updateMetadata: false });
      if (outputDocument.isEncrypted || outputDocument.getPageCount() !== pageCount) {
        throw new Error('The PDF changed after selection or could not be safely opened. Select it again and retry.');
      }

      loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(inputBytes) });
      loadingTaskRef.current = loadingTask;
      const sourceDocument = await loadingTask.promise;
      if (sourceDocument.numPages !== pageCount || sourceDocument.numPages > MAX_PAGES) {
        throw new Error('The PDF page count changed after selection. Select the file again and retry.');
      }

      const outputPages = outputDocument.getPages();
      let embeddedFont;
      for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
        if (processingRunRef.current !== runId) return;
        updateProgress(`Reading page ${pageNumber} of ${pageCount}…`, pageNumber);

        const sourcePage = await sourceDocument.getPage(pageNumber);
        const content = await sourcePage.getTextContent();
        const sourceText = getPageText(content);
        sourceTextByPage.push(sourceText);
        const normalizedSourceText = normalizeSearchText(sourceText);
        if (normalizedSourceText.replaceAll(' ', '').length >= MIN_USABLE_TEXT_LENGTH) {
          pagesWithExistingText += 1;
          sourcePage.cleanup();
          updateProgress(`Using the existing text on page ${pageNumber} of ${pageCount}.`, pageNumber, 1);
          continue;
        }

        if (!worker) {
          updateProgress('Loading English OCR engine and language data…', pageNumber);
          worker = await createWorker('eng', 1, {
            workerPath: '/ocr-assets/worker.min.js',
            corePath: '/ocr-assets',
            langPath: '/ocr-assets/lang',
            logger: (message) => {
              if (processingRunRef.current !== runId) return;
              if (message.status === 'loading tesseract core') {
                updateProgress('Loading OCR engine…', pageNumber, message.progress || 0);
              } else if (message.status === 'loading language traineddata') {
                updateProgress('Loading English OCR data…', pageNumber, message.progress || 0);
              } else if (message.status === 'recognizing text') {
                updateProgress(
                  `Recognizing scanned page ${pageNumber} of ${pageCount}…`,
                  pageNumber,
                  message.progress || 0
                );
              }
            }
          });
          if (processingRunRef.current !== runId) {
            await worker.terminate();
            worker = null;
            return;
          }
          workerRef.current = worker;
        }

        const baseViewport = sourcePage.getViewport({ scale: 1 });
        const scale = Math.min(
          2,
          Math.sqrt(MAX_PAGE_PIXELS / (baseViewport.width * baseViewport.height))
        );
        // Keep OCR pixels unrotated; the PDF page applies its rotation to both the scan and text.
        const viewport = sourcePage.getViewport({ scale, rotation: 0 });
        const canvas = window.document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
        if (!context) {
          sourcePage.cleanup();
          throw new Error('Your browser could not prepare this scanned page for OCR.');
        }

        try {
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          updateProgress(`Rendering scanned page ${pageNumber} of ${pageCount}…`, pageNumber);
          const renderTask = sourcePage.render({ canvasContext: context, viewport, intent: 'print' });
          renderTaskRef.current = renderTask;
          await renderTask.promise;
          renderTaskRef.current = null;
          if (processingRunRef.current !== runId) return;

          const result = await worker.recognize(canvas, {}, { blocks: true });
          const words = getOcrWords(result.data);
          pagesOcrProcessed += 1;
          if (words.length) {
            if (!embeddedFont) embeddedFont = await outputDocument.embedFont(StandardFonts.Helvetica);
            addInvisibleOcrText(outputPages[pageNumber - 1], words, viewport, embeddedFont);
            ocrWordsByPage.set(pageNumber, words.map((word) => word.text));
            totalRecognizedWords += words.length;
          }
        } finally {
          renderTaskRef.current = null;
          canvas.width = 0;
          canvas.height = 0;
          sourcePage.cleanup();
        }
        updateProgress(`Finished page ${pageNumber} of ${pageCount}.`, pageNumber, 1);
      }

      if (processingRunRef.current !== runId) return;
      const sourceHasText = sourceTextByPage.some((text) => normalizeSearchText(text).length > 0);
      if (!sourceHasText && totalRecognizedWords === 0) {
        throw new Error('No text was found. The PDF may be blank or its scans may be too faint to recognize.');
      }

      setProgress({ message: 'Building and checking the searchable PDF…', value: 99 });
      const outputBytes = await outputDocument.save();
      const verifiedPdf = await PDFDocument.load(outputBytes, { updateMetadata: false });
      if (verifiedPdf.isEncrypted || verifiedPdf.getPageCount() !== pageCount) {
        throw new Error('The generated PDF failed its page-count or encryption check.');
      }

      const outputLoadingTask = pdfjsLib.getDocument({ data: new Uint8Array(outputBytes) });
      outputLoadingTaskRef.current = outputLoadingTask;
      let outputPdf;
      try {
        outputPdf = await outputLoadingTask.promise;
        if (outputPdf.numPages !== pageCount) {
          throw new Error('The generated PDF failed its page-count check.');
        }
        for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
          if (processingRunRef.current !== runId) return;
          const outputPage = await outputPdf.getPage(pageNumber);
          const outputContent = await outputPage.getTextContent();
          const outputText = normalizeSearchText(getPageText(outputContent));
          const expectedSourceText = normalizeSearchText(sourceTextByPage[pageNumber - 1]);
          if (expectedSourceText && !outputText.includes(expectedSourceText)) {
            throw new Error(`The generated PDF did not retain the existing searchable text on page ${pageNumber}.`);
          }
          const expectedOcrWords = ocrWordsByPage.get(pageNumber) || [];
          for (const word of expectedOcrWords) {
            const normalizedWord = normalizeSearchText(word);
            if (normalizedWord && !outputText.includes(normalizedWord)) {
              throw new Error(`The OCR text could not be verified on page ${pageNumber}. No download was created.`);
            }
          }
          outputPage.cleanup();
        }
      } finally {
        if (outputLoadingTaskRef.current === outputLoadingTask) {
          outputLoadingTaskRef.current = null;
          await outputLoadingTask.destroy().catch((destroyError) => {
            console.error('Unable to release the generated PDF validation task:', destroyError);
          });
        }
      }

      if (processingRunRef.current !== runId) return;
      const baseName = getOutputName(file.name);
      const summaryParts = [];
      if (pagesWithExistingText) {
        summaryParts.push(`${pagesWithExistingText} page${pagesWithExistingText === 1 ? '' : 's'} already had searchable text`);
      }
      if (pagesOcrProcessed) {
        summaryParts.push(
          `${pagesOcrProcessed} scanned page${pagesOcrProcessed === 1 ? '' : 's'} OCR processed · ${totalRecognizedWords} words recognized`
        );
      }
      setOutputBlob(new Blob([outputBytes], { type: 'application/pdf' }));
      setOutputName(baseName);
      setOutputSummary(summaryParts.join(' · ') || 'Searchable PDF checked');
      setProgress({ message: 'Searchable PDF created and validated.', value: 100 });
    } catch (processingError) {
      if (processingRunRef.current === runId) {
        console.error('Unable to create a searchable PDF:', processingError);
        const message = processingError?.message || '';
        setError(
          message.includes('traineddata') || message.includes('fetch') || message.includes('Network')
            ? 'The bundled OCR resources could not be loaded. Check your connection and retry; your PDF was not uploaded.'
            : message.includes('WinAnsi') || message.includes('cannot encode')
              ? 'The OCR result contains characters that the current searchable-PDF font cannot encode. No download was created.'
            : message || 'This PDF could not be OCR processed. Try another unencrypted PDF.'
        );
        setProgress({ message: '', value: 0 });
      }
    } finally {
      if (worker && workerRef.current === worker) {
        workerRef.current = null;
        await worker.terminate().catch((terminateError) => {
          console.error('Unable to release the OCR worker:', terminateError);
        });
      }
      if (loadingTask && loadingTaskRef.current === loadingTask) {
        loadingTaskRef.current = null;
        await loadingTask.destroy().catch((destroyError) => {
          console.error('Unable to release the source PDF processing task:', destroyError);
        });
      }
      if (processingRunRef.current === runId) {
        processingRef.current = false;
        setIsProcessing(false);
      }
    }
  };

  useEffect(() => () => {
    validationRunRef.current += 1;
    processingRunRef.current += 1;
    renderTaskRef.current?.cancel();
    const previewTask = previewLoadingTaskRef.current;
    previewLoadingTaskRef.current = null;
    if (previewTask) {
      void previewTask.destroy().catch((destroyError) => {
        console.error('Unable to release the PDF preview task:', destroyError);
      });
    }
    const loadingTask = loadingTaskRef.current;
    loadingTaskRef.current = null;
    if (loadingTask) {
      void loadingTask.destroy().catch((destroyError) => {
        console.error('Unable to release the PDF processing task:', destroyError);
      });
    }
    const outputLoadingTask = outputLoadingTaskRef.current;
    outputLoadingTaskRef.current = null;
    if (outputLoadingTask) {
      void outputLoadingTask.destroy().catch((destroyError) => {
        console.error('Unable to release the generated PDF validation task:', destroyError);
      });
    }
    const worker = workerRef.current;
    workerRef.current = null;
    if (worker) {
      void worker.terminate().catch((terminateError) => {
        console.error('Unable to release the OCR worker:', terminateError);
      });
    }
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  const ocrNotice = (
    <section className="ocr-pdf-notice rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-900">
      <h2 className="font-bold">English OCR · searchable PDF output</h2>
      <p className="mt-1">
        Existing text stays searchable. Pages without usable text are recognized from their images, and the original page appearance is retained.
        Tesseract.js uses worker, core, and English language data bundled with this website. These supporting resources are separate from your PDF; recognition and PDF creation happen in this browser.
        The PDF and its page images are not sent to a document conversion server.
      </p>
      <p className="mt-2 text-xs text-blue-800">
        Supports unencrypted PDFs up to {MAX_PAGES} pages. Recognition works best on clear, upright printed English; handwriting, scan quality, and complex layouts can affect accuracy.
      </p>
    </section>
  );

  return (
    <div className="ocr-pdf-workspace mx-auto max-w-4xl space-y-6">
      <input {...getInputProps()} aria-label="Choose a PDF for OCR" />
      {!file && ocrNotice}

      {!file && (
      <section
        {...getRootProps({
          role: 'group',
          'aria-label': 'Choose a PDF for OCR',
          className: `pdf-upload-trigger pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone protect-extract-upload-zone cursor-pointer ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
          } ${isValidating || isProcessing ? 'cursor-wait opacity-70' : ''}`
        })}
      >
        <div className="merge-pdf-upload-content">
          <div className="pdf-upload-icon" aria-hidden="true">
            {isValidating
              ? <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              : <Upload className="h-6 w-6 text-blue-600" />}
          </div>
          <div className="merge-pdf-upload-copy">
            <h3 aria-live="polite">
              {isValidating
                ? 'Checking PDF…'
                : isDragActive
                  ? 'Drop the PDF here'
                  : 'Choose or drop a PDF for OCR'}
            </h3>
            <p>Recognize scanned text and add a searchable text layer to PDF pages.</p>
          </div>
          <button
            type="button"
            className="pdf-editor-primary-button merge-pdf-upload-button"
            onClick={(event) => {
              event.stopPropagation();
              open();
            }}
            disabled={isValidating || isProcessing}
          >
            Choose PDF
          </button>
        </div>
        {isValidating && <p className="sr-only" role="status">{validationStatus}</p>}
      </section>
      )}

      {file && (
        <section className="pdf-attached-file-card grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="min-w-0">
            <div className="flex items-start gap-3">
              <AttachedFileIcon />
              <div className="min-w-0">
                <p className="break-all font-semibold text-slate-800">{file.name}</p>
                <p className="text-sm text-slate-500">{formatBytes(file.size)} · {pageCount} {pageCount === 1 ? 'page' : 'pages'}</p>
              </div>
            </div>
            {previewUrl && (
              <figure className="mt-4">
                <img
                  src={previewUrl}
                  alt={`Preview of page 1 of ${file.name}`}
                  className="mx-auto max-h-80 max-w-full rounded-lg border border-slate-200 object-contain"
                />
                <figcaption className="mt-2 text-center text-xs text-slate-500">First-page preview</figcaption>
              </figure>
            )}
          </div>
          <AttachedFileActions
            fileName={file.name}
            onReplace={open}
            onRemove={reset}
            disabled={isValidating || isProcessing}
          />
        </section>
      )}

      {file && (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {isProcessing && (
            <div className="space-y-2" role="status" aria-live="polite">
              <div className="flex flex-col justify-between gap-1 text-sm text-slate-600 sm:flex-row">
                <span>{progress.message}</span>
                <span>{progress.value}%</span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label="OCR processing progress"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={progress.value}
              >
                <div className="h-full bg-blue-600 transition-all duration-200" style={{ width: `${progress.value}%` }} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={processPdf}
              disabled={isProcessing || isValidating}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {isProcessing
                ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Processing PDF…</>
                : <><ScanText className="h-5 w-5" aria-hidden="true" /> Create searchable PDF</>}
            </button>
            {isProcessing && (
              <button
                type="button"
                onClick={cancelProcessing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <X className="h-4 w-4" aria-hidden="true" /> Cancel
              </button>
            )}
          </div>
        </section>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {outputBlob && (
        <section className="flex flex-col gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-900 sm:flex-row sm:items-center sm:justify-between" role="status">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold">{FILE_DOWNLOAD_READY_MESSAGE}</p>
              <p className="mt-1 text-sm">{outputSummary}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={downloadOutput}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 font-semibold text-white transition hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
          >
            <Download className="h-4 w-4" aria-hidden="true" /> Download searchable PDF
          </button>
        </section>
      )}
      {file && ocrNotice}
    </div>
  );
};

export default OcrPdf;
