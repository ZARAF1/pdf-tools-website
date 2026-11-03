import React, { useCallback, useState } from 'react';
import { AlertCircle, Download, Loader2, Upload } from 'lucide-react';
import { useToolExitGuard } from './ToolExitGuard';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';
import DownloadReadyCard from './DownloadReadyCard';
import { useLanguage } from '../i18n/useLanguage';
import { getLocalizedToolUi } from '../i18n/toolUiLocalization.mjs';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import pdfjsLib from '../lib/pdfjsClient';
import { validateUnencryptedPdf } from '../lib/pdfValidation.js';
import {
  createPdfFromRenderedSlides,
  createPowerPointFromRenderedPages,
  parsePageSelection,
  sanitizeOutputFileName,
  validatePowerPointFile
} from '../lib/powerpointConversion.mjs';

const RENDER_QUALITY = {
  standard: { width: 1280, jpegQuality: 0.86 },
  high: { width: 1920, jpegQuality: 0.95 }
};

const getFileBaseName = (fileName) => fileName.replace(/\.(?:pdf|pptx)$/i, '');

const PdfPowerPoint = () => {
  const { language, translate } = useLanguage();
  const powerpointUi = getLocalizedToolUi(language).powerpoint;
  const [direction, setDirection] = useState('pdf-to-pptx');
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageSelection, setPageSelection] = useState('');
  const [outputName, setOutputName] = useState('converted_presentation');
  const [quality, setQuality] = useState('standard');
  const [slideSize, setSlideSize] = useState('original');
  const [pdfPageSize, setPdfPageSize] = useState('match');
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [outputBlob, setOutputBlob] = useState(null);
  const [outputFileName, setOutputFileName] = useState('');
  const markOutputDownloaded = useToolExitGuard(Boolean(file), outputBlob);

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    setError('');
    setOutputBlob(null);
    setOutputFileName('');
    if (fileRejections.length > 0) {
      setError(direction === 'pdf-to-pptx'
        ? 'Please choose a valid, unencrypted PDF file.'
        : 'Please choose a valid PowerPoint .pptx file. Legacy .ppt files are not supported.');
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setIsLoadingFile(true);
    setStatus(powerpointUi.converting);
    try {
      let totalPages;
      if (direction === 'pdf-to-pptx') {
        const pdf = await validateUnencryptedPdf(selectedFile);
        totalPages = pdf.getPageCount();
      } else {
        validatePowerPointFile(selectedFile);
        const { default: PptxRenderer } = await import('pptx-browser');
        const renderer = new PptxRenderer();
        try {
          await renderer.load(await selectedFile.arrayBuffer());
          totalPages = renderer.slideCount;
        } finally {
          renderer.destroy();
        }
      }

      if (!Number.isInteger(totalPages) || totalPages < 1) {
        throw new Error('No pages or slides were found in this file.');
      }
      setFile(selectedFile);
      setPageCount(totalPages);
      setPageSelection('');
      setOutputName(getFileBaseName(selectedFile.name));
      setProgress(0);
      setStatus('');
    } catch (validationError) {
      console.error('Unable to validate the selected conversion file:', validationError);
      setError(validationError.message || 'This file is invalid or could not be opened.');
    } finally {
      setIsLoadingFile(false);
    }
  }, [direction]);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: direction === 'pdf-to-pptx'
      ? { 'application/pdf': ['.pdf'] }
      : { 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'] },
    multiple: false,
    disabled: isLoadingFile || isProcessing
  });

  const resetFile = () => {
    setFile(null);
    setPageCount(0);
    setPageSelection('');
    setError('');
    setProgress(0);
    setStatus('');
    setOutputBlob(null);
    setOutputFileName('');
  };

  const changeDirection = (nextDirection) => {
    if (nextDirection === direction || isLoadingFile || isProcessing) return;
    resetFile();
    setDirection(nextDirection);
  };

  const renderPdfPages = async (pdfFile, indexes, onProgress) => {
    const pdf = await pdfjsLib.getDocument({ data: await pdfFile.arrayBuffer() }).promise;
    const renderedPages = [];
    const { width, jpegQuality } = RENDER_QUALITY[quality];

    try {
      for (let index = 0; index < indexes.length; index += 1) {
        const pageNumber = indexes[index] + 1;
        onProgress(
          Math.round((index / indexes.length) * 90),
          powerpointUi.renderingPage.replace('{current}', String(pageNumber)).replace('{total}', String(pdf.numPages))
        );
        const page = await pdf.getPage(pageNumber);
        const baseViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: width / baseViewport.width });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) {
          throw new Error('Your browser could not prepare a PDF page for rendering.');
        }

        await page.render({
          canvasContext: context,
          canvas,
          viewport,
          intent: 'print',
          background: 'rgb(255, 255, 255)'
        }).promise;
        renderedPages.push({
          imageData: canvas.toDataURL('image/jpeg', jpegQuality),
          width: canvas.width,
          height: canvas.height
        });
        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();
      }
    } finally {
      await pdf.destroy();
    }

    return renderedPages;
  };

  const renderPowerPointSlides = async (presentationFile, indexes, onProgress) => {
    const { default: PptxRenderer } = await import('pptx-browser');
    const renderer = new PptxRenderer();
    const renderedSlides = [];
    const { width, jpegQuality } = RENDER_QUALITY[quality];

    try {
      await renderer.load(await presentationFile.arrayBuffer());
      const slideWidthInches = renderer.slideSize.cx / 914400;
      const slideHeightInches = renderer.slideSize.cy / 914400;
      for (let index = 0; index < indexes.length; index += 1) {
        const slideIndex = indexes[index];
        onProgress(
          Math.round((index / indexes.length) * 90),
          powerpointUi.renderingSlide
            .replace('{current}', String(slideIndex + 1))
            .replace('{total}', String(renderer.slideCount))
        );

        const canvas = document.createElement('canvas');
        await renderer.renderSlide(slideIndex, canvas, width);
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Your browser could not prepare a PowerPoint slide for rendering.');
        }
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-over';
        renderedSlides.push({
          imageData: canvas.toDataURL('image/jpeg', jpegQuality),
          width: canvas.width,
          height: canvas.height,
          slideWidthInches,
          slideHeightInches
        });
        canvas.width = 0;
        canvas.height = 0;
      }
    } finally {
      renderer.destroy();
    }

    return renderedSlides;
  };

  const handleConvert = async () => {
    if (!file || isProcessing || isLoadingFile) return;
    setIsProcessing(true);
    setError('');
    setOutputBlob(null);
    setOutputFileName('');
    setProgress(0);

    try {
      const selectedPages = parsePageSelection(pageSelection, pageCount);
      const updateProgress = (value, message) => {
        setProgress(value);
        setStatus(message);
      };
      const isPdfToPowerPoint = direction === 'pdf-to-pptx';
      const extension = isPdfToPowerPoint ? 'pptx' : 'pdf';
      const safeOutputFileName = sanitizeOutputFileName(outputName, extension);

      if (isPdfToPowerPoint) {
        const pages = await renderPdfPages(file, selectedPages, updateProgress);
        updateProgress(94, powerpointUi.converting);
        const result = await createPowerPointFromRenderedPages(pages, {
          slideSize,
          outputType: 'blob'
        });
        setOutputBlob(new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        }));
      } else {
        const slides = await renderPowerPointSlides(file, selectedPages, updateProgress);
        updateProgress(94, powerpointUi.converting);
        const result = await createPdfFromRenderedSlides(slides, { pageSize: pdfPageSize });
        setOutputBlob(new Blob([result], { type: 'application/pdf' }));
      }

      setOutputFileName(safeOutputFileName);
      setProgress(100);
      setStatus(powerpointUi.convert);
    } catch (conversionError) {
      console.error('Unable to convert PDF or PowerPoint:', conversionError);
      setError(conversionError.message || 'The file could not be converted.');
      setStatus('');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadOutput = (downloadFileName) => {
    if (!outputBlob || !outputFileName) return;
    const url = URL.createObjectURL(outputBlob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = downloadFileName || outputFileName;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    markOutputDownloaded();
  };

  const isPdfToPowerPoint = direction === 'pdf-to-pptx';
  const outputExtension = isPdfToPowerPoint ? '.pptx' : '.pdf';
  const countLabel = isPdfToPowerPoint
    ? powerpointUi.countPages.replace('{count}', String(pageCount))
    : powerpointUi.countSlides.replace('{count}', String(pageCount));

  return (
    <div className="powerpoint-workspace">
      <input {...getInputProps()} className="sr-only" />
      <div className="image-pdf-direction-switch conversion-direction-switch" role="group" aria-label="Choose conversion direction">
        <button
          type="button"
          disabled={isLoadingFile || isProcessing}
          aria-pressed={isPdfToPowerPoint}
          onClick={() => changeDirection('pdf-to-pptx')}
          className="conversion-direction-option disabled:cursor-not-allowed disabled:opacity-50"
        >
          {powerpointUi.directionPdfToPptx}
        </button>
        <button
          type="button"
          disabled={isLoadingFile || isProcessing}
          aria-pressed={!isPdfToPowerPoint}
          onClick={() => changeDirection('pptx-to-pdf')}
          className="conversion-direction-option disabled:cursor-not-allowed disabled:opacity-50"
        >
          {powerpointUi.directionPptxToPdf}
        </button>
      </div>

      <section className="tool-attachment-section conversion-attachment-shell powerpoint-attachment-shell" aria-labelledby="powerpoint-attachment-heading">
        <div className="tool-attachment-heading">
          <span className="tool-attachment-icon" aria-hidden="true">
            <Upload className="h-5 w-5" />
          </span>
          <div>
            <h2 id="powerpoint-attachment-heading">
              {isPdfToPowerPoint ? 'Attach PDF Here' : 'Attach PowerPoint Here'}
            </h2>
            <p>
              {isPdfToPowerPoint
                ? 'One unencrypted PDF · page count depends on available browser memory'
                : 'One .pptx file · slide count depends on available browser memory'}
            </p>
          </div>
        </div>
        <aside className="tool-attachment-guidance" aria-labelledby="powerpoint-attachment-guidance-heading">
          <h3 id="powerpoint-attachment-guidance-heading">
            {isPdfToPowerPoint ? powerpointUi.directionPdfToPptx : powerpointUi.directionPptxToPdf}
          </h3>
          <p>{powerpointUi.imageBasedWarning}</p>
          {!isPdfToPowerPoint && (
            <>
              <p>{powerpointUi.fontNetworkWarning}</p>
              <p>{powerpointUi.fontNameDisclosure}</p>
            </>
          )}
        </aside>
        <div className="tool-attachment-content">
          <section className="powerpoint-attachment-panel" aria-label="File to convert">

      {!file ? (
        <div
          {...getRootProps({
            role: 'group',
            'aria-label': isPdfToPowerPoint
              ? powerpointUi.uploadPdfPrompt
              : powerpointUi.uploadPptxPrompt
          })}
          className={`pdf-workflow-upload merge-pdf-upload-zone cursor-pointer transition-all ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }`}
        >
          <div className="merge-pdf-upload-content">
            <div className="pdf-upload-icon" aria-hidden="true">
              {isLoadingFile
                ? <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                : <Upload className="h-6 w-6 text-blue-600" />}
            </div>
            <div className="merge-pdf-upload-copy">
              <h3>
                {isLoadingFile
                  ? powerpointUi.converting
                  : isDragActive
                    ? isPdfToPowerPoint ? powerpointUi.dropPdfPrompt : powerpointUi.dropPptxPrompt
                    : isPdfToPowerPoint ? powerpointUi.uploadPdfPrompt : powerpointUi.uploadPptxPrompt}
              </h3>
            </div>
            <button
              type="button"
              disabled={isLoadingFile}
              className="pdf-editor-primary-button merge-pdf-upload-button"
              onClick={(event) => {
                event.stopPropagation();
                open();
              }}
            >
              {isPdfToPowerPoint ? powerpointUi.choosePdf : powerpointUi.choosePptx}
            </button>
          </div>
        </div>
      ) : (
        <div className="pdf-attached-file-card powerpoint-attached-file-card">
          <div className="powerpoint-attached-file-main">
            <AttachedFileIcon />
            <div className="powerpoint-attached-file-details">
              <p className="powerpoint-attached-file-name" title={file.name}>{file.name}</p>
              <p className="powerpoint-attached-file-meta">{countLabel} · {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <AttachedFileActions
            fileName={file.name}
            onReplace={open}
            onRemove={resetFile}
            disabled={isProcessing || isLoadingFile}
          />
        </div>
      )}
          </section>
        </div>
      </section>

      {file && (
        <section className="powerpoint-settings-panel" aria-labelledby="powerpoint-settings-heading">
          <header className="conversion-panel-header">
            <h3 id="powerpoint-settings-heading" className="merge-selected-files-title">Settings &gt; Selection &gt; Preview</h3>
            <p>Choose pages or slides, output name, image quality, and page or slide size.</p>
          </header>
          <div className="powerpoint-settings-controls">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">{powerpointUi.pageSelection}</span>
              <input
                type="text"
                value={pageSelection}
                onChange={(event) => setPageSelection(event.target.value)}
                placeholder={powerpointUi.pageSelectionHint}
                disabled={isProcessing}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">{powerpointUi.outputFilename}</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={outputName}
                  onChange={(event) => setOutputName(event.target.value)}
                  disabled={isProcessing}
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <span className="text-sm text-slate-500">{outputExtension}</span>
              </div>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">{powerpointUi.imageQuality}</span>
                <select
                  value={quality}
                  onChange={(event) => setQuality(event.target.value)}
                  disabled={isProcessing}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="standard">{powerpointUi.standardQuality}</option>
                  <option value="high">{powerpointUi.highQuality}</option>
                </select>
              </label>

              {isPdfToPowerPoint ? (
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">{powerpointUi.slideSize}</span>
                  <select
                    value={slideSize}
                    onChange={(event) => setSlideSize(event.target.value)}
                    disabled={isProcessing}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="original">{powerpointUi.matchPdfPages}</option>
                    <option value="wide">{powerpointUi.wideSlides}</option>
                  </select>
                </label>
              ) : (
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">{powerpointUi.pdfPageSize}</span>
                  <select
                    value={pdfPageSize}
                    onChange={(event) => setPdfPageSize(event.target.value)}
                    disabled={isProcessing}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="match">{powerpointUi.matchSlides}</option>
                    <option value="a4">{powerpointUi.a4}</option>
                    <option value="letter">{powerpointUi.letter}</option>
                  </select>
                </label>
              )}
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between gap-3 text-sm text-slate-500">
                  <span role="status" aria-atomic="true">{status || powerpointUi.converting}</span>
                  <span>{progress}%</span>
                </div>
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-label={powerpointUi.converting}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                >
                  <div className="h-full bg-blue-600 transition-all duration-200" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleConvert}
              disabled={isProcessing || isLoadingFile}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold text-white transition-all ${
                isProcessing || isLoadingFile
                  ? 'cursor-not-allowed bg-slate-300'
                  : 'bg-blue-600 shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98]'
              }`}
            >
              {isProcessing
                ? <><Loader2 className="h-5 w-5 animate-spin" />{powerpointUi.converting}</>
                : <><Download className="h-5 w-5" />{powerpointUi.convert}</>}
            </button>
          </div>
        </section>
      )}

      {error && (
        <div role="alert" className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {outputBlob && outputFileName && (
        <DownloadReadyCard
          fileName={outputFileName}
          sizeBytes={outputBlob.size}
          onDownload={downloadOutput}
          downloadLabel={translate('download')}
        />
      )}
    </div>
  );
};

export default PdfPowerPoint;
