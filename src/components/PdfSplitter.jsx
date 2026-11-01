import React, { useState, useCallback } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { PDFDocument } from 'pdf-lib';
import { recoverPdfPageTreeRoot } from '../lib/pdfPageTreeRecovery.mjs';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Download,
  Loader2, 
  AlertCircle,
  Scissors,
  Layers
} from 'lucide-react';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';
import DownloadReadyCard from './DownloadReadyCard';

const PdfSplitter = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState('extract'); // 'extract' or 'split-all'
  const [rangeInput, setRangeInput] = useState('');
  const [outputFiles, setOutputFiles] = useState([]);
  const markOutputDownloaded = useToolExitGuard(Boolean(file), outputFiles);

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    setError(null);
    setSuccess(false);
    setOutputFiles([]);

    if (fileRejections.length > 0) {
      setError('Please choose a valid PDF file.');
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    try {
      await validateUnencryptedPdf(selectedFile);
      setFile(selectedFile);
    } catch (validationError) {
      console.error('Unable to validate PDF for splitting:', validationError);
      setError(validationError.message || 'This PDF is invalid or could not be opened.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isProcessing
  });

  const removeFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setRangeInput('');
    setOutputFiles([]);
  };

  const parseRanges = (input, maxPages) => {
    const pages = new Set();
    const parts = input.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) throw new Error('Page selections cannot contain empty entries.');

      if (trimmed.includes('-')) {
        const range = trimmed.split('-').map(s => parseInt(s.trim(), 10));
        const start = range[0];
        const end = range[1];
        if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > maxPages) {
          throw new Error(`Invalid range: ${trimmed}`);
        }
        for (let i = start; i <= end; i++) {
          pages.add(i);
        }
      } else {
        const page = parseInt(trimmed, 10);
        if (isNaN(page) || page < 1 || page > maxPages) {
          throw new Error(`Invalid page: ${trimmed}`);
        }
        pages.add(page);
      }
    }
    if (!pages.size) throw new Error('Enter at least one page number or range.');
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setOutputFiles([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      recoverPdfPageTreeRoot(srcDoc);
      const pageCount = srcDoc.getPageCount();

      if (mode === 'extract') {
        const selectedPages = parseRanges(rangeInput, pageCount);
        if (selectedPages.length === 0) {
          throw new Error("Please enter at least one valid page or range.");
        }

        const dstDoc = await PDFDocument.create();
        const indices = selectedPages.map(p => p - 1);
        const copiedPages = await dstDoc.copyPages(srcDoc, indices);
        copiedPages.forEach(page => dstDoc.addPage(page));

        const pdfBytes = await dstDoc.save();
        setOutputFiles([{ bytes: pdfBytes, name: `extracted_${file.name}` }]);
      } else {
        const outputs = [];
        for (let i = 0; i < pageCount; i++) {
          const dstDoc = await PDFDocument.create();
          const [copiedPage] = await dstDoc.copyPages(srcDoc, [i]);
          dstDoc.addPage(copiedPage);
          const pdfBytes = await dstDoc.save();
          const fileName = `page_${i + 1}_${file.name}`;
          outputs.push({ bytes: pdfBytes, name: fileName });
        }
        setOutputFiles(outputs);
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred during splitting.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadOutput = (output) => {
    const url = URL.createObjectURL(new Blob([output.bytes], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = output.name;
    link.click();
    markOutputDownloaded(output.name);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="split-pdf-workspace space-y-8">
      <input {...getInputProps()} />
      {!file ? (
        <div 
          {...getRootProps({
            role: 'group',
            'aria-label': 'Choose a PDF to split'
          })}
          className={`pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone protect-extract-upload-zone cursor-pointer transition-all ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
          }`}
        >
          <div className="merge-pdf-upload-content">
            <div className="pdf-upload-icon" aria-hidden="true">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <div className="merge-pdf-upload-copy">
              <h3>{isDragActive ? 'Drop the PDF here' : 'Choose or drop a PDF to split'}</h3>
              <p>Extract selected pages or split the PDF into single-page files.</p>
            </div>
            <button
              type="button"
              className="pdf-editor-primary-button merge-pdf-upload-button"
              onClick={(event) => {
                event.stopPropagation();
                open();
              }}
              disabled={isProcessing}
            >
              Choose PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="pdf-attached-file-card split-pdf-selected-file flex min-w-0 flex-col gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div className="split-pdf-file-details flex min-w-0 flex-1 items-center gap-3">
              <AttachedFileIcon />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <div className="split-pdf-file-actions self-end sm:self-auto">
              <AttachedFileActions
                fileName={file.name}
                onReplace={open}
                onRemove={removeFile}
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap gap-4 border-b border-slate-100 pb-4" role="group" aria-label="Split action">
              <button
                type="button"
                aria-pressed={mode === 'extract'}
                onClick={() => setMode('extract')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'extract' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Scissors className="w-4 h-4" />
                Extract Pages
              </button>
              <button
                type="button"
                aria-pressed={mode === 'split-all'}
                onClick={() => setMode('split-all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'split-all' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Layers className="w-4 h-4" />
                Split All Pages
              </button>
            </div>

            {mode === 'extract' && (
              <div className="space-y-2">
                <label htmlFor="split-page-ranges" className="text-sm font-semibold text-slate-700">Enter Page Ranges</label>
                <input
                  id="split-page-ranges"
                  type="text"
                  placeholder="e.g. 1-3, 5"
                  aria-describedby="split-page-ranges-help"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                />
                <p id="split-page-ranges-help" className="text-xs text-slate-500">Use commas to separate ranges. Example: 1-3, 5</p>
              </div>
            )}

            {mode === 'split-all' && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm">
                Each page is prepared as a separate PDF. Download each file individually after processing.
              </div>
            )}

            <button
              type="button"
              onClick={handleSplit}
              disabled={isProcessing}
              className={`
                w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white transition-all
                ${isProcessing ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98]'}
              `}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  {mode === 'extract' ? 'Extract Pages' : 'Prepare Individual Pages'}
                </>
              )}
            </button>
            {isProcessing && <p className="sr-only" role="status">Preparing your PDF files.</p>}
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

      {success && outputFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="split-pdf-result-content min-w-0 space-y-3"
        >
          {outputFiles.map((output) => (
            <DownloadReadyCard
              key={output.name}
              fileName={output.name}
              sizeBytes={output.bytes.length}
              onDownload={() => downloadOutput(output)}
              downloadLabel="Download PDF"
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PdfSplitter;
