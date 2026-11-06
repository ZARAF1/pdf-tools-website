import React, { useState, useCallback } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import pdfjsLib from '../lib/pdfjsClient';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import { createWorker } from 'tesseract.js';
import { motion } from 'framer-motion';
import {
  Upload,
  Loader2,
  AlertCircle,
  Download,
  FileText,
  Info,
  ArrowLeftRight
} from 'lucide-react';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';
import DownloadReadyCard from './DownloadReadyCard';
import { createPdfFromRenderedPages, validateDocxFile } from '../lib/docxToPdf.mjs';
import { normalizeOutputFileName } from '../lib/outputFileName.mjs';
import { useLanguage } from '../i18n/useLanguage';
import { getLocalizedToolUi } from '../i18n/toolUiLocalization.mjs';

const OCR_NOTICE =
  'No readable text was found in this PDF. It may be blank or too low quality to recognize.';

const getDefaultOutputFileName = (file, direction) => (
  direction === 'pdf-to-word'
    ? 'document_converted.docx'
    : `${file.name.replace(/\.docx$/i, '')}_converted.pdf`
);

const groupItemsIntoLines = (items) => {
  const rows = [];
  items
    .filter((item) => item.text.trim())
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .forEach((item) => {
      let row = rows[rows.length - 1];
      if (!row || Math.abs(item.y - row.y) > Math.max(3, Math.min(item.height, row.height) * 0.5)) {
        row = { y: item.y, height: item.height, items: [] };
        rows.push(row);
      }
      row.items.push(item);
    });

  return rows.map((row) => {
    const cells = [];
    row.items.sort((a, b) => a.x - b.x).forEach((item) => {
      const previousCell = cells[cells.length - 1];
      const gap = previousCell ? item.x - (previousCell.x + previousCell.width) : 0;
      if (previousCell && gap <= Math.max(18, item.height * 2.5)) {
        if (gap > 1 && !/\s$/.test(previousCell.text) && !/^\s/.test(item.text)) {
          previousCell.text += ' ';
        }
        previousCell.text += item.text;
        previousCell.width = Math.max(
          previousCell.width,
          item.x + item.width - previousCell.x
        );
      } else {
        cells.push({ text: item.text, x: item.x, width: item.width });
      }
    });
    const visibleCells = cells.filter((cell) => cell.text.trim());
    return {
      cells: visibleCells,
      text: visibleCells.map((cell) => cell.text.trim()).join('\t'),
      fontSize: row.items.reduce((largest, item) => Math.max(largest, item.fontSize), 0)
    };
  }).filter((line) => line.text);
};

const PdfToWord = () => {
  const { translate, language } = useLanguage();
  const [direction, setDirection] = useState('pdf-to-word');
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [outputBlob, setOutputBlob] = useState(null);
  const [outputFileName, setOutputFileName] = useState('');
  const markOutputDownloaded = useToolExitGuard(Boolean(file), outputBlob);

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    setError(null);
    setSuccess(false);
    setOutputBlob(null);
    setOutputFileName('');

    if (fileRejections.length > 0) {
      setError(direction === 'pdf-to-word'
        ? 'Please choose a valid PDF file.'
        : 'Please choose a valid Word .docx file. Legacy .doc files are not supported.');
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    try {
      if (direction === 'pdf-to-word') {
        await validateUnencryptedPdf(selectedFile);
      } else {
        validateDocxFile(selectedFile);
      }
      setFile(selectedFile);
      setOutputFileName(getDefaultOutputFileName(selectedFile, direction));
      setProgress(0);
      setStatus('');
    } catch (validationError) {
      console.error('Unable to validate file for conversion:', validationError);
      setError(validationError.message || 'This file is invalid or could not be opened.');
    }
  }, [direction]);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: direction === 'pdf-to-word'
      ? { 'application/pdf': ['.pdf'] }
      : { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    multiple: false
  });

  const removeFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setOutputBlob(null);
    setOutputFileName('');
    setProgress(0);
    setStatus('');
  };

  const changeDirection = (nextDirection) => {
    if (nextDirection === direction) return;
    setDirection(nextDirection);
    removeFile();
  };

  const extractTextFromPdf = async (arrayBuffer, onProgress, onStatus) => {
    const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = [];
    let ocrWorker = null;
    let currentPage = 1;
    const pageSpan = 90 / doc.numPages;

    try {
      for (let p = 1; p <= doc.numPages; p++) {
        currentPage = p;
        const page = await doc.getPage(p);
        const content = await page.getTextContent();
        let lines = groupItemsIntoLines(content.items
          .filter((item) => typeof item.str === 'string' && item.str.trim())
          .map((item) => {
            const [, , scaleX, scaleY, x, y] = item.transform;
            const fontSize = Math.hypot(scaleX, scaleY) || 12;
            return {
              text: item.str,
              x,
              y: -y,
              width: item.width,
              height: fontSize,
              fontSize
            };
          }));
        const pageWidth = page.getViewport({ scale: 1 }).width;

        if (lines.map((line) => line.text).join('').replace(/\s/g, '').length < 3) {
          onStatus(`Recognizing scanned page ${p} of ${doc.numPages}...`);
          if (!ocrWorker) {
            ocrWorker = await createWorker('eng', 1, {
              workerPath: '/ocr-assets/worker.min.js',
              corePath: '/ocr-assets',
              langPath: '/ocr-assets/lang',
              logger: (message) => {
                if (message.status === 'loading language traineddata') {
                  onStatus('Loading English OCR data...');
                } else if (message.status === 'recognizing text') {
                  onStatus(`Recognizing scanned page ${currentPage} of ${doc.numPages}...`);
                  const pageStart = (currentPage - 1) * pageSpan;
                  onProgress(Math.round(pageStart + pageSpan * (0.2 + message.progress * 0.7)));
                }
              }
            });
          }

          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const context = canvas.getContext('2d', { willReadFrequently: true });
          if (!context) {
            throw new Error('Your browser could not prepare this page for OCR.');
          }

          try {
            onStatus(`Rendering scanned page ${p} of ${doc.numPages}...`);
            await page.render({ canvasContext: context, canvas, viewport, intent: 'print' }).promise;
            const { data } = await ocrWorker.recognize(canvas, {}, { blocks: true });
            const words = (data.blocks || []).flatMap((block) =>
              block.paragraphs.flatMap((paragraph) =>
                paragraph.lines.flatMap((line) => line.words)
              )
            );
            lines = words.length > 0
              ? groupItemsIntoLines(words.map((word) => ({
              text: word.text,
              x: word.bbox.x0 / 2,
              y: (word.bbox.y0 + word.bbox.y1) / 4,
              width: (word.bbox.x1 - word.bbox.x0) / 2,
              height: (word.bbox.y1 - word.bbox.y0) / 2,
              fontSize: (word.bbox.y1 - word.bbox.y0) / 2
              })))
              : data.text.split(/\r?\n/).filter((text) => text.trim()).map((text) => ({
                text: text.trim(),
                cells: [{ text: text.trim(), x: 0, width: 0 }],
                fontSize: 0
              }));
          } finally {
            canvas.width = 0;
            canvas.height = 0;
          }
        }

        pages.push({ lines, width: pageWidth });
        onProgress(Math.round((p / doc.numPages) * 90));
        page.cleanup();
      }
    } finally {
      try {
        if (ocrWorker) await ocrWorker.terminate();
      } finally {
        await doc.destroy();
      }
    }

    return pages;
  };

  const buildDocx = async (pages) => {
    const children = [];
    let hasContent = false;
    pages.forEach(({ lines, width }) => {
      if (lines.length === 0) return;
      if (hasContent) children.push(new Paragraph({ pageBreakBefore: true }));

      const sizes = lines.map((line) => line.fontSize).filter((size) => size > 0).sort((a, b) => a - b);
      const typicalFontSize = sizes[Math.floor(sizes.length / 2)] || 11;
      const makeParagraph = (line) => {
        const isHeading = line.fontSize >= typicalFontSize * 1.35 && line.text.length < 120;
        return new Paragraph({
          children: [new TextRun({
            text: line.text.replace(/\t/g, '    '),
            bold: isHeading,
            ...(line.fontSize ? { size: Math.min(Math.round(line.fontSize * 2), 48) } : {})
          })]
        });
      };

      for (let index = 0; index < lines.length;) {
        const first = lines[index];
        const tableLines = [first];
        const tolerance = Math.max(18, width * 0.025);
        while (index + tableLines.length < lines.length) {
          const next = lines[index + tableLines.length];
          const previous = tableLines[tableLines.length - 1];
          const columnsAlign = next.cells.length === previous.cells.length &&
            next.cells.length > 1 &&
            next.cells.every((cell, cellIndex) =>
              Math.abs(cell.x - previous.cells[cellIndex].x) <= tolerance
            );
          if (!columnsAlign) break;
          tableLines.push(next);
        }

        if (tableLines.length > 1 && first.cells.length > 1) {
          children.push(new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableLines.map((line) => new TableRow({
              children: line.cells.map((cell) => new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: cell.text.trim() })] })]
              }))
            }))
          }));
          index += tableLines.length;
        } else {
          children.push(makeParagraph(first));
          index += 1;
        }
      }
      hasContent = true;
    });

    if (!hasContent) {
      // No extractable text at all — signal the no-OCR case rather than a fake success.
      throw new Error(OCR_NOTICE);
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children
        }
      ]
    });

    return Packer.toBlob(doc);
  };

  const convertWordToPdf = async (arrayBuffer) => {
    const renderContainer = document.createElement('div');
    const styleContainer = document.createElement('div');
    renderContainer.style.position = 'fixed';
    renderContainer.style.left = '-100000px';
    renderContainer.style.top = '0';
    renderContainer.style.zIndex = '-1';
    document.body.append(styleContainer, renderContainer);

    try {
      setStatus('Loading Word page renderer...');
      setProgress(5);
      const [{ renderAsync }, { default: html2canvas }] = await Promise.all([
        import('docx-preview'),
        import('html2canvas')
      ]);
      await renderAsync(arrayBuffer, renderContainer, styleContainer, {
        inWrapper: true,
        useBase64URL: true,
        ignoreLastRenderedPageBreak: false
      });
      await document.fonts?.ready;

      const pageElements = [...renderContainer.querySelectorAll('section.docx')];
      if (!pageElements.length) {
        throw new Error('No pages could be rendered from this Word document.');
      }

      const renderedPages = [];
      for (let index = 0; index < pageElements.length; index += 1) {
        const pageElement = pageElements[index];
        setStatus(`Rendering Word page ${index + 1} of ${pageElements.length}...`);
        const bounds = pageElement.getBoundingClientRect();
        const canvas = await html2canvas(pageElement, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          useCORS: false
        });
        const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (!imageBlob) {
          throw new Error(`Word page ${index + 1} could not be captured as an image.`);
        }
        renderedPages.push({
          pngBytes: new Uint8Array(await imageBlob.arrayBuffer()),
          pageWidth: bounds.width * 0.75,
          pageHeight: bounds.height * 0.75
        });
        canvas.width = 0;
        canvas.height = 0;
        setProgress(5 + Math.round(((index + 1) / pageElements.length) * 90));
      }

      setStatus('Building PDF...');
      return await createPdfFromRenderedPages(renderedPages);
    } finally {
      renderContainer.remove();
      styleContainer.remove();
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError(direction === 'pdf-to-word'
        ? 'Please upload a PDF file first.'
        : 'Please upload a Word .docx file first.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setOutputBlob(null);
    setProgress(0);
    setStatus(direction === 'pdf-to-word' ? 'Reading PDF pages...' : 'Preparing Word document...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      let result;
      if (direction === 'pdf-to-word') {
        const pages = await extractTextFromPdf(arrayBuffer, setProgress, setStatus);
        setStatus('Building Word document...');
        setProgress(95);
        result = await buildDocx(pages);
      } else {
        const pdfBytes = await convertWordToPdf(arrayBuffer);
        result = new Blob([pdfBytes], { type: 'application/pdf' });
      }
      const outputName = normalizeOutputFileName(
        outputFileName,
        getDefaultOutputFileName(file, direction)
      );
      setOutputBlob(result);
      setOutputFileName(outputName);
      setProgress(100);
      setSuccess(true);
      setStatus('');
    } catch (err) {
      console.error(err);
      if (err?.message === OCR_NOTICE) {
        setError(err.message);
      } else if (direction === 'word-to-pdf') {
        setError(err.message || 'This Word document could not be rendered. Check that it is an unprotected .docx file and try again.');
      } else {
        setError(err.message || 'This PDF could not be converted. Check your connection for the OCR language download and try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadWordDocument = (downloadFileName) => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFileName || outputFileName;
    link.click();
    markOutputDownloaded();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="word-conversion-workspace">
      <input {...getInputProps()} className="sr-only" />

      <div className="image-pdf-direction-switch conversion-direction-switch" role="group" aria-label="Choose conversion direction">
        <button
          type="button"
          disabled={isProcessing}
          aria-pressed={direction === 'pdf-to-word'}
          onClick={() => changeDirection('pdf-to-word')}
          className="conversion-direction-option disabled:cursor-not-allowed disabled:opacity-50"
        >
          PDF to Word
        </button>
        <button
          type="button"
          disabled={isProcessing}
          aria-pressed={direction === 'word-to-pdf'}
          onClick={() => changeDirection('word-to-pdf')}
          className="conversion-direction-option disabled:cursor-not-allowed disabled:opacity-50"
        >
          Word to PDF
        </button>
      </div>

      <div className="word-file-workspace">
        <section className="tool-attachment-section conversion-attachment-shell word-attachment-section" aria-labelledby="word-attachment-heading">
          <div className="tool-attachment-heading">
            <span className="tool-attachment-icon" aria-hidden="true">
              <Upload className="h-5 w-5" />
            </span>
            <div>
              <h2 id="word-attachment-heading">
                {direction === 'pdf-to-word' ? translate('attachPdfHere') : translate('attachWordFileHere')}
              </h2>
              <p>{direction === 'pdf-to-word' ? 'One unencrypted PDF · no fixed page cap' : 'One unprotected .docx file'}</p>
            </div>
          </div>
          <aside className="tool-attachment-guidance" aria-labelledby="word-attachment-guidance-heading">
            <h3 id="word-attachment-guidance-heading">{direction === 'pdf-to-word' ? 'PDF to Word' : 'Word to PDF'}</h3>
            <p>
              {direction === 'pdf-to-word'
                ? 'Convert text-based PDFs into editable Word documents. Scanned pages use English OCR in your browser and may need internet to load OCR data; simple tables may convert, while complex layouts may need cleanup.'
                : 'Convert a .docx file to an image-based PDF. The output text is not searchable or selectable.'}
            </p>
          </aside>
          <div className="tool-attachment-content">
            <section className="word-file-panel" aria-label="File to convert">
          {!file ? (
            <div
              {...getRootProps({
                role: 'group',
                'aria-label': direction === 'pdf-to-word'
                  ? 'Choose a PDF to convert to Word'
                  : 'Choose a Word DOCX file to convert to PDF'
              })}
              className={`pdf-workflow-upload merge-pdf-upload-zone cursor-pointer transition-all
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
              `}
            >
              <div className="merge-pdf-upload-content">
                <div className="pdf-upload-icon" aria-hidden="true">
                  {direction === 'pdf-to-word'
                    ? <Upload className="h-6 w-6 text-blue-600" />
                    : <ArrowLeftRight className="h-6 w-6 text-blue-600" />}
                </div>
                <div className="merge-pdf-upload-copy">
                  <h3>
                    {isDragActive
                      ? direction === 'pdf-to-word' ? 'Drop the PDF here' : 'Drop the DOCX file here'
                      : direction === 'pdf-to-word'
                        ? 'Choose or drop a PDF to convert to Word'
                        : 'Choose or drop a Word .docx file to convert to PDF'}
                  </h3>
                </div>
                <button
                  type="button"
                  className="pdf-editor-primary-button merge-pdf-upload-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    open();
                  }}
                >
                  {direction === 'pdf-to-word' ? 'Choose PDF' : 'Choose Word file'}
                </button>
              </div>
            </div>
          ) : (
            <section className="conversion-selected-file-section word-selected-file-section" aria-labelledby="word-selected-file-heading">
              <header>
                <div className="merge-panel-title">
                  <FileText aria-hidden="true" />
                  <h3 id="word-selected-file-heading" className="merge-selected-files-title">
                    {direction === 'pdf-to-word' ? 'PDF to convert' : 'Word file to convert'}
                  </h3>
                </div>
                <p>
                  {direction === 'pdf-to-word'
                    ? 'One PDF selected. Replace it or remove it to choose another.'
                    : 'One Word file selected. Replace it or remove it to choose another.'}
                </p>
              </header>
              <div className="pdf-attached-file-card word-attached-file-card">
                <div className="word-attached-file-main">
                  <AttachedFileIcon />
                  <div className="word-attached-file-details">
                    <p className="word-attached-file-name" title={file.name}>{file.name}</p>
                    <p className="word-attached-file-meta">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <AttachedFileActions
                  fileName={file.name}
                  onReplace={open}
                  onRemove={removeFile}
                  disabled={isProcessing}
                />
              </div>
              <div className="word-conversion-actions">
                <label className="word-output-filename" htmlFor="word-output-filename">
                  <span>{getLocalizedToolUi(language).fileActions.outputFilename}</span>
                  <input
                    id="word-output-filename"
                    type="text"
                    value={outputFileName}
                    onChange={(event) => setOutputFileName(event.target.value)}
                    aria-label={getLocalizedToolUi(language).fileActions.outputFilename}
                    disabled={isProcessing}
                  />
                </label>
                <button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className={`
                    pdf-conversion-action-button flex items-center justify-center gap-2 rounded-xl font-bold text-white transition-all
                    ${isProcessing ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98]'}
                  `}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      {direction === 'pdf-to-word' ? 'Convert to Word' : 'Convert to PDF'}
                    </>
                  )}
                </button>
              </div>
            </section>
          )}
            </section>
          </div>
          {file && (
            <div className="word-conversion-panel p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span role="status" aria-atomic="true">{status || 'Converting document...'}</span>
                    <span>{progress}%</span>
                  </div>
                  <div
                    className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-label={`${direction === 'pdf-to-word' ? 'PDF to Word' : 'Word to PDF'} conversion progress`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                  >
                    <div
                      className="h-full bg-blue-600 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {direction === 'word-to-pdf' && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">DOCX only · image-based PDF output</p>
                    <p className="text-amber-700 text-xs mt-1">
                      Pages are rendered in this browser and saved as images in the PDF, so text cannot be searched or selected. Layout may differ from Word; legacy .doc files are not supported.
                    </p>
                  </div>
                </div>
              )}

              {success && outputBlob && (
                <DownloadReadyCard
                  fileName={outputFileName}
                  sizeBytes={outputBlob.size}
                  onDownload={downloadWordDocument}
                  downloadLabel={direction === 'pdf-to-word' ? 'Download Word file' : 'Download PDF'}
                  showFilenameEditor={false}
                />
              )}
            </div>
          )}
        </section>
      </div>

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

    </div>
  );
};

export default PdfToWord;
