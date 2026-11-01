import React, { useCallback, useRef, useState } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import { motion } from 'framer-motion';
import {
  Upload,
  Loader2,
  AlertCircle,
  Stamp,
  Settings2
} from 'lucide-react';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';
import DownloadReadyCard from './DownloadReadyCard';

const DEFAULT_SETTINGS = {
  watermarkEnabled: true,
  text: '',
  fontSize: 48,
  color: '#64748b',
  rotation: -45,
  opacity: 0.3,
  pageMode: 'all',
  pageRanges: '',
  numberingEnabled: false,
  numberStart: 1,
  numberPlacement: 'bottom',
  numberAlign: 'center',
  numberFontSize: 12,
  numberColor: '#64748b',
  numberMargin: 24,
  numberPageMode: 'all',
  numberPageRanges: ''
};

const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / (1024 ** unitIndex);
  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
};

const parsePageRanges = (input, pageCount) => {
  if (!input.trim()) {
    throw new Error('Enter at least one page number or range, such as 1,3,5-7.');
  }

  const pages = new Set();
  const ranges = input.split(',');

  for (const rawRange of ranges) {
    const range = rawRange.trim();
    if (!range) {
      throw new Error('Page selections cannot contain empty entries.');
    }

    const match = range.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) {
      throw new Error(`Invalid page selection "${range}". Use page numbers and ranges such as 1,3,5-7.`);
    }

    const start = Number(match[1]);
    const end = match[2] === undefined ? start : Number(match[2]);
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 1 || end < 1) {
      throw new Error(`Page numbers in "${range}" must be positive whole numbers.`);
    }
    if (start > end) {
      throw new Error(`The page range "${range}" is reversed. Enter the lower page first.`);
    }
    if (end > pageCount) {
      throw new Error(`Page ${end} is outside this PDF, which has ${pageCount} pages.`);
    }

    for (let page = start; page <= end; page += 1) {
      pages.add(page);
    }
  }

  return [...pages].sort((a, b) => a - b);
};

const getCenteredTextOrigin = (pageWidth, pageHeight, textWidth, textHeight, angle) => {
  const radians = (angle * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const corners = [
    [0, 0],
    [textWidth * cosine, textWidth * sine],
    [-textHeight * sine, textHeight * cosine],
    [textWidth * cosine - textHeight * sine, textWidth * sine + textHeight * cosine]
  ];
  const xs = corners.map(([x]) => x);
  const ys = corners.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const boundsWidth = maxX - minX;
  const boundsHeight = maxY - minY;

  if (boundsWidth > pageWidth || boundsHeight > pageHeight) {
    throw new Error('The watermark text is too large for this page. Reduce its size or shorten the text.');
  }

  return {
    x: (pageWidth - boundsWidth) / 2 - minX,
    y: (pageHeight - boundsHeight) / 2 - minY
  };
};

const downloadBlob = (bytes, filename) => {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};

const PdfWatermarker = () => {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [outputBytes, setOutputBytes] = useState(null);
  const markOutputDownloaded = useToolExitGuard(Boolean(file), outputBytes);
  const fileRequestId = useRef(0);

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      setError('Please choose a valid PDF file.');
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    const requestId = fileRequestId.current + 1;
    fileRequestId.current = requestId;
    setIsLoadingPages(true);
    setOutputBytes(null);
    setSuccess(false);
    setError('');

    try {
      const pdfDoc = await validateUnencryptedPdf(selectedFile);

      const count = pdfDoc.getPageCount();
      if (count < 1) {
        throw new Error('This PDF does not contain any pages.');
      }
      if (fileRequestId.current === requestId) {
        setFile(selectedFile);
        setPageCount(count);
        setIsLoadingPages(false);
      }
    } catch (loadError) {
      console.error('Unable to read PDF for watermarking:', loadError);
      if (fileRequestId.current === requestId) {
        setPageCount(null);
        setIsLoadingPages(false);
        setError(
          loadError?.message?.toLowerCase().includes('encrypt')
            ? 'Password-protected PDFs are not supported. Remove the password and try again.'
            : loadError?.message || 'This PDF is invalid or could not be opened.'
        );
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isProcessing
  });

  const clearResult = () => {
    setError('');
    setSuccess(false);
    setOutputBytes(null);
  };

  const removeFile = () => {
    fileRequestId.current += 1;
    setFile(null);
    setPageCount(null);
    setIsLoadingPages(false);
    clearResult();
  };

  const reset = () => {
    removeFile();
    setSettings({ ...DEFAULT_SETTINGS });
  };

  const updateSettings = (update) => {
    setSettings((current) => ({ ...current, ...update }));
    clearResult();
  };

  const addWatermark = async () => {
    setError('');
    setSuccess(false);
    setOutputBytes(null);

    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }
    if (isLoadingPages || pageCount === null) {
      setError('Wait for the PDF page count to finish loading before adding a watermark.');
      return;
    }

    const text = settings.text.trim();
    if (!settings.watermarkEnabled && !settings.numberingEnabled) {
      setError('Enable a text watermark, page numbering, or both before processing.');
      return;
    }
    if (settings.watermarkEnabled && !text) {
      setError('Enter the text you want to use as a watermark.');
      return;
    }
    if (settings.watermarkEnabled && (!Number.isFinite(settings.fontSize) || settings.fontSize < 8 || settings.fontSize > 96)) {
      setError('Text size must be a number from 8 to 96 points.');
      return;
    }
    if (settings.watermarkEnabled && !/^#[0-9a-f]{6}$/i.test(settings.color)) {
      setError('Choose a valid text colour.');
      return;
    }
    if (settings.watermarkEnabled && (!Number.isFinite(settings.rotation) || settings.rotation < -180 || settings.rotation > 180)) {
      setError('Rotation must be a number between -180 and 180 degrees.');
      return;
    }
    if (settings.watermarkEnabled && (!Number.isFinite(settings.opacity) || settings.opacity < 0 || settings.opacity > 1)) {
      setError('Opacity must be between 0 and 100%.');
      return;
    }

    if (settings.numberingEnabled && (!Number.isSafeInteger(settings.numberStart) || settings.numberStart < 1 || settings.numberStart > 1000000)) {
      setError('Starting page number must be a whole number from 1 to 1,000,000.');
      return;
    }
    if (settings.numberingEnabled && (!Number.isFinite(settings.numberFontSize) || settings.numberFontSize < 6 || settings.numberFontSize > 72)) {
      setError('Page-number text size must be a number from 6 to 72 points.');
      return;
    }
    if (settings.numberingEnabled && !/^#[0-9a-f]{6}$/i.test(settings.numberColor)) {
      setError('Choose a valid page-number colour.');
      return;
    }
    if (settings.numberingEnabled && (!Number.isFinite(settings.numberMargin) || settings.numberMargin < 0 || settings.numberMargin > 1440)) {
      setError('Page-number margin must be between 0 and 1440 points.');
      return;
    }

    let selectedPages = [];
    let numberedPages = [];
    try {
      if (settings.watermarkEnabled) {
        selectedPages = settings.pageMode === 'all'
          ? Array.from({ length: pageCount }, (_, index) => index + 1)
          : parsePageRanges(settings.pageRanges, pageCount);
      }
      if (settings.numberingEnabled) {
        numberedPages = settings.numberPageMode === 'all'
          ? Array.from({ length: pageCount }, (_, index) => index + 1)
          : parsePageRanges(settings.numberPageRanges, pageCount);
      }
    } catch (rangeError) {
      setError(rangeError.message);
      return;
    }

    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: false
      });
      if (pdfDoc.isEncrypted) {
        throw new Error('Password-protected PDFs are not supported. Remove the password and try again.');
      }

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      if (settings.watermarkEnabled) {
        try {
          font.encodeText(text);
        } catch {
          throw new Error('This text contains characters not supported by the built-in font. Try Latin or Western European characters.');
        }

        const red = parseInt(settings.color.slice(1, 3), 16) / 255;
        const green = parseInt(settings.color.slice(3, 5), 16) / 255;
        const blue = parseInt(settings.color.slice(5, 7), 16) / 255;
        const textWidth = font.widthOfTextAtSize(text, settings.fontSize);

        selectedPages.forEach((pageNumber) => {
          const page = pdfDoc.getPage(pageNumber - 1);
          const { width, height } = page.getSize();
          const position = getCenteredTextOrigin(
            width,
            height,
            textWidth,
            settings.fontSize,
            settings.rotation
          );
          page.drawText(text, {
            ...position,
            font,
            size: settings.fontSize,
            color: rgb(red, green, blue),
            rotate: degrees(settings.rotation),
            opacity: settings.opacity
          });
        });
      }

      if (settings.numberingEnabled) {
        const numberRed = parseInt(settings.numberColor.slice(1, 3), 16) / 255;
        const numberGreen = parseInt(settings.numberColor.slice(3, 5), 16) / 255;
        const numberBlue = parseInt(settings.numberColor.slice(5, 7), 16) / 255;
        numberedPages.forEach((pageNumber, sequenceIndex) => {
          const label = String(settings.numberStart + sequenceIndex);
          const page = pdfDoc.getPage(pageNumber - 1);
          const { width, height } = page.getSize();
          const labelWidth = font.widthOfTextAtSize(label, settings.numberFontSize);
          if (settings.numberMargin * 2 + labelWidth > width || settings.numberMargin + settings.numberFontSize > height) {
            throw new Error(`The page-number margin is too large for page ${pageNumber}.`);
          }
          const x = settings.numberAlign === 'left'
            ? settings.numberMargin
            : settings.numberAlign === 'right'
              ? width - settings.numberMargin - labelWidth
              : (width - labelWidth) / 2;
          const y = settings.numberPlacement === 'top'
            ? height - settings.numberMargin - settings.numberFontSize
            : settings.numberMargin;
          page.drawText(label, {
            x,
            y,
            font,
            size: settings.numberFontSize,
            color: rgb(numberRed, numberGreen, numberBlue)
          });
        });
      }

      const watermarkedBytes = await pdfDoc.save({ useObjectStreams: true });
      const verifiedPdf = await PDFDocument.load(watermarkedBytes);
      if (verifiedPdf.getPageCount() !== pageCount) {
        throw new Error('The generated PDF did not retain the original page count.');
      }

      setOutputBytes(watermarkedBytes);
      setSuccess(true);
    } catch (processingError) {
      console.error('Unable to add PDF watermark:', processingError);
      setError(
        processingError?.message?.toLowerCase().includes('encrypt')
          ? 'Password-protected PDFs are not supported. Remove the password and try again.'
          : processingError?.message || 'The watermark could not be added to this PDF.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const outputName = file
    ? `${file.name.replace(/\.pdf$/i, '')}_${settings.watermarkEnabled
      ? settings.numberingEnabled ? 'watermarked_numbered' : 'watermarked'
      : 'numbered'}.pdf`
    : 'watermarked.pdf';

  return (
    <div className="watermark-tool-workspace space-y-8">
      <input {...getInputProps()} />
      {!file ? (
        <div
          {...getRootProps({
            role: 'group',
            'aria-label': 'Choose a PDF to add a watermark'
          })}
          className={`pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone edit-sign-upload-zone cursor-pointer transition-all ${
            isDragActive ? 'border-cyan-500 bg-cyan-50' : 'border-slate-300 hover:border-cyan-400 hover:bg-slate-50'
          }`}
        >
          <div className="merge-pdf-upload-content">
            <div className="pdf-upload-icon" aria-hidden="true">
              {isLoadingPages
                ? <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                : <Upload className="h-6 w-6 text-blue-600" />}
            </div>
            <div className="merge-pdf-upload-copy">
              <h3>{isLoadingPages ? 'Checking PDF pages…' : isDragActive ? 'Drop the PDF here' : 'Choose or drop a PDF to watermark'}</h3>
              <p>Add a text watermark and page numbers to selected PDF pages.</p>
            </div>
            <button
              type="button"
              className="pdf-editor-primary-button merge-pdf-upload-button"
              onClick={(event) => {
                event.stopPropagation();
                open();
              }}
              disabled={isLoadingPages || isProcessing}
            >
              Choose PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="pdf-attached-file-card flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 min-w-0">
            <AttachedFileIcon />
            <div className="truncate min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
              <p className="text-xs text-slate-400">
                {formatBytes(file.size)} · {isLoadingPages ? 'Checking pages...' : pageCount ? `${pageCount} pages` : 'Page count unavailable'}
              </p>
            </div>
          </div>
          <AttachedFileActions
            fileName={file.name}
            onReplace={open}
            onRemove={removeFile}
            disabled={isLoadingPages || isProcessing}
          />
        </div>
      )}

      {file && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <Settings2 className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-800">Watermark Settings</h2>
            </div>
            <button
              type="button"
              onClick={reset}
              disabled={isProcessing}
              className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50"
            >
              Reset
            </button>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={settings.watermarkEnabled}
              onChange={(event) => updateSettings({ watermarkEnabled: event.target.checked })}
              disabled={isProcessing}
              className="h-4 w-4 accent-cyan-600"
            />
            Add text watermark
          </label>

          <fieldset disabled={!settings.watermarkEnabled || isProcessing} className="space-y-6 disabled:opacity-60">
            <legend className="sr-only">Text watermark options</legend>
            <div className="space-y-2">
              <label htmlFor="watermark-text" className="text-sm font-semibold text-slate-700">Watermark text</label>
              <input
                id="watermark-text"
                type="text"
                maxLength={300}
                value={settings.text}
                onChange={(event) => updateSettings({ text: event.target.value })}
                placeholder="e.g. CONFIDENTIAL"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="watermark-size" className="text-sm font-semibold text-slate-700">Text size</label>
              <div className="flex items-center gap-3">
                <input
                  id="watermark-size"
                  type="number"
                  min="8"
                  max="96"
                  step="1"
                  value={settings.fontSize}
                  onChange={(event) => updateSettings({
                    fontSize: event.target.value === '' ? '' : Number(event.target.value)
                  })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50"
                />
                <span className="text-sm text-slate-500">pt</span>
              </div>
              <p className="text-xs text-slate-500">Choose 8 to 96 points.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="watermark-color" className="text-sm font-semibold text-slate-700">Text colour</label>
              <div className="flex items-center gap-3">
                <input
                  id="watermark-color"
                  type="color"
                  value={settings.color}
                  onChange={(event) => updateSettings({ color: event.target.value })}
                  className="h-12 w-16 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-slate-600 uppercase">{settings.color}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="watermark-rotation" className="text-sm font-semibold text-slate-700">Rotation</label>
              <div className="flex items-center gap-3">
                <input
                  id="watermark-rotation"
                  type="number"
                  min="-180"
                  max="180"
                  step="1"
                  value={settings.rotation}
                  onChange={(event) => updateSettings({
                    rotation: event.target.value === '' ? '' : Number(event.target.value)
                  })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50"
                />
                <span className="text-sm text-slate-500">degrees</span>
              </div>
              <p className="text-xs text-slate-500">Use 0° for horizontal text or another angle from -180° to 180°.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="watermark-opacity" className="text-sm font-semibold text-slate-700">
                Opacity <span className="font-normal text-slate-500">{Math.round(settings.opacity * 100)}%</span>
              </label>
              <input
                id="watermark-opacity"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.opacity}
                onChange={(event) => updateSettings({ opacity: Number(event.target.value) })}
                className="w-full accent-cyan-600"
              />
            </div>
            </div>

            <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Apply to</label>
            <div className="flex flex-col sm:flex-row gap-2">
              {[
                { value: 'all', label: 'All Pages' },
                { value: 'selected', label: 'Selected Pages' }
              ].map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => updateSettings({ pageMode: mode.value })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                    settings.pageMode === mode.value
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
              </div>
          </div>

          {settings.pageMode === 'selected' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <label htmlFor="watermark-pages" className="text-sm font-semibold text-slate-700">Page numbers / ranges</label>
              <input
                id="watermark-pages"
                type="text"
                value={settings.pageRanges}
                onChange={(event) => updateSettings({ pageRanges: event.target.value })}
                placeholder="e.g. 1,3,5-7"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50"
              />
              <p className="text-xs text-slate-500">
                Enter page numbers starting at 1, separated by commas. This PDF has {pageCount} pages.
              </p>
            </motion.div>
          )}

          </fieldset>

          <section className="space-y-5 rounded-xl border border-slate-200 p-4" aria-labelledby="page-number-options">
            <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={settings.numberingEnabled}
                onChange={(event) => updateSettings({ numberingEnabled: event.target.checked })}
                disabled={isProcessing}
                className="h-4 w-4 accent-cyan-600"
              />
              Add page numbers
            </label>
            <fieldset disabled={!settings.numberingEnabled || isProcessing} className="grid grid-cols-1 gap-4 disabled:opacity-60 md:grid-cols-2">
              <legend id="page-number-options" className="sr-only">Page-number options</legend>
              <div className="space-y-2">
                <label htmlFor="number-start" className="text-sm font-semibold text-slate-700">Starting number</label>
                <input id="number-start" type="number" min="1" max="1000000" step="1" value={settings.numberStart} onChange={(event) => updateSettings({ numberStart: event.target.value === '' ? '' : Number(event.target.value) })} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
              </div>
              <div className="space-y-2">
                <label htmlFor="number-placement" className="text-sm font-semibold text-slate-700">Placement</label>
                <select id="number-placement" value={settings.numberPlacement} onChange={(event) => updateSettings({ numberPlacement: event.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3">
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="number-align" className="text-sm font-semibold text-slate-700">Alignment</label>
                <select id="number-align" value={settings.numberAlign} onChange={(event) => updateSettings({ numberAlign: event.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3">
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="number-size" className="text-sm font-semibold text-slate-700">Font size (6–72 pt)</label>
                <input id="number-size" type="number" min="6" max="72" step="1" value={settings.numberFontSize} onChange={(event) => updateSettings({ numberFontSize: event.target.value === '' ? '' : Number(event.target.value) })} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
              </div>
              <div className="space-y-2">
                <label htmlFor="number-color" className="text-sm font-semibold text-slate-700">Number colour</label>
                <input id="number-color" type="color" value={settings.numberColor} onChange={(event) => updateSettings({ numberColor: event.target.value })} className="h-12 w-16 cursor-pointer rounded-lg border border-slate-200 bg-white p-1" />
              </div>
              <div className="space-y-2">
                <label htmlFor="number-margin" className="text-sm font-semibold text-slate-700">Margin (0–1440 pt)</label>
                <input id="number-margin" type="number" min="0" max="1440" step="1" value={settings.numberMargin} onChange={(event) => updateSettings({ numberMargin: event.target.value === '' ? '' : Number(event.target.value) })} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="number-pages-mode" className="text-sm font-semibold text-slate-700">Number pages</label>
                <select id="number-pages-mode" value={settings.numberPageMode} onChange={(event) => updateSettings({ numberPageMode: event.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3">
                  <option value="all">All pages</option>
                  <option value="selected">Selected pages / ranges</option>
                </select>
              </div>
              {settings.numberPageMode === 'selected' && (
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="number-pages" className="text-sm font-semibold text-slate-700">Page numbers / ranges</label>
                  <input id="number-pages" type="text" value={settings.numberPageRanges} onChange={(event) => updateSettings({ numberPageRanges: event.target.value })} placeholder="e.g. 1,3,5-7" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
                  <p className="text-xs text-slate-500">The sequence starts at {settings.numberStart} and increments for each selected page in document order.</p>
                </div>
              )}
            </fieldset>
          </section>

          <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-100 text-cyan-900 text-sm">
            Text watermarks and page numbers are drawn into a new PDF while preserving original content. Processing stays in your browser.
          </div>

          <button
            type="button"
            onClick={addWatermark}
            disabled={isProcessing || isLoadingPages || pageCount === null}
            className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white transition-all ${
              isProcessing || isLoadingPages || pageCount === null
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-200 active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing PDF...
              </>
            ) : (
              <>
                <Stamp className="w-5 h-5" />
                Apply PDF Options
              </>
            )}
          </button>
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

      {success && outputBytes && (
        <DownloadReadyCard
          fileName={outputName}
          sizeBytes={outputBytes.length}
          onDownload={(downloadFileName) => {
            downloadBlob(outputBytes, downloadFileName || outputName);
            markOutputDownloaded();
          }}
        />
      )}
    </div>
  );
};

export default PdfWatermarker;
