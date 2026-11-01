import React, { useState, useCallback } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { PDFDocument } from 'pdf-lib';
import { recoverPdfPageTreeRoot } from '../lib/pdfPageTreeRecovery.mjs';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import { createSplitPdfArchive } from '../lib/splitPdfArchive.mjs';
import { createSplitPdfOutputs } from '../lib/splitPdfOutputs.mjs';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Download,
  Loader2, 
  AlertCircle,
  Scissors,
  Layers,
  Percent,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';
import DownloadReadyCard from './DownloadReadyCard';
import PdfPageGrid from './PdfPageGrid';
import {
  createPageGroupRangesByPartCount,
  createPageGroupsByPartCount,
  parsePageRanges
} from '../lib/splitPdfPages.mjs';

const PREVIEW_PAGE_WINDOW = 24;
const MAX_PERCENTAGE_PARTS = 10;

const PdfSplitter = () => {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState('extract-selected');
  const [rangeInput, setRangeInput] = useState('');
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [partCount, setPartCount] = useState(2);
  const [previewStartPage, setPreviewStartPage] = useState(1);
  const [outputFiles, setOutputFiles] = useState([]);
  const [archiveOutput, setArchiveOutput] = useState(null);
  const markOutputDownloaded = useToolExitGuard(Boolean(file), archiveOutput ? [archiveOutput] : outputFiles);

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    setError(null);
    setSuccess(false);
    setOutputFiles([]);
    setArchiveOutput(null);

    if (fileRejections.length > 0) {
      setError('Please choose a valid PDF file.');
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    try {
      const validatedPdf = await validateUnencryptedPdf(selectedFile);
      recoverPdfPageTreeRoot(validatedPdf);
      const selectedPageCount = validatedPdf.getPageCount();
      if (selectedPageCount < 1) throw new Error('This PDF does not contain any pages.');
      setFile(selectedFile);
      setPageCount(selectedPageCount);
      setSelectedPages(new Set());
      setRangeInput('');
      setPartCount(Math.min(2, selectedPageCount));
      setPreviewStartPage(1);
      if (selectedPageCount === 1) setMode('extract-selected');
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
    setPageCount(0);
    setSelectedPages(new Set());
    setPartCount(2);
    setPreviewStartPage(1);
    setOutputFiles([]);
    setArchiveOutput(null);
  };

  const clearResults = () => {
    setError(null);
    setSuccess(false);
    setOutputFiles([]);
    setArchiveOutput(null);
  };

  const togglePage = (pageNumber) => {
    const updated = new Set(selectedPages);
    if (updated.has(pageNumber)) updated.delete(pageNumber);
    else updated.add(pageNumber);
    setSelectedPages(updated);
    setRangeInput([...updated].sort((a, b) => a - b).join(', '));
    clearResults();
  };

  const selectAllPages = () => {
    const allPages = new Set(Array.from({ length: pageCount }, (_, index) => index + 1));
    setSelectedPages(allPages);
    setRangeInput([...allPages].join(', '));
    clearResults();
  };

  const clearSelectedPages = () => {
    setSelectedPages(new Set());
    setRangeInput('');
    clearResults();
  };

  const updateRanges = (value) => {
    setRangeInput(value);
    if (!value.trim()) {
      setSelectedPages(new Set());
      clearResults();
      return;
    }
    try {
      setSelectedPages(new Set(parsePageRanges(value, pageCount)));
      clearResults();
    } catch {
      setOutputFiles([]);
      setArchiveOutput(null);
      setSuccess(false);
    }
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
    setArchiveOutput(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      recoverPdfPageTreeRoot(srcDoc);
      if (mode === 'extract-selected' && selectedPages.size === 0) {
        throw new Error('Select at least one page to extract.');
      }
      const groups = mode === 'extract-selected'
        ? [parsePageRanges(rangeInput, pageCount)]
        : mode === 'split-percentage'
          ? createPageGroupsByPartCount(pageCount, partCount)
          : Array.from({ length: pageCount }, (_, index) => [index + 1]);

      const outputs = await createSplitPdfOutputs({
        sourceDocument: srcDoc,
        pageGroups: groups,
        fileName: file.name,
        mode
      });

      if (mode !== 'extract-selected') {
        let archive = null;
        try {
          const archiveSuffix = mode === 'split-percentage' ? 'parts' : 'split_pages';
          archive = await createSplitPdfArchive(outputs, file.name, archiveSuffix);
        } catch (archiveError) {
          console.error('Unable to create ZIP archive for Split PDF:', archiveError);
          setError(`The ZIP archive could not be created: ${archiveError.message} Individual PDF downloads are available below.`);
        }
        setArchiveOutput(archive);
      }

      setOutputFiles(outputs);
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

  const downloadArchive = () => {
    const url = URL.createObjectURL(new Blob([archiveOutput.blob], { type: 'application/zip' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = archiveOutput.name;
    link.click();
    markOutputDownloaded(archiveOutput.name);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const activePartCount = Math.min(partCount, Math.min(MAX_PERCENTAGE_PARTS, pageCount));
  const percentageRanges = mode === 'split-percentage' && pageCount > 1
    ? createPageGroupRangesByPartCount(pageCount, Math.max(2, activePartCount))
    : [];
  const pageLabels = (pageNumber) => {
    if (mode === 'split-all') return 'Separate PDF';
    const partIndex = percentageRanges.findIndex(({ startPage, endPage }) => pageNumber >= startPage && pageNumber <= endPage);
    return partIndex < 0 ? '' : `Part ${partIndex + 1}`;
  };
  const previewEndPage = Math.min(previewStartPage + PREVIEW_PAGE_WINDOW - 1, pageCount);
  const selectedSummary = [...selectedPages].sort((a, b) => a - b);
  const percentageSummary = percentageRanges.map(({ startPage, endPage }, index) => {
    const percent = Math.round(((endPage - startPage + 1) / pageCount) * 100);
    return `Part ${index + 1}: pages ${startPage}–${endPage} (${percent}%)`;
  });

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
              <p>Extract selected pages, split every page, or divide the PDF into percentage-based sections.</p>
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

          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4" role="group" aria-label="Choose how to split the PDF">
              <button
                type="button"
                aria-pressed={mode === 'extract-selected'}
                onClick={() => {
                  setMode('extract-selected');
                  clearResults();
                }}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${mode === 'extract-selected' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Scissors className="w-4 h-4" />
                Extract selected pages
              </button>
              <button
                type="button"
                aria-pressed={mode === 'split-all'}
                onClick={() => {
                  setMode('split-all');
                  clearResults();
                }}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${mode === 'split-all' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Layers className="w-4 h-4" />
                Split every page
              </button>
              <button
                type="button"
                aria-pressed={mode === 'split-percentage'}
                onClick={() => {
                  setMode('split-percentage');
                  clearResults();
                }}
                disabled={pageCount < 2}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 ${mode === 'split-percentage' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Percent className="h-4 w-4" />
                Split by percentage
              </button>
            </div>

            {mode === 'extract-selected' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-700" aria-live="polite">
                    Select pages to combine into one PDF ({selectedPages.size} selected)
                  </p>
                  <div className="flex gap-2">
                    <button type="button" onClick={selectAllPages} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50">
                      Select all
                    </button>
                    <button type="button" onClick={clearSelectedPages} disabled={!selectedPages.size} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50">
                      Clear
                    </button>
                  </div>
                </div>
                <label htmlFor="split-page-ranges" className="block text-sm font-medium text-slate-700">
                  Or enter page numbers and ranges
                </label>
                <input
                  id="split-page-ranges"
                  type="text"
                  placeholder="e.g. 1-3, 5"
                  aria-describedby="split-page-ranges-help"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={rangeInput}
                  onChange={(event) => updateRanges(event.target.value)}
                />
                <p id="split-page-ranges-help" className="text-xs text-slate-500">Click page previews below or enter comma-separated pages and ranges. Output follows document order.</p>
              </div>
            )}

            {mode === 'split-all' && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                Every page is included and becomes its own PDF. Page previews are for inspection. More than three outputs are packaged into one ZIP.
              </div>
            )}

            {mode === 'split-percentage' && (
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label htmlFor="split-part-count" className="block text-sm font-semibold text-slate-700">
                  Number of equal sections: {activePartCount}
                </label>
                <input
                  id="split-part-count"
                  type="range"
                  min="2"
                  max={Math.min(MAX_PERCENTAGE_PARTS, pageCount)}
                  step="1"
                  value={activePartCount}
                  aria-describedby="split-part-count-help"
                  onChange={(event) => {
                    setPartCount(Number(event.target.value));
                    clearResults();
                  }}
                  className="w-full accent-blue-600"
                />
                <p id="split-part-count-help" className="text-xs text-slate-600">
                  The slider divides the page count into balanced consecutive sections. The page labels below show each section boundary.
                </p>
                <ul className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2" aria-live="polite">
                  {percentageSummary.map((summary) => <li key={summary}>{summary}</li>)}
                </ul>
                {percentageRanges.length > 3 && (
                  <p className="text-xs font-medium text-slate-600">
                    {percentageRanges.length} PDFs will be packaged into one ZIP download.
                  </p>
                )}
              </div>
            )}

            <section className="space-y-4" aria-labelledby="split-page-preview-heading">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 id="split-page-preview-heading" className="text-base font-semibold text-slate-800">Page previews</h3>
                  <p className="text-sm text-slate-500">
                    {mode === 'extract-selected'
                      ? 'Select thumbnails to choose pages for one PDF.'
                      : mode === 'split-percentage'
                        ? 'Part labels show where the percentage-based sections begin and end.'
                        : 'Inspect the pages; each one will be saved separately.'}
                  </p>
                </div>
                {pageCount > PREVIEW_PAGE_WINDOW && (
                  <nav className="flex items-center gap-2" aria-label="Page preview pages">
                    <button
                      type="button"
                      onClick={() => setPreviewStartPage(Math.max(1, previewStartPage - PREVIEW_PAGE_WINDOW))}
                      disabled={previewStartPage <= 1}
                      aria-label="Previous preview pages"
                      className="rounded-lg border border-slate-200 p-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="text-xs text-slate-500">Pages {previewStartPage}–{previewEndPage} of {pageCount}</span>
                    <button
                      type="button"
                      onClick={() => setPreviewStartPage(Math.min(pageCount, previewStartPage + PREVIEW_PAGE_WINDOW))}
                      disabled={previewEndPage >= pageCount}
                      aria-label="Next preview pages"
                      className="rounded-lg border border-slate-200 p-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </nav>
                )}
              </div>
              <PdfPageGrid
                file={file}
                pageCount={pageCount}
                selectedPages={selectedPages}
                onToggle={togglePage}
                actionLabel="for extraction"
                selectionEnabled={mode === 'extract-selected'}
                startPage={previewStartPage}
                endPage={previewEndPage}
                pageLabels={pageLabels}
              />
              {mode === 'extract-selected' && selectedSummary.length > 0 && (
                <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                  Selected pages: {selectedSummary.join(', ')}
                </p>
              )}
            </section>

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
                  {mode === 'extract-selected'
                    ? 'Create PDF from selected pages'
                    : mode === 'split-percentage'
                      ? `Create ${activePartCount} PDF parts`
                      : 'Split into individual pages'}
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
          {archiveOutput ? (
            <DownloadReadyCard
              fileName={archiveOutput.name}
              sizeBytes={archiveOutput.blob.size}
              onDownload={downloadArchive}
              downloadLabel="Download ZIP"
            />
          ) : outputFiles.map((output) => (
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
