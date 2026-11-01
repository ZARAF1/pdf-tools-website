import React, { useState, useCallback } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import { FILE_DOWNLOAD_READY_MESSAGE } from '../lib/toolMessages.mjs';
import pdfjsLib from '../lib/pdfjsClient';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import { createWorker } from 'tesseract.js';
import { motion } from 'framer-motion';
import {
  Upload,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';

const OCR_NOTICE =
  'No readable text was found in this PDF. It may be blank or too low quality to recognize.';

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
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [outputBlob, setOutputBlob] = useState(null);
  const markOutputDownloaded = useToolExitGuard(Boolean(file), outputBlob);

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    setError(null);
    setSuccess(false);
    setOutputBlob(null);

    if (fileRejections.length > 0) {
      setError('Please choose a valid PDF file.');
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    try {
      await validateUnencryptedPdf(selectedFile);
      setFile(selectedFile);
      setProgress(0);
      setStatus('');
    } catch (validationError) {
      console.error('Unable to validate PDF for Word conversion:', validationError);
      setError(validationError.message || 'This PDF is invalid or could not be opened.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const removeFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setOutputBlob(null);
    setProgress(0);
    setStatus('');
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

  const handleConvert = async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setOutputBlob(null);
    setProgress(0);
    setStatus('Reading PDF pages...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pages = await extractTextFromPdf(arrayBuffer, setProgress, setStatus);
      setStatus('Building Word document...');
      setProgress(95);
      const result = await buildDocx(pages);
      setOutputBlob(result);
      setProgress(100);
      setSuccess(true);
      setStatus('');
    } catch (err) {
      console.error(err);
      if (err?.message === OCR_NOTICE) {
        setError(err.message);
      } else {
        setError(err.message || 'This PDF could not be converted. Check your connection for the OCR language download and try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadWordDocument = () => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document_converted.docx';
    link.click();
    markOutputDownloaded();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <input {...getInputProps()} />

      {/* Upload Zone */}
      {!file ? (
        <div
          {...getRootProps({ role: 'group', 'aria-label': 'Choose a PDF to convert to Word' })}
          className={`pdf-workflow-upload merge-pdf-upload-zone cursor-pointer transition-all
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
          `}
        >
          <div className="merge-pdf-upload-content">
            <div className="pdf-upload-icon" aria-hidden="true">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <div className="merge-pdf-upload-copy">
              <h3>{isDragActive ? 'Drop the PDF here' : 'Choose or drop a PDF to convert to Word'}</h3>
              <p>Convert text-based and scanned PDFs into editable Word documents.</p>
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
        <div>
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
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                  <span role="status" aria-atomic="true">{status || 'Converting PDF...'}</span>
                  <span>{progress}%</span>
                </div>
                <div
                  className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-label="PDF to Word conversion progress"
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

            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Best text-based results</p>
                <p className="text-amber-700 text-xs mt-1">
                  Scanned pages use English OCR in your browser. The first scan downloads OCR engine and language data; your PDF stays on this device. Simple aligned rows are reconstructed as Word tables, but complex columns, tables, and forms may need manual cleanup.
                </p>
              </div>
            </div>

            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className={`
                w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white transition-all
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
                  Convert to Word
                </>
              )}
            </button>
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
            <span className="text-sm font-medium">{FILE_DOWNLOAD_READY_MESSAGE}</span>
            <button type="button" onClick={downloadWordDocument} disabled={!outputBlob} className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50">
              <Download className="h-4 w-4" aria-hidden="true" /> Download Word file
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PdfToWord;
