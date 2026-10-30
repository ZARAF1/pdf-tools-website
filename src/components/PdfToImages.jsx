import React, { useCallback, useEffect, useRef, useState } from 'react';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileImage,
  Loader2,
  RefreshCw,
  Upload
} from 'lucide-react';
import { PASSWORD_PROTECTED_PDF_MESSAGE, validateUnencryptedPdf } from '../lib/pdfValidation';
import pdfjsLib from '../lib/pdfjsClient';
import { createZipBlob, encodeBmp } from '../lib/imageArchive';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';

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

const PdfToImages = () => {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState('standard');
  const [jpegQuality, setJpegQuality] = useState(0.85);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [zipUrl, setZipUrl] = useState('');
  const [zipName, setZipName] = useState('');

  const generationRef = useRef(0);
  const validationRef = useRef(0);
  const processingRef = useRef(false);
  const loadingTaskRef = useRef(null);
  const renderTaskRef = useRef(null);
  const generatedFilesRef = useRef(null);
  const generatedFormatRef = useRef(null);
  const zipUrlRef = useRef('');

  const clearZip = useCallback(() => {
    if (zipUrlRef.current) URL.revokeObjectURL(zipUrlRef.current);
    zipUrlRef.current = '';
    setZipUrl('');
    setZipName('');
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

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (isProcessing || isValidating) return;
    setError('');
    setProgress('');
    clearZip();
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
    setIsValidating(true);
    try {
      const pdf = await validateUnencryptedPdf(selectedFile);
      const count = pdf.getPageCount();
      if (count < 1) throw new Error('This PDF does not contain any pages.');
      if (count > MAX_PAGES) {
        throw new Error(`This PDF has ${count} pages. Choose a PDF with no more than ${MAX_PAGES} pages.`);
      }
      if (validationRef.current !== validationRun) return;
      setFile(selectedFile);
      setPageCount(count);
    } catch (validationError) {
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
  }, [clearZip, isProcessing, isValidating]);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxFiles: 1,
    disabled: isValidating || isProcessing
  });

  const createArchive = async (images, selectedFormat, baseName, runId) => {
    const imageLabel = images.length === 1 ? 'image' : 'images';
    setProgress(`Creating ZIP: 0 of ${images.length} ${imageLabel}`);
    const blob = await createZipBlob(images, (processed, total) => {
      if (generationRef.current === runId) {
        setProgress(`Creating ZIP: ${processed} of ${total} ${imageLabel}`);
      }
    }, () => generationRef.current !== runId);
    if (generationRef.current !== runId) return;

    const url = URL.createObjectURL(blob);
    clearZip();
    zipUrlRef.current = url;
    setZipUrl(url);
    setZipName(`${baseName}-images-${selectedFormat.extension}.zip`);
    generatedFilesRef.current = null;
    generatedFormatRef.current = null;
    setProgress(`ZIP ready with ${images.length} ${imageLabel}.`);
  };

  const convert = async () => {
    if (processingRef.current) return;
    if (!file || pageCount < 1) {
      setError('Choose a valid PDF before converting.');
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
    clearZip();
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
      for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
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

        try {
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          const renderTask = page.render({ canvasContext: context, viewport, intent: 'print' });
          renderTaskRef.current = renderTask;
          await renderTask.promise;
          renderTaskRef.current = null;
          if (generationRef.current !== runId) return;

          let bytes;
          if (format === 'bmp') {
            bytes = encodeBmp(context.getImageData(0, 0, canvas.width, canvas.height));
          } else {
            const blob = await canvasToBlob(
              canvas,
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
          canvas.width = 0;
          canvas.height = 0;
          page.cleanup();
        }
      }

      if (generationRef.current !== runId) return;
      generatedFilesRef.current = imageFiles;
      generatedFormatRef.current = selectedFormat;
      await createArchive(imageFiles, selectedFormat, getBaseName(file.name), runId);
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

  const retryZip = async () => {
    const images = generatedFilesRef.current;
    const selectedFormat = generatedFormatRef.current;
    if (processingRef.current || !images?.length || !selectedFormat) return;

    const runId = ++generationRef.current;
    processingRef.current = true;
    setIsProcessing(true);
    setError('');
    try {
      await createArchive(images, selectedFormat, getBaseName(file?.name || 'document.pdf'), runId);
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
    processingRef.current = false;
    generatedFilesRef.current = null;
    generatedFormatRef.current = null;
    clearZip();
    setFile(null);
    setPageCount(0);
    setFormat('png');
    setQuality('standard');
    setJpegQuality(0.85);
    setIsValidating(false);
    setIsProcessing(false);
    setProgress('');
    setError('');
  };

  useEffect(() => () => {
    generationRef.current += 1;
    renderTaskRef.current?.cancel();
    renderTaskRef.current = null;
    const loadingTask = loadingTaskRef.current;
    loadingTaskRef.current = null;
    if (loadingTask) {
      void loadingTask.destroy().catch((destroyError) => {
        console.error('Unable to release the PDF rendering task:', destroyError);
      });
    }
    if (zipUrlRef.current) URL.revokeObjectURL(zipUrlRef.current);
  }, []);

  return (
    <div className="pdf-tool-workflow pdf-to-images-workflow mx-auto max-w-4xl space-y-6">
      <input {...getInputProps()} aria-label="Choose a PDF to convert to images" />
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
            <p>Convert PDF pages to PNG, JPG, or BMP images in a ZIP file.</p>
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

      {file && (
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
      )}

      {file && (
      <section className="pdf-workflow-controls space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <fieldset disabled={!file || isValidating || isProcessing}>
          <legend className="mb-3 text-lg font-bold text-slate-800">Output format</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {FORMATS.map((item) => (
              <label
                key={item.id}
                className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                  format === item.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
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
                      clearZip();
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
            <label className={`cursor-pointer rounded-xl border p-4 ${quality === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
              <span className="flex items-center gap-2 font-semibold text-slate-800">
                <input
                  type="radio"
                  name="pdf-image-quality"
                  value="standard"
                  checked={quality === 'standard'}
                  onChange={() => {
                    setQuality('standard');
                    clearZip();
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
            <label className={`cursor-pointer rounded-xl border p-4 ${quality === 'high' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
              <span className="flex items-center gap-2 font-semibold text-slate-800">
                <input
                  type="radio"
                  name="pdf-image-quality"
                  value="high"
                  checked={quality === 'high'}
                  onChange={() => {
                    setQuality('high');
                    clearZip();
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
          <div className="space-y-2">
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
                clearZip();
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
        <div className="pdf-workflow-actions flex flex-wrap gap-3">
          <button
            type="button"
            onClick={convert}
            disabled={isValidating || isProcessing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <FileImage className="h-5 w-5" aria-hidden="true" />}
            Convert PDF to Images
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
          <button
            type="button"
            onClick={reset}
            disabled={isProcessing || isValidating}
            className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Reset
          </button>
        </div>
      )}

      {progress && <p className="flex items-center gap-2 text-sm text-blue-700" role="status" aria-live="polite">
        {isProcessing && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {progress}
      </p>}
      {error && <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <span>{error}</span>
      </p>}
      {error && generatedFilesRef.current?.length > 0 && !isProcessing && (
        <button
          type="button"
          onClick={retryZip}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 font-semibold text-blue-700 transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Retry ZIP creation
        </button>
      )}
      {zipUrl && (
        <section className="flex flex-col gap-3 rounded-2xl border border-green-200 bg-green-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 font-semibold text-green-800" role="status">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            {pageCount} {pageCount === 1 ? 'image is' : 'images are'} ready in page order.
          </p>
          <a
            href={zipUrl}
            download={zipName}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            <Download className="h-5 w-5" aria-hidden="true" />
            Download ZIP
          </a>
        </section>
      )}
    </div>
  );
};

export default PdfToImages;
