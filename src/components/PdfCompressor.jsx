import React, { useCallback, useRef, useState } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { PDFDocument } from 'pdf-lib';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import pdfjsLib from '../lib/pdfjsClient';
import { motion } from 'framer-motion';
import {
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileArchive,
  Info
} from 'lucide-react';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';
import DownloadReadyCard from './DownloadReadyCard';

const MAX_FILES = 5;
const MAX_PAGE_PIXELS = 16000000;
const HIGH_COMPRESSION_PROFILES = [
  { quality: 0.35, scale: 0.8 },
  { quality: 0.2, scale: 0.5 },
  { quality: 0.12, scale: 0.35 }
];

const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / (1024 ** unitIndex);
  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
};

const roundPercent = (value) => `${Math.max(0, Math.min(100, value)).toFixed(1)}%`;

const getPdfPageCount = async (file) => {
  if (!file) return 0;
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  return pdfDoc.getPageCount();
};

const canvasToJpegBytes = (canvas, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('A page image could not be created for this PDF.'));
        return;
      }
      blob.arrayBuffer()
        .then((buffer) => resolve(new Uint8Array(buffer)))
        .catch(reject);
    }, 'image/jpeg', quality);
  });

const createHighCompressionPdf = async (arrayBuffer, onProgress) => {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) });
  const sourcePdf = await loadingTask.promise;

  try {
    let smallestResult = null;

    for (let profileIndex = 0; profileIndex < HIGH_COMPRESSION_PROFILES.length; profileIndex += 1) {
      const profile = HIGH_COMPRESSION_PROFILES[profileIndex];
      const compressedPdf = await PDFDocument.create();

      for (let pageNumber = 1; pageNumber <= sourcePdf.numPages; pageNumber += 1) {
        onProgress(pageNumber, sourcePdf.numPages, profileIndex + 1);
        const sourcePage = await sourcePdf.getPage(pageNumber);
        const baseViewport = sourcePage.getViewport({ scale: 1 });
        const pageScale = Math.min(
          profile.scale,
          Math.sqrt(MAX_PAGE_PIXELS / (baseViewport.width * baseViewport.height))
        );
        const viewport = sourcePage.getViewport({ scale: pageScale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d');

        if (!context) {
          throw new Error('Your browser could not create an image for a PDF page.');
        }

        try {
          await sourcePage.render({ canvasContext: context, viewport, intent: 'print' }).promise;
          const jpegBytes = await canvasToJpegBytes(canvas, profile.quality);
          const image = await compressedPdf.embedJpg(jpegBytes);
          const outputPage = compressedPdf.addPage([baseViewport.width, baseViewport.height]);
          outputPage.drawImage(image, {
            x: 0,
            y: 0,
            width: baseViewport.width,
            height: baseViewport.height
          });
        } finally {
          canvas.width = 0;
          canvas.height = 0;
        }
      }

      const result = await compressedPdf.save({ useObjectStreams: true });
      if (!smallestResult || result.length < smallestResult.length) {
        smallestResult = result;
      }
      if (result.length < arrayBuffer.byteLength) {
        return result;
      }
    }

    return smallestResult;
  } finally {
    await loadingTask.destroy();
  }
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

const PdfCompressor = () => {
  const [files, setFiles] = useState([]);
  const replaceTargetRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidatingReplacement, setIsValidatingReplacement] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState('');
  const [highCompression, setHighCompression] = useState(false);

  const refreshPageCounts = async (newFiles) => {
    await Promise.all(
      newFiles.map(async (item) => {
        try {
          const pageCount = await getPdfPageCount(item.file);
          setFiles((prev) =>
            prev.map((entry) =>
              entry.id === item.id ? { ...entry, pageCount } : entry
            )
          );
        } catch (pageError) {
          setFiles((prev) =>
            prev.map((entry) =>
              entry.id === item.id
                ? { ...entry, pageCount: 0, status: 'error', error: 'This PDF is unreadable or is not a valid PDF.' }
                : entry
            )
          );
        }
      })
    );
  };

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    setError(null);
    setSummary('');

    if (fileRejections.length > 0) {
      setError('Only PDF files are supported.');
      return;
    }

    const validPdfs = acceptedFiles.filter(
      (file) => file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
    );

    if (validPdfs.length === 0) {
      setError('Please upload a valid PDF file.');
      return;
    }

    const remainingSlots = MAX_FILES - files.length;
    if (remainingSlots <= 0) {
      setError(`You can upload up to ${MAX_FILES} PDFs at a time.`);
      return;
    }

    const filesToCheck = validPdfs.slice(0, remainingSlots);
    const validationErrors = [];
    if (filesToCheck.length !== validPdfs.length) {
      validationErrors.push(`You can select up to ${MAX_FILES} PDFs. Extra files were skipped.`);
    }

    const allowedFiles = [];
    for (const file of filesToCheck) {
      try {
        await validateUnencryptedPdf(file);
        allowedFiles.push(file);
      } catch (validationError) {
        validationErrors.push(`${file.name}: ${validationError.message || 'This PDF could not be opened.'}`);
      }
    }

    const newEntries = allowedFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      file,
      name: file.name,
      size: file.size,
      pageCount: null,
      status: 'ready',
      outputBytes: null,
      outputName: null,
      error: '',
      summary: ''
    }));

    if (newEntries.length > 0) {
      setFiles((prev) => [...prev, ...newEntries]);
      refreshPageCounts(newEntries);
    }
    if (validationErrors.length > 0) setError(validationErrors.join(' '));
    else if (newEntries.length === 0) setError('Please upload a valid PDF file.');
  }, [files]);

  const onReplaceDrop = useCallback(async (acceptedFiles, fileRejections) => {
    const targetId = replaceTargetRef.current;
    replaceTargetRef.current = null;
    if (!acceptedFiles.length && !fileRejections.length) return;
    setError(null);
    setSummary('');
    if (isValidatingReplacement) {
      setError('Please wait while the selected PDF is checked.');
      return;
    }

    const replacementFile = acceptedFiles[0];
    if (fileRejections.length > 0 || acceptedFiles.length !== 1 || !replacementFile) {
      setError('Choose one valid PDF file to replace the selected file.');
      return;
    }

    const currentFile = files.find((item) => item.id === targetId);
    if (!currentFile) {
      setError('The selected PDF is no longer available to replace.');
      return;
    }

    setIsValidatingReplacement(true);
    try {
      await validateUnencryptedPdf(replacementFile);
      const replacementEntry = {
        ...currentFile,
        file: replacementFile,
        name: replacementFile.name,
        size: replacementFile.size,
        pageCount: null,
        status: 'ready',
        outputBytes: null,
        outputName: null,
        error: '',
        summary: ''
      };
      setFiles((previous) => previous.map((item) => (
        item.id === targetId ? replacementEntry : item
      )));
      refreshPageCounts([replacementEntry]);
    } catch (validationError) {
      console.error('Unable to validate replacement PDF for compression:', validationError);
      setError(`${replacementFile.name}: ${validationError.message || 'This PDF could not be opened.'}`);
    } finally {
      setIsValidatingReplacement(false);
    }
  }, [files, isValidatingReplacement]);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
    maxFiles: MAX_FILES,
    disabled: isProcessing || isValidatingReplacement || files.length >= MAX_FILES
  });

  const {
    getInputProps: getReplaceInputProps,
    open: openReplace
  } = useAccessibleDropzone({
    onDrop: onReplaceDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxFiles: 1,
    disabled: isProcessing || isValidatingReplacement,
    noClick: true,
    noKeyboard: true
  });

  const replaceFile = (id) => {
    replaceTargetRef.current = id;
    openReplace();
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
    setError(null);
    setSummary('');
  };

  const compressOneFile = async (item) => {
    const currentItem = item;
    setFiles((prev) =>
      prev.map((entry) =>
        entry.id === currentItem.id
          ? { ...entry, status: 'processing', error: '', summary: 'Optimising PDF...' }
          : entry
      )
    );

    try {
      const arrayBuffer = await currentItem.file.arrayBuffer();
      if (!arrayBuffer.byteLength) {
        throw new Error('This PDF is empty and cannot be optimised.');
      }

      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });

      if (pdfDoc.isEncrypted) {
        throw new Error('This PDF is encrypted and requires a password before it can be optimised.');
      }

      const candidateBytes = highCompression
        ? await createHighCompressionPdf(arrayBuffer, (page, totalPages, pass) => {
            setFiles((prev) =>
              prev.map((entry) =>
                entry.id === currentItem.id
                  ? { ...entry, summary: `Rendering page ${page} of ${totalPages} (compression pass ${pass})...` }
                  : entry
              )
            );
          })
        : await pdfDoc.save({
            useObjectStreams: true,
            addDefaultPage: false,
            updateFieldAppearances: false
          });

      const originalSize = currentItem.size;
      const optimizedBytes = candidateBytes.length < originalSize
        ? candidateBytes
        : new Uint8Array(arrayBuffer);
      const resultSize = optimizedBytes.length;
      const saved = originalSize - resultSize;
      const percentSaved = originalSize > 0 ? (saved / originalSize) * 100 : 0;
      const outputName = currentItem.name.replace(/\.pdf$/i, '') + '_compressed.pdf';

      setFiles((prev) =>
        prev.map((entry) =>
          entry.id === currentItem.id
            ? {
                ...entry,
                status: 'success',
                outputBytes: optimizedBytes,
                outputName,
                error: '',
                reduced: resultSize < originalSize,
                summary:
                  resultSize < originalSize
                    ? `${highCompression ? 'Higher compression. ' : ''}Saved ${formatBytes(saved)} (${roundPercent(percentSaved)})`
                    : 'No smaller result could be created. The original PDF is kept so the download will not be larger.',
              }
            : entry
        )
      );
      return resultSize < originalSize ? 'reduced' : 'unchanged';
    } catch (err) {
      const message = err?.message || 'This PDF could not be optimised. Please make sure it is valid and not encrypted.';
      setFiles((prev) =>
        prev.map((entry) =>
          entry.id === currentItem.id
            ? {
                ...entry,
                status: 'error',
                error: message,
                summary: 'Failed to optimise this PDF.'
              }
            : entry
        )
      );
      return 'failed';
    }
  };

  const compressBatch = async () => {
    if (files.length === 0) {
      setError('Please upload at least one PDF to compress.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSummary('');

    const queue = files.filter((item) => item.status !== 'error' && item.status !== 'success');
    if (queue.length === 0) {
      setSummary('All selected PDFs have already been processed.');
      setIsProcessing(false);
      return;
    }

    let reduced = 0;
    let unchanged = 0;
    let failed = 0;
    for (const item of queue) {
      const outcome = await compressOneFile(item);
      if (outcome === 'reduced') reduced += 1;
      else if (outcome === 'unchanged') unchanged += 1;
      else failed += 1;
    }

    setIsProcessing(false);
    if (reduced > 0 && unchanged === 0 && failed === 0) {
      setSummary(`${reduced} PDF${reduced > 1 ? 's were' : ' was'} optimised successfully.`);
    } else if (reduced > 0 || unchanged > 0 || failed > 0) {
      const parts = [];
      if (reduced > 0) parts.push(`${reduced} reduced`);
      if (unchanged > 0) parts.push(`${unchanged} kept unchanged`);
      if (failed > 0) parts.push(`${failed} failed`);
      setSummary(`Compression complete: ${parts.join(', ')}.`);
    }
  };

  const fileResults = files.filter((item) => item.status === 'success' && item.outputBytes);
  const downloadableResults = fileResults.filter((item) => item.reduced);
  const markOutputDownloaded = useToolExitGuard(files.length > 0, downloadableResults);
  const downloadResult = (item, downloadFileName) => {
    downloadBlob(item.outputBytes, downloadFileName || item.outputName);
    markOutputDownloaded(item.id);
  };
  const hasReadyFiles = files.some((item) => item.status === 'ready' || item.status === 'processing');
  const selectedFileCards = files.length > 0 ? (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          Selected PDFs ({files.length}/{MAX_FILES})
        </h4>
      </div>

      <div className="space-y-3">
        {files.map((item) => (
          <div
            key={item.id}
            className="pdf-attached-file-card bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <AttachedFileIcon />
                <div className="truncate min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{item.name}</p>
                  <p className="text-xs text-slate-400">
                    {formatBytes(item.size)} • {item.pageCount === null ? 'Checking pages...' : `${item.pageCount} pages`}
                  </p>
                </div>
              </div>

              <AttachedFileActions
                fileName={item.name}
                onReplace={() => replaceFile(item.id)}
                onRemove={() => removeFile(item.id)}
                disabled={isProcessing || isValidatingReplacement || item.status === 'processing'}
              />
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600">
              {item.status === 'processing' && (
                <div className="flex items-center gap-2 text-violet-700">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Optimising PDF...
                </div>
              )}
              {item.status === 'error' && (
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span>{item.error || 'Could not optimise this PDF.'}</span>
                </div>
              )}
              {item.status === 'ready' && (
                <div className="text-slate-500">Ready to optimise.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className="compress-pdf-workspace space-y-8">
      {selectedFileCards}

      <input {...getReplaceInputProps()} />
      <div
        {...getRootProps({
          role: 'group',
          'aria-label': 'Choose up to 5 PDFs to compress'
        })}
        className={`pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone protect-extract-upload-zone cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
        } ${files.length >= MAX_FILES ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="merge-pdf-upload-content">
          <div className="pdf-upload-icon" aria-hidden="true">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          <div className="merge-pdf-upload-copy">
            <h3 aria-live="polite">
              {files.length >= MAX_FILES
                ? `Limit reached (max ${MAX_FILES})`
                : isDragActive
                  ? 'Drop the PDFs here'
                  : 'Choose or drop PDFs to compress'}
            </h3>
            <p>Try to reduce PDF file size with standard or higher compression.</p>
          </div>
          <button
            type="button"
            className="pdf-editor-primary-button merge-pdf-upload-button"
            onClick={(event) => {
              event.stopPropagation();
              open();
            }}
            disabled={isProcessing || files.length >= MAX_FILES}
          >
            Choose Up to 5 PDFs
          </button>
        </div>
      </div>

      {files.length > 0 && (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-800">Higher compression</p>
            <p className="text-sm text-slate-500">Off: standard optimization · On: attempts stronger compression with quality loss</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={highCompression}
            aria-label="Higher compression"
            disabled={isProcessing}
            onClick={() => setHighCompression((enabled) => !enabled)}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              highCompression ? 'bg-violet-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                highCompression ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {highCompression && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <p>
              Higher compression rasterizes every page and reduces image quality. Text may look less sharp and will no longer be searchable or selectable; links and interactive form fields will not work. Processing happens locally in your browser; files are not uploaded.
            </p>
          </motion.div>
        )}
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

      {summary && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          className="flex items-start gap-3 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200"
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">{summary}</p>
          </div>
        </motion.div>
      )}

      {files.length > 0 && (
        <div className="pt-2">
          <button
            onClick={compressBatch}
            disabled={isProcessing || isValidatingReplacement || files.length === 0 || !hasReadyFiles}
            className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white transition-all ${
              isProcessing || isValidatingReplacement || files.length === 0 || !hasReadyFiles
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-200 active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Compressing...
              </>
            ) : (
              <>
                <FileArchive className="w-5 h-5" />
                Compress PDFs
              </>
            )}
          </button>
        </div>
      )}

      {fileResults.length > 0 && (
        <div className="space-y-3">
          {fileResults.map((item) => item.reduced ? (
            <DownloadReadyCard
              key={item.id}
              fileName={item.outputName}
              sizeBytes={item.outputBytes.length}
              details={`Original: ${formatBytes(item.size)} · ${item.summary}`}
              onDownload={(downloadFileName) => downloadResult(item, downloadFileName)}
              downloadLabel="Download"
            />
          ) : (
            <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1 text-sm text-slate-700">
                <p className="font-semibold">{item.name}</p>
                <p>Original: {formatBytes(item.size)} · Result: {formatBytes(item.outputBytes.length)}</p>
                <p className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-violet-600" />
                  {item.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {fileResults.length > 0 && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-800">
          <strong>Note:</strong> Standard mode rewrites the PDF while preserving its content. Higher compression flattens each page into an image, so text is no longer searchable or selectable and interactive elements are lost. Either mode may produce a larger or unchanged file when the PDF is already optimized.
        </div>
      )}
    </div>
  );
};

export default PdfCompressor;
