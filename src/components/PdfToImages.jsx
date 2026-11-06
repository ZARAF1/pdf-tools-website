import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import {
  AlertCircle,
  Eye,
  FileImage,
  Loader2,
  Paperclip,
  RefreshCw,
  Settings2,
  Upload
} from 'lucide-react';
import { PASSWORD_PROTECTED_PDF_MESSAGE, validateUnencryptedPdf } from '../lib/pdfValidation';
import pdfjsLib from '../lib/pdfjsClient';
import { encodeBmp } from '../lib/imageArchive.mjs';
import { findContentBounds } from '../lib/pdfImageCrop.mjs';
import { createPdfImageDownload } from '../lib/pdfImageOutput.mjs';
import { normalizeOutputFileName } from '../lib/outputFileName.mjs';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';
import DownloadReadyCard from './DownloadReadyCard';
import PdfPageThumbnailRail from './PdfPageThumbnailRail';
import { getLocalizedTool } from '../i18n/toolTranslations.mjs';
import { formatToolUiMessage, getLocalizedToolUi } from '../i18n/toolUiLocalization.mjs';
import { useLanguage } from '../i18n/useLanguage';

const MAX_PAGES = 50;
const MAX_PAGE_PIXELS = 16_000_000;
const MAX_IMAGE_BYTES = 400 * 1024 * 1024;
const FORMATS = [
  { id: 'png', name: 'PNG', mimeType: 'image/png', extension: 'png', description: 'Lossless image quality.' },
  { id: 'jpg', name: 'JPG / JPEG', mimeType: 'image/jpeg', extension: 'jpg', description: 'Usually smaller files; adjust image quality.' },
  { id: 'bmp', name: 'BMP', mimeType: 'image/bmp', extension: 'bmp', description: 'Uncompressed bitmap images; files can be large.' }
];

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getBaseName = (filename) => {
  const base = filename.replace(/\.pdf$/i, '').trim();
  const safe = base.replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  return safe || 'document';
};

const canvasToBlob = (canvas, format, quality) => new Promise((resolve, reject) => {
  canvas.toBlob((blob) => {
    if (!blob) {
      reject(new Error('The browser could not encode a page image. Try another format or lower quality.'));
    } else if (blob.type !== format.mimeType) {
      reject(new Error(`This browser did not create a genuine ${format.name} image.`));
    } else {
      resolve(blob);
    }
  }, format.mimeType, quality);
});

const cropCanvasToContent = (canvas, context) => {
  const bounds = findContentBounds(context.getImageData(0, 0, canvas.width, canvas.height));
  if (!bounds || (bounds.left === 0 && bounds.top === 0
    && bounds.width === canvas.width && bounds.height === canvas.height)) {
    return { canvas, context };
  }

  const croppedCanvas = window.document.createElement('canvas');
  croppedCanvas.width = bounds.width;
  croppedCanvas.height = bounds.height;
  const croppedContext = croppedCanvas.getContext('2d', { alpha: false });
  if (!croppedContext) {
    croppedCanvas.width = 0;
    croppedCanvas.height = 0;
    throw new Error('Your browser could not create a cropped page image.');
  }
  croppedContext.drawImage(
    canvas,
    bounds.left,
    bounds.top,
    bounds.width,
    bounds.height,
    0,
    0,
    bounds.width,
    bounds.height
  );
  return { canvas: croppedCanvas, context: croppedContext };
};

const PdfToImages = () => {
  const { language, translate } = useLanguage();
  const { pdfToImages: pdfImagesUi } = getLocalizedToolUi(language);
  const localizedTool = getLocalizedTool(language, {
    id: 'pdf-images',
    name: 'PDF to Images',
    description: 'Export PDF pages as image files.'
  });
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [previewPage, setPreviewPage] = useState(1);
  const [selectedPageNumbers, setSelectedPageNumbers] = useState(() => new Set());
  const [exportScope, setExportScope] = useState('all');
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState('standard');
  const [jpegQuality, setJpegQuality] = useState(0.85);
  const [autoCrop, setAutoCrop] = useState(true);
  const [outputBaseName, setOutputBaseName] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [outputName, setOutputName] = useState('');
  const [outputSizeBytes, setOutputSizeBytes] = useState(0);
  const [downloadLabel, setDownloadLabel] = useState('');
  const markOutputDownloaded = useToolExitGuard(Boolean(file), outputUrl);

  const generationRef = useRef(0);
  const validationRef = useRef(0);
  const processingRef = useRef(false);
  const loadingTaskRef = useRef(null);
  const previewLoadingTaskRef = useRef(null);
  const previewDocumentTaskRef = useRef(null);
  const renderTaskRef = useRef(null);
  const generatedFilesRef = useRef(null);
  const generatedFormatRef = useRef(null);
  const outputUrlRef = useRef('');

  const clearOutput = useCallback(() => {
    if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
    outputUrlRef.current = '';
    setOutputUrl('');
    setOutputName('');
    setOutputSizeBytes(0);
    setDownloadLabel('');
  }, []);

  const stopPdfLoading = useCallback(() => {
    const loadingTask = loadingTaskRef.current;
    loadingTaskRef.current = null;
    if (loadingTask) {
      void loadingTask.destroy().catch((destroyError) => {
        console.error('Unable to release the PDF rendering task:', destroyError);
      });
    }
  }, []);

  const stopPdfPreviewLoading = useCallback(() => {
    const loadingTasks = [
      previewLoadingTaskRef.current,
      previewDocumentTaskRef.current
    ].filter((task, index, tasks) => task && tasks.indexOf(task) === index);
    previewLoadingTaskRef.current = null;
    previewDocumentTaskRef.current = null;
    setPreviewDocument(null);
    setPreviewPage(1);
    loadingTasks.forEach((task) => {
      void task.destroy().catch((destroyError) => {
        console.error('Unable to release the PDF preview task:', destroyError);
      });
    });
  }, []);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (isProcessing || isValidating) return;
    setError('');
    setProgress('');
    clearOutput();
    generatedFilesRef.current = null;
    generatedFormatRef.current = null;

    if (rejectedFiles.length) {
      setError('Choose one PDF file at a time.');
      return;
    }
    if (acceptedFiles.length !== 1) {
      setError('Choose one PDF file to convert.');
      return;
    }

    const [selectedFile] = acceptedFiles;
    const validationRun = ++validationRef.current;
    let previewTask;
    setIsValidating(true);
    try {
      const pdf = await validateUnencryptedPdf(selectedFile);
      const count = pdf.getPageCount();
      if (count < 1) throw new Error('This PDF does not contain any pages.');
      if (count > MAX_PAGES) {
        throw new Error(`This PDF has ${count} pages. Choose a PDF with no more than ${MAX_PAGES} pages.`);
      }
      if (validationRef.current !== validationRun) return;
      const previewData = new Uint8Array(await selectedFile.arrayBuffer());
      if (validationRef.current !== validationRun) return;
      previewTask = pdfjsLib.getDocument({ data: previewData });
      previewLoadingTaskRef.current = previewTask;
      const nextPreviewDocument = await previewTask.promise;
      if (validationRef.current !== validationRun) return;
      if (nextPreviewDocument.numPages !== count) {
        throw new Error('The PDF page count could not be confirmed for preview. Select the file again and retry.');
      }

      const previousPreviewTask = previewDocumentTaskRef.current;
      previewDocumentTaskRef.current = previewTask;
      previewLoadingTaskRef.current = null;
      setPreviewDocument(nextPreviewDocument);
      setPreviewPage(1);
      setSelectedPageNumbers(new Set());
      setExportScope('all');
      if (previousPreviewTask) {
        void previousPreviewTask.destroy().catch((destroyError) => {
          console.error('Unable to release the previous PDF preview task:', destroyError);
        });
      }
      setFile(selectedFile);
      setPageCount(count);
      setOutputBaseName(getBaseName(selectedFile.name));
    } catch (validationError) {
      if (previewTask && previewLoadingTaskRef.current === previewTask) {
        previewLoadingTaskRef.current = null;
        void previewTask.destroy().catch((destroyError) => {
          console.error('Unable to release the invalid PDF preview task:', destroyError);
        });
      }
      if (validationRef.current === validationRun) {
        console.error('Unable to validate PDF for image conversion:', validationError);
        const message = validationError.message || '';
        setError(
          message === PASSWORD_PROTECTED_PDF_MESSAGE || message.startsWith('This PDF ')
            ? message
            : 'This file is unreadable or is not a valid PDF. Choose an unencrypted PDF with 1–50 pages.'
        );
      }
    } finally {
      if (validationRef.current === validationRun) setIsValidating(false);
    }
  }, [clearOutput, isProcessing, isValidating]);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxFiles: 1,
    disabled: isValidating || isProcessing
  });

  const createOutput = async (images, selectedFormat, baseName, runId) => {
    const imageLabel = images.length === 1 ? 'image' : 'images';
    if (images.length > 1) setProgress(`Creating ZIP: 0 of ${images.length} ${imageLabel}`);
    const output = await createPdfImageDownload({
      images,
      format: selectedFormat,
      outputBaseName: baseName,
      fallbackBaseName: getBaseName(file?.name || 'document.pdf'),
      onProgress: (processed, total) => {
        if (generationRef.current === runId) {
          setProgress(`Creating ZIP: ${processed} of ${total} ${imageLabel}`);
        }
      },
      isCancelled: () => generationRef.current !== runId
    });
    if (generationRef.current !== runId) return;

    const url = URL.createObjectURL(output.blob);
    clearOutput();
    outputUrlRef.current = url;
    setOutputUrl(url);
    setOutputName(output.fileName);
    setOutputSizeBytes(output.blob.size);
    setDownloadLabel(output.downloadLabel);
    generatedFilesRef.current = null;
    generatedFormatRef.current = null;
    setProgress('');
  };

  const convert = async () => {
    if (processingRef.current) return;
    if (!file || pageCount < 1) {
      setError('Choose a valid PDF before converting.');
      return;
    }
    if (exportScope === 'selected' && selectedPageNumbers.size === 0) {
      setError(pdfImagesUi.selectPagesBeforeExport);
      return;
    }
    if (pageCount > MAX_PAGES) {
      setError(`This tool supports PDFs with up to ${MAX_PAGES} pages.`);
      return;
    }

    const selectedFormat = FORMATS.find((item) => item.id === format);
    if (!selectedFormat) {
      setError('Choose PNG, JPG, or BMP as the output format.');
      return;
    }
    if (format === 'jpg' && (!Number.isFinite(jpegQuality) || jpegQuality < 0.5 || jpegQuality > 1)) {
      setError('JPG quality must be between 50% and 100%.');
      return;
    }

    const runId = ++generationRef.current;
    processingRef.current = true;
    setIsProcessing(true);
    setError('');
    setProgress('Opening the PDF…');
    clearOutput();
    generatedFilesRef.current = null;
    generatedFormatRef.current = null;

    let loadingTask;
    let imageFiles;
    try {
      const data = new Uint8Array(await file.arrayBuffer());
      if (generationRef.current !== runId) return;
      loadingTask = pdfjsLib.getDocument({ data });
      loadingTaskRef.current = loadingTask;
      const document = await loadingTask.promise;
      if (document.numPages !== pageCount || document.numPages > MAX_PAGES) {
        throw new Error('The PDF page count could not be confirmed. Select the file again and retry.');
      }

      const requestedScale = quality === 'high' ? 3 : 2;
      imageFiles = [];
      let totalBytes = 0;
      const pageNumbersToExport = Array.from(
        { length: document.numPages },
        (_, index) => index + 1
      ).filter((pageNumber) => (
        exportScope === 'all' || selectedPageNumbers.has(pageNumber)
      ));
      if (!pageNumbersToExport.length) {
        throw new Error(pdfImagesUi.selectPagesBeforeExport);
      }

      for (const pageNumber of pageNumbersToExport) {
        if (generationRef.current !== runId) return;
        setProgress(`Rendering page ${pageNumber} of ${document.numPages}`);
        const page = await document.getPage(pageNumber);
        if (generationRef.current !== runId) {
          page.cleanup();
          return;
        }
        const pageViewport = page.getViewport({ scale: 1 });
        const scale = Math.min(
          requestedScale,
          Math.sqrt(MAX_PAGE_PIXELS / (pageViewport.width * pageViewport.height))
        );
        const viewport = page.getViewport({ scale });
        const canvas = window.document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) throw new Error('Your browser could not create a page image.');

        let outputCanvas = canvas;
        let outputContext = context;
        try {
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          const renderTask = page.render({ canvasContext: context, viewport, intent: 'print' });
          renderTaskRef.current = renderTask;
          await renderTask.promise;
          renderTaskRef.current = null;
          if (generationRef.current !== runId) return;

          if (autoCrop) {
            const cropped = cropCanvasToContent(canvas, context);
            outputCanvas = cropped.canvas;
            outputContext = cropped.context;
          }

          let bytes;
          if (format === 'bmp') {
            bytes = encodeBmp(outputContext.getImageData(0, 0, outputCanvas.width, outputCanvas.height));
          } else {
            const blob = await canvasToBlob(
              outputCanvas,
              selectedFormat,
              format === 'jpg' ? jpegQuality : undefined
            );
            bytes = new Uint8Array(await blob.arrayBuffer());
          }
          if (generationRef.current !== runId) return;

          totalBytes += bytes.byteLength;
          if (totalBytes > MAX_IMAGE_BYTES) {
            throw new Error('The generated images exceed the browser memory limit. Choose Standard quality or JPG, then retry.');
          }
          imageFiles.push({
            name: `page-${String(pageNumber).padStart(3, '0')}.${selectedFormat.extension}`,
            bytes
          });
        } finally {
          renderTaskRef.current = null;
          if (outputCanvas !== canvas) {
            outputCanvas.width = 0;
            outputCanvas.height = 0;
          }
          canvas.width = 0;
          canvas.height = 0;
          page.cleanup();
        }
      }

      if (generationRef.current !== runId) return;
      generatedFilesRef.current = imageFiles;
      generatedFormatRef.current = selectedFormat;
      await createOutput(imageFiles, selectedFormat, outputBaseName, runId);
    } catch (processingError) {
      if (generationRef.current === runId) {
        console.error('Unable to convert PDF pages to images:', processingError);
        setError(processingError.message || 'The PDF could not be converted. Try another file or lower quality.');
        setProgress('');
        if (!generatedFilesRef.current) {
          generatedFilesRef.current = null;
          generatedFormatRef.current = null;
        }
      }
    } finally {
      if (loadingTask && loadingTaskRef.current === loadingTask) {
        loadingTaskRef.current = null;
        try {
          await loadingTask.destroy();
        } catch (destroyError) {
          console.error('Unable to release the PDF rendering task:', destroyError);
        }
      }
      if (generationRef.current === runId) {
        processingRef.current = false;
        setIsProcessing(false);
      }
    }
  };

  const retryArchive = async () => {
    const images = generatedFilesRef.current;
    const selectedFormat = generatedFormatRef.current;
    if (processingRef.current || !images || images.length < 2 || !selectedFormat) return;

    const runId = ++generationRef.current;
    processingRef.current = true;
    setIsProcessing(true);
    setError('');
    try {
      await createOutput(images, selectedFormat, outputBaseName, runId);
    } catch (archiveError) {
      if (generationRef.current === runId) {
        console.error('Unable to create ZIP archive:', archiveError);
        setError(archiveError.message || 'The ZIP could not be created. Retry without converting the PDF again.');
      }
    } finally {
      if (generationRef.current === runId) {
        processingRef.current = false;
        setIsProcessing(false);
      }
    }
  };

  const toggleExportPage = (pageNumber) => {
    if (exportScope !== 'selected' || isProcessing) return;
    setSelectedPageNumbers((current) => {
      const next = new Set(current);
      if (next.has(pageNumber)) next.delete(pageNumber);
      else next.add(pageNumber);
      return next;
    });
    clearOutput();
    generatedFilesRef.current = null;
    generatedFormatRef.current = null;
    setProgress('');
    setError('');
  };

  const changeExportScope = (nextScope) => {
    if (exportScope === nextScope) return;
    setExportScope(nextScope);
    if (nextScope === 'all') setSelectedPageNumbers(new Set());
    clearOutput();
    generatedFilesRef.current = null;
    generatedFormatRef.current = null;
    setProgress('');
    setError('');
  };

  const cancelConversion = () => {
    generationRef.current += 1;
    renderTaskRef.current?.cancel();
    renderTaskRef.current = null;
    stopPdfLoading();
    generatedFilesRef.current = null;
    generatedFormatRef.current = null;
    processingRef.current = false;
    setIsProcessing(false);
    setProgress('');
    setError('Conversion cancelled. Your selected PDF is still available to try again.');
  };

  const reset = () => {
    generationRef.current += 1;
    validationRef.current += 1;
    renderTaskRef.current?.cancel();
    renderTaskRef.current = null;
    stopPdfLoading();
    stopPdfPreviewLoading();
    processingRef.current = false;
    generatedFilesRef.current = null;
    generatedFormatRef.current = null;
    clearOutput();
    setFile(null);
    setPageCount(0);
    setSelectedPageNumbers(new Set());
    setExportScope('all');
    setFormat('png');
    setQuality('standard');
    setJpegQuality(0.85);
    setAutoCrop(true);
    setOutputBaseName('');
    setIsValidating(false);
    setIsProcessing(false);
    setProgress('');
    setError('');
  };

  const resetSettings = () => {
    setExportScope('all');
    setFormat('png');
    setQuality('standard');
    setJpegQuality(0.85);
    setAutoCrop(true);
    setOutputBaseName(file ? getBaseName(file.name) : '');
    generatedFilesRef.current = null;
    generatedFormatRef.current = null;
    clearOutput();
    setProgress('');
    setError('');
  };

  useEffect(() => () => {
    generationRef.current += 1;
    renderTaskRef.current?.cancel();
    renderTaskRef.current = null;
    [loadingTaskRef, previewLoadingTaskRef, previewDocumentTaskRef].forEach((taskRef) => {
      const loadingTask = taskRef.current;
      taskRef.current = null;
      if (loadingTask) {
        void loadingTask.destroy().catch((destroyError) => {
          console.error('Unable to release the PDF rendering task:', destroyError);
        });
      }
    });
    if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
  }, []);

  return (
    <div className="pdf-tool-workflow pdf-to-images-workflow space-y-6">
      <div
        className="image-pdf-workspace-shell pdf-images-workspace-shell"
        data-has-content={file ? 'true' : 'false'}
        data-has-file={file ? 'true' : 'false'}
      >
      <input {...getInputProps()} aria-label="Choose a PDF to convert to images" />
      <section className="tool-attachment-section image-pdf-attachment-section pdf-images-attachment-section" aria-labelledby="pdf-images-attachment-heading">
        <div className="tool-attachment-heading">
          <span className="tool-attachment-icon" aria-hidden="true">
            <Upload className="h-5 w-5" />
          </span>
          <div>
            <h2 id="pdf-images-attachment-heading">{translate('attachPdfHere')}</h2>
            <p>One unencrypted PDF · up to {MAX_PAGES} pages</p>
          </div>
        </div>
        <aside className="tool-attachment-guidance" aria-labelledby="pdf-images-attachment-guidance-heading">
          <h3 id="pdf-images-attachment-guidance-heading">{localizedTool.name}</h3>
          <p>Export PDF pages as PNG, JPG, or BMP images. One-page PDFs download as a single image; multi-page PDFs are bundled in a ZIP. Blank margins can be cropped automatically.</p>
        </aside>
        <div className="tool-attachment-content">
          <section className="pdf-images-file-section" aria-label="PDF attachment">
            {file && (
              <section className="conversion-selected-file-section pdf-images-selected-file-section" aria-labelledby="pdf-images-file-heading">
                <header className="pdf-images-file-section-header">
                  <div className="merge-panel-title">
                    <Paperclip aria-hidden="true" />
                    <h3 id="pdf-images-file-heading" className="merge-selected-files-title">PDF to convert</h3>
                  </div>
                  <p>One PDF selected. Replace it or remove it to choose another.</p>
                </header>
                <section className="pdf-attached-file-card pdf-workflow-selected flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <AttachedFileIcon />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">{file.name}</p>
                      <p className="text-sm text-slate-500">{formatBytes(file.size)} · {pageCount} {pageCount === 1 ? 'page' : 'pages'}</p>
                    </div>
                  </div>
                  <AttachedFileActions
                    fileName={file.name}
                    onReplace={open}
                    onRemove={reset}
                    disabled={isValidating || isProcessing}
                  />
                </section>
              </section>
            )}
      {!file && (
      <section
        {...getRootProps({
          role: 'group',
          'aria-label': 'Choose a PDF to convert to images',
          className: `pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
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
                ? 'Checking PDF pages…'
                : isDragActive
                  ? 'Drop the PDF here'
                  : 'Choose or drop a PDF to convert to images'}
            </h3>
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
      </section>
      )}
          </section>
        </div>
      </section>

      {file && (
        <section className="pdf-images-settings-shell pdf-images-settings-panel pdf-workflow-controls" aria-labelledby="pdf-images-settings-heading">
          <div className="pdf-images-settings-topbar">
            <div className="pdf-images-settings-title-row">
              <div className="merge-panel-title">
                <Settings2 aria-hidden="true" />
                <h3 id="pdf-images-settings-heading" className="pdf-images-settings-heading">Choose Settings</h3>
              </div>
              <button
                type="button"
                onClick={resetSettings}
                disabled={isProcessing || isValidating}
                className="pdf-images-settings-reset rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Reset
              </button>
            </div>
            <p>Set how each page is cropped and saved.</p>
            <div className="pdf-images-export-scope" role="group" aria-label="Image export scope">
              <button
                type="button"
                aria-pressed={exportScope === 'all'}
                onClick={() => changeExportScope('all')}
                disabled={isProcessing || isValidating}
              >
                {pdfImagesUi.includeAllImages}
              </button>
              <button
                type="button"
                aria-pressed={exportScope === 'selected'}
                onClick={() => changeExportScope('selected')}
                disabled={isProcessing || isValidating}
              >
                {pdfImagesUi.includeSelectedImages}
              </button>
            </div>
          </div>

          <div className="pdf-images-crop-setting">
            <input
              id="pdf-images-auto-crop"
              type="checkbox"
              aria-describedby="pdf-images-auto-crop-help"
              checked={autoCrop}
              disabled={!file || isValidating || isProcessing}
              onChange={(event) => {
                setAutoCrop(event.target.checked);
                clearOutput();
                generatedFilesRef.current = null;
                generatedFormatRef.current = null;
                setError('');
                setProgress('');
              }}
              className="accent-blue-600"
            />
            <div>
              <label htmlFor="pdf-images-auto-crop" className="font-semibold text-slate-800">Automatically crop blank page margins</label>
              <p id="pdf-images-auto-crop-help" className="mt-1 text-sm text-slate-600">Removes blank space around page content. Pages without visible content are left unchanged.</p>
            </div>
          </div>

        <fieldset disabled={!file || isValidating || isProcessing}>
          <legend className="mb-3 text-lg font-bold text-slate-800">Output format</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {FORMATS.map((item) => (
              <label
                key={item.id}
                data-selected={format === item.id}
                className={`pdf-images-option-card cursor-pointer rounded-xl border p-4 transition-colors ${
                  format === item.id ? 'border-blue-500' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <span className="flex items-center gap-2 font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="pdf-image-format"
                    value={item.id}
                    checked={format === item.id}
                    onChange={() => {
                      setFormat(item.id);
                      clearOutput();
                      generatedFilesRef.current = null;
                      generatedFormatRef.current = null;
                      setError('');
                      setProgress('');
                    }}
                    className="accent-blue-600"
                  />
                  {item.name}
                </span>
                <span className="mt-2 block text-sm text-slate-600">{item.description}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset disabled={!file || isValidating || isProcessing}>
          <legend className="mb-3 text-lg font-bold text-slate-800">Image quality</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label
              data-selected={quality === 'standard'}
              className={`pdf-images-option-card cursor-pointer rounded-xl border p-4 ${quality === 'standard' ? 'border-blue-500' : 'border-slate-200'}`}
            >
              <span className="flex items-center gap-2 font-semibold text-slate-800">
                <input
                  type="radio"
                  name="pdf-image-quality"
                  value="standard"
                  checked={quality === 'standard'}
                  onChange={() => {
                    setQuality('standard');
                    clearOutput();
                    generatedFilesRef.current = null;
                    generatedFormatRef.current = null;
                    setProgress('');
                  }}
                  className="accent-blue-600"
                />
                Standard
              </span>
              <span className="mt-1 block text-sm text-slate-600">About 144 DPI; recommended for most documents.</span>
            </label>
            <label
              data-selected={quality === 'high'}
              className={`pdf-images-option-card cursor-pointer rounded-xl border p-4 ${quality === 'high' ? 'border-blue-500' : 'border-slate-200'}`}
            >
              <span className="flex items-center gap-2 font-semibold text-slate-800">
                <input
                  type="radio"
                  name="pdf-image-quality"
                  value="high"
                  checked={quality === 'high'}
                  onChange={() => {
                    setQuality('high');
                    clearOutput();
                    generatedFilesRef.current = null;
                    generatedFormatRef.current = null;
                    setProgress('');
                  }}
                  className="accent-blue-600"
                />
                High quality
              </span>
              <span className="mt-1 block text-sm text-slate-600">About 216 DPI; can use more memory and take longer.</span>
            </label>
          </div>
        </fieldset>

        {format === 'jpg' && (
          <div className="pdf-images-jpeg-quality-setting space-y-2">
            <label htmlFor="pdf-images-jpeg-quality" className="text-sm font-semibold text-slate-700">
              JPG quality ({Math.round(jpegQuality * 100)}%)
            </label>
            <input
              id="pdf-images-jpeg-quality"
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={jpegQuality}
              disabled={!file || isValidating || isProcessing}
              onChange={(event) => {
                setJpegQuality(Number(event.target.value));
                clearOutput();
                generatedFilesRef.current = null;
                generatedFormatRef.current = null;
                setProgress('');
              }}
              className="w-full accent-blue-600"
            />
            <p className="text-xs text-slate-500">Higher quality usually creates larger JPG files.</p>
          </div>
        )}

        {quality === 'high' && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            High quality renders larger page images and may use substantial memory, especially for long PDFs.
          </p>
        )}

        </section>
      )}

      {file && (
        <section className="pdf-images-preview-shell" aria-labelledby="pdf-images-preview-heading">
          <header className="pdf-images-preview-heading">
            <div className="merge-panel-title">
              <Eye aria-hidden="true" />
              <h3 id="pdf-images-preview-heading" className="merge-selected-files-title">Preview</h3>
            </div>
            <p>{pdfImagesUi.previewSelectionDescription}</p>
            <p className="pdf-images-selected-pages-count" aria-live="polite">
              {selectedPageNumbers.size === 1
                ? pdfImagesUi.selectedPageCount
                : formatToolUiMessage(pdfImagesUi.selectedPagesCount, { count: selectedPageNumbers.size })}
            </p>
          </header>
          <div className="pdf-images-preview-panel">
            {previewDocument && (
              <PdfPageThumbnailRail
                document={previewDocument}
                pageNumbers={Array.from({ length: pageCount }, (_, index) => index + 1)}
                currentPage={previewPage}
                disabled={isProcessing || exportScope === 'all'}
                showPageNavigation={false}
                showSelectedMark
                selectedPageNumbers={selectedPageNumbers}
                onTogglePageSelection={toggleExportPage}
                getPageSelectionLabel={(pageNumber, isSelected) => formatToolUiMessage(
                  isSelected ? pdfImagesUi.removePageFromExport : pdfImagesUi.selectPageForExport,
                  { page: pageNumber }
                )}
                onSelectPage={setPreviewPage}
              />
            )}
          </div>
        </section>
      )}

      {file && (
        <div className="pdf-images-convert-actions">
          <div className="pdf-images-output-name-field">
            <label htmlFor="pdf-images-output-name" className="text-sm font-semibold text-slate-700">Output filename</label>
            <div className="pdf-images-output-name-controls">
              <input
                id="pdf-images-output-name"
                type="text"
                value={outputBaseName}
                disabled={!file || isValidating || isProcessing}
                onChange={(event) => {
                  const nextName = event.target.value;
                  setOutputBaseName(nextName);
                  if (outputUrl && outputName) {
                    setOutputName(normalizeOutputFileName(nextName, outputName));
                  }
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              />
              <div className="pdf-images-convert-buttons">
                <button
                  type="button"
                  onClick={convert}
                  disabled={isValidating || isProcessing || (exportScope === 'selected' && selectedPageNumbers.size === 0)}
                  aria-label="PDF to Images"
                  className="pdf-conversion-action-button inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  {isProcessing
                    ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    : <FileImage className="h-5 w-5" aria-hidden="true" />}
                  PDF to Images
                </button>
                {isProcessing && (
                  <button
                    type="button"
                    onClick={cancelConversion}
                    className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Cancel conversion
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500">The extension is added automatically. One page saves as an image; multiple pages use this name for the ZIP.</p>
          </div>
        </div>
      )}

      </div>

      {progress && <p className="flex items-center gap-2 text-sm text-blue-700" role="status" aria-live="polite">
        {isProcessing && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {progress}
      </p>}
      {error && <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <span>{error}</span>
      </p>}
      {error && generatedFilesRef.current?.length > 1 && !isProcessing && (
        <button
          type="button"
          onClick={retryArchive}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 font-semibold text-blue-700 transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Retry ZIP creation
        </button>
      )}
      {outputUrl && (
        <DownloadReadyCard
          fileName={outputName}
          sizeBytes={outputSizeBytes}
          href={outputUrl}
          onDownload={markOutputDownloaded}
          downloadLabel={downloadLabel}
          showFilenameEditor={false}
        />
      )}
    </div>
  );
};

export default PdfToImages;
