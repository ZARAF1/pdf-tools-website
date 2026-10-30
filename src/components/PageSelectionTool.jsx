import React, { useCallback, useRef, useState } from 'react';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { PDFDocument } from 'pdf-lib';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import { AlertCircle, CheckCircle2, Download, Loader2, Upload } from 'lucide-react';
import PdfPageGrid from './PdfPageGrid';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';

const MAX_PAGES = 50;

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const PageSelectionTool = ({ mode }) => {
  const isRemoving = mode === 'remove';
  const actionLabel = isRemoving ? 'for removal' : 'for extraction';
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [outputBytes, setOutputBytes] = useState(null);
  const [outputName, setOutputName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmRemoval, setConfirmRemoval] = useState(false);
  const requestId = useRef(0);

  const resetResult = () => {
    setOutputBytes(null);
    setOutputName('');
    setConfirmRemoval(false);
  };

  const onDrop = useCallback(async (acceptedFiles, rejections) => {
    setError('');
    resetResult();
    if (rejections.length) {
      setError('Please choose one valid PDF file.');
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;
    const currentRequestId = requestId.current + 1;
    requestId.current = currentRequestId;
    setIsLoading(true);

    try {
      const source = await validateUnencryptedPdf(selectedFile);
      const count = source.getPageCount();
      if (!count) throw new Error('This PDF does not contain any pages.');
      if (count > MAX_PAGES) {
        throw new Error(`This PDF has ${count} pages. This tool supports up to ${MAX_PAGES} pages; no pages were skipped.`);
      }
      if (requestId.current === currentRequestId) {
        setFile(selectedFile);
        setPageCount(count);
        setSelectedPages(new Set());
      }
    } catch (loadError) {
      console.error('Unable to load PDF page selection:', loadError);
      if (requestId.current === currentRequestId) {
        setError(loadError.message || 'This PDF is invalid or could not be opened.');
      }
    } finally {
      if (requestId.current === currentRequestId) setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isProcessing,
    noClick: Boolean(file),
    noKeyboard: Boolean(file)
  });

  const clearFile = () => {
    requestId.current += 1;
    setFile(null);
    setPageCount(0);
    setSelectedPages(new Set());
    setError('');
    setIsLoading(false);
    resetResult();
  };

  const togglePage = (pageNumber) => {
    setSelectedPages((current) => {
      const updated = new Set(current);
      if (updated.has(pageNumber)) updated.delete(pageNumber);
      else updated.add(pageNumber);
      return updated;
    });
    setError('');
    resetResult();
  };

  const selectAll = () => {
    setSelectedPages(new Set(Array.from({ length: pageCount }, (_, index) => index + 1)));
    setError('');
    resetResult();
  };

  const clearSelection = () => {
    setSelectedPages(new Set());
    setError('');
    resetResult();
  };

  const processSelection = async () => {
    if (!file || selectedPages.size === 0) {
      setError(`Select at least one page ${actionLabel}.`);
      return;
    }
    if (isRemoving && selectedPages.size >= pageCount) {
      setError('At least one page must remain in the output PDF.');
      return;
    }
    if (isRemoving && !confirmRemoval) {
      setConfirmRemoval(true);
      return;
    }

    setIsProcessing(true);
    setError('');
    resetResult();
    try {
      const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
      if (source.isEncrypted) throw new Error('Password-protected PDFs are not supported.');

      const selectedIndices = [...selectedPages].sort((a, b) => a - b).map((page) => page - 1);
      const indices = isRemoving
        ? source.getPageIndices().filter((index) => !selectedIndices.includes(index))
        : selectedIndices;
      if (!indices.length) throw new Error('At least one page must remain in the output PDF.');

      const result = await PDFDocument.create();
      const pages = await result.copyPages(source, indices);
      pages.forEach((page) => result.addPage(page));
      const bytes = await result.save();
      const verified = await PDFDocument.load(bytes);
      if (verified.getPageCount() !== indices.length) {
        throw new Error('The generated PDF did not contain the expected number of pages.');
      }

      const baseName = file.name.replace(/\.pdf$/i, '');
      setOutputBytes(bytes);
      setOutputName(`${baseName}_${isRemoving ? 'pages_removed' : 'pages_extracted'}.pdf`);
    } catch (processingError) {
      console.error('Unable to process selected PDF pages:', processingError);
      setError(processingError.message || 'The selected pages could not be processed.');
    } finally {
      setIsProcessing(false);
      setConfirmRemoval(false);
    }
  };

  const downloadOutput = () => {
    if (!outputBytes || !outputName) return;
    const url = URL.createObjectURL(new Blob([outputBytes], { type: 'application/pdf' }));
    const link = window.document.createElement('a');
    link.href = url;
    link.download = outputName;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const selectedSummary = [...selectedPages].sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div
        {...getRootProps({
          role: 'group',
          'aria-label': file ? `Selected PDF ${file.name}` : 'Choose a PDF'
        })}
        className={file
          ? 'pdf-attached-file-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between'
          : `pdf-workflow-upload merge-pdf-upload-zone rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'cursor-pointer border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md'
          }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <AttachedFileIcon />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-slate-700">{file.name}</span>
                <span className="block text-xs text-slate-400">{formatBytes(file.size)} · {pageCount} pages</span>
              </span>
            </div>
            <div className="self-end sm:self-auto">
              <AttachedFileActions
                fileName={file.name}
                onReplace={open}
                onRemove={clearFile}
                disabled={isLoading || isProcessing}
              />
            </div>
          </>
        ) : (
          <div className="merge-pdf-upload-content">
            <div className="pdf-upload-icon" aria-hidden="true">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-blue-600" /> : <Upload className="h-6 w-6 text-blue-600" />}
            </div>
            <div className="merge-pdf-upload-copy">
              <h3>{isLoading ? 'Checking PDF pages…' : isDragActive ? 'Drop the PDF here' : `Choose or drop a PDF to ${isRemoving ? 'remove pages' : 'extract pages'}`}</h3>
              <p>One PDF, up to {MAX_PAGES} pages · processed in your browser</p>
            </div>
            <button
              type="button"
              className="pdf-editor-primary-button merge-pdf-upload-button"
              onClick={(event) => {
                event.stopPropagation();
                open();
              }}
              disabled={isLoading || isProcessing}
            >
              Choose PDF
            </button>
          </div>
        )}
      </div>

      {file && (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="page-selection-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 id="page-selection-heading" className="text-lg font-bold text-slate-800">Select pages</h3>
              <p aria-live="polite" className="text-sm text-slate-500">{selectedPages.size} {selectedPages.size === 1 ? 'page' : 'pages'} selected {actionLabel}.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={selectAll} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50">Select All</button>
              <button type="button" onClick={clearSelection} disabled={!selectedPages.size} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50">Clear Selection</button>
            </div>
          </div>

          <PdfPageGrid
            file={file}
            pageCount={pageCount}
            selectedPages={selectedPages}
            onToggle={togglePage}
            actionLabel={actionLabel}
          />

          {selectedSummary.length > 0 && (
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              Selected pages: {selectedSummary.join(', ')}
            </p>
          )}

          {confirmRemoval && isRemoving && (
            <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4" role="alert">
              <p className="text-sm font-medium text-amber-900">
                Remove {selectedPages.size} selected {selectedPages.size === 1 ? 'page' : 'pages'}? The original PDF will remain unchanged.
              </p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={processSelection} disabled={isProcessing || selectedPages.size >= pageCount} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50">
                  Confirm Remove Pages
                </button>
                <button type="button" onClick={() => setConfirmRemoval(false)} className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100">Cancel</button>
              </div>
            </div>
          )}

          {!confirmRemoval && (
            <button
              type="button"
              onClick={processSelection}
              disabled={isProcessing || selectedPages.size === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : null}
              {isProcessing ? 'Processing pages…' : isRemoving ? 'Remove Selected Pages' : 'Extract Selected Pages'}
            </button>
          )}
        </section>
      )}

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {outputBytes && (
        <div role="status" className="flex flex-col gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="text-sm font-medium">Ready: {outputName} · {formatBytes(outputBytes.length)}</span>
          </div>
          <button type="button" onClick={downloadOutput} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700">
            <Download className="h-4 w-4" aria-hidden="true" />
            {isRemoving ? 'Download PDF' : 'Download Extracted PDF'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PageSelectionTool;
