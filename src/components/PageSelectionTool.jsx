import React, { useCallback, useRef, useState } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { PDFDocument } from 'pdf-lib';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import { formatPageRanges, parsePageRanges, parsePageRangesWhileTyping } from '../lib/pageSelection.mjs';
import { normalizeOutputFileName } from '../lib/outputFileName.mjs';
import { AlertCircle, Loader2, Upload } from 'lucide-react';
import PdfPageGrid from './PdfPageGrid';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';
import DownloadReadyCard from './DownloadReadyCard';

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
  const [rangeInput, setRangeInput] = useState('');
  const [outputBytes, setOutputBytes] = useState(null);
  const markOutputDownloaded = useToolExitGuard(Boolean(file), outputBytes);
  const [outputName, setOutputName] = useState('');
  const [outputFileName, setOutputFileName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const requestId = useRef(0);

  const resetResult = () => {
    setOutputBytes(null);
    setOutputName('');
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
        setRangeInput('');
        setOutputFileName(isRemoving ? `${selectedFile.name.replace(/\.pdf$/i, '')}_pages_removed.pdf` : '');
      }
    } catch (loadError) {
      console.error('Unable to load PDF page selection:', loadError);
      if (requestId.current === currentRequestId) {
        setError(loadError.message || 'This PDF is invalid or could not be opened.');
      }
    } finally {
      if (requestId.current === currentRequestId) setIsLoading(false);
    }
  }, [isRemoving]);

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
    setRangeInput('');
    setOutputFileName('');
    setError('');
    setIsLoading(false);
    resetResult();
  };

  const togglePage = (pageNumber) => {
    const updated = new Set(selectedPages);
    if (updated.has(pageNumber)) updated.delete(pageNumber);
    else updated.add(pageNumber);
    setSelectedPages(updated);
    if (isRemoving) setRangeInput(formatPageRanges([...updated]));
    setError('');
    resetResult();
  };

  const selectAll = () => {
    const updated = new Set(Array.from({ length: pageCount }, (_, index) => index + 1));
    setSelectedPages(updated);
    if (isRemoving) setRangeInput(formatPageRanges([...updated]));
    setError('');
    resetResult();
  };

  const clearSelection = () => {
    setSelectedPages(new Set());
    if (isRemoving) setRangeInput('');
    setError('');
    resetResult();
  };

  const handleRangeChange = (value) => {
    setRangeInput(value);
    const updatedSelection = parsePageRangesWhileTyping(value, pageCount);
    if (updatedSelection !== null) setSelectedPages(new Set(updatedSelection));
    setError('');
    resetResult();
  };

  const processSelection = async () => {
    let pagesToProcess = selectedPages;
    if (isRemoving && rangeInput.trim()) {
      try {
        pagesToProcess = new Set(parsePageRanges(rangeInput, pageCount));
      } catch (rangeError) {
        setError(rangeError.message);
        return;
      }
    }

    if (!file || pagesToProcess.size === 0) {
      setError(`Select at least one page ${actionLabel}.`);
      return;
    }
    if (isRemoving && pagesToProcess.size >= pageCount) {
      setError('At least one page must remain in the output PDF.');
      return;
    }
    setIsProcessing(true);
    setError('');
    resetResult();
    try {
      const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
      if (source.isEncrypted) throw new Error('Password-protected PDFs are not supported.');

      const selectedIndices = [...pagesToProcess].sort((a, b) => a - b).map((page) => page - 1);
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
      const defaultOutputName = `${baseName}_${isRemoving ? 'pages_removed' : 'pages_extracted'}.pdf`;
      const normalizedOutputName = isRemoving
        ? normalizeOutputFileName(outputFileName, `${baseName}_pages_removed.pdf`)
        : defaultOutputName;
      setOutputBytes(bytes);
      setOutputFileName(isRemoving ? normalizedOutputName : '');
      setOutputName(normalizedOutputName);
    } catch (processingError) {
      console.error('Unable to process selected PDF pages:', processingError);
      setError(processingError.message || 'The selected pages could not be processed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadOutput = (downloadFileName, bytes = outputBytes, fileName = outputName) => {
    if (!bytes || !(downloadFileName || fileName)) return;
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    const link = window.document.createElement('a');
    link.href = url;
    link.download = downloadFileName || fileName;
    link.style.display = 'none';
    window.document.body.appendChild(link);
    link.click();
    link.remove();
    markOutputDownloaded();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const selectedSummary = [...selectedPages].sort((a, b) => a - b);
  const trimmedRangeInput = rangeInput.trim();
  const hasInvalidPageRange = isRemoving
    && Boolean(trimmedRangeInput)
    && (
      parsePageRangesWhileTyping(rangeInput, pageCount) === null
      || /(?:,|-)$/.test(trimmedRangeInput)
    );
  const handleOutputFileNameChange = (value) => {
    setOutputFileName(value);
    if (isRemoving && outputBytes && file) {
      const defaultOutputName = `${file.name.replace(/\.pdf$/i, '')}_pages_removed.pdf`;
      setOutputName(normalizeOutputFileName(value, defaultOutputName));
    }
    setError('');
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps({
          role: 'group',
          'aria-label': file ? `Selected PDF ${file.name}` : 'Choose a PDF'
        })}
        className={file
          ? isRemoving
            ? 'remove-pdf-attachment-dropzone'
            : 'pdf-attached-file-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between'
          : `pdf-workflow-upload merge-pdf-upload-zone rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'cursor-pointer border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md'
          }`}
      >
        <input {...getInputProps()} />
        {file ? (isRemoving ? (
          <section className="remove-pdf-file-section" aria-labelledby="remove-pdf-file-heading">
            <header>
              <h3 id="remove-pdf-file-heading" className="merge-selected-files-title">PDF to remove pages from</h3>
              <p>One PDF selected. Replace it or remove it to choose another.</p>
            </header>
            <div className="pdf-attached-file-card rotate-selected-file-card">
              <div className="rotate-selected-file-main">
                <AttachedFileIcon />
                <div className="rotate-selected-file-details">
                  <p className="rotate-selected-file-name" title={file.name}>{file.name}</p>
                  <p className="rotate-selected-file-meta">{formatBytes(file.size)} · {pageCount} pages</p>
                </div>
              </div>
              <AttachedFileActions
                fileName={file.name}
                onReplace={open}
                onRemove={clearFile}
                disabled={isLoading || isProcessing}
              />
            </div>
          </section>
        ) : (
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
        )) : (
          <div className="merge-pdf-upload-content">
            <div className="pdf-upload-icon" aria-hidden="true">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-blue-600" /> : <Upload className="h-6 w-6 text-blue-600" />}
            </div>
            <div className="merge-pdf-upload-copy">
              <h3>{isLoading ? 'Checking PDF pages…' : isDragActive ? 'Drop the PDF here' : `Choose or drop a PDF to ${isRemoving ? 'remove pages' : 'extract pages'}`}</h3>
              <p>{isRemoving ? 'Remove selected pages from a PDF.' : 'Extract selected pages into a new PDF.'}</p>
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
        <section
          className={isRemoving ? 'remove-pdf-workspace' : 'space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'}
          aria-labelledby={isRemoving ? 'remove-pdf-workspace-heading' : 'page-selection-heading'}
        >
          {isRemoving ? (
            <div className="remove-pdf-settings-shell">
              <div className="merge-control-intro">
                <h3 id="remove-pdf-workspace-heading" className="merge-selected-files-title">Select Pages &amp; Preview</h3>
                <p>Select pages to remove, choose an output name, and download the result.</p>
              </div>

              <section className="remove-pdf-settings-panel" aria-labelledby="remove-pdf-settings-heading">
                <div className="merge-section-heading merge-output-settings-heading">
                  <div>
                    <h3 id="remove-pdf-settings-heading" className="merge-section-heading-title merge-output-settings-title">Choose Settings</h3>
                    <p>Select the pages to remove from your PDF.</p>
                  </div>
                </div>
                <p className="remove-pdf-selection-count" aria-live="polite">
                  {selectedPages.size} {selectedPages.size === 1 ? 'page' : 'pages'} selected for removal.
                </p>
                <div className="rotate-page-range-controls">
                  <label htmlFor="remove-page-ranges">Page numbers or ranges</label>
                  <input
                    id="remove-page-ranges"
                    type="text"
                    inputMode="text"
                    placeholder="e.g. 1-3, 5"
                    aria-describedby={hasInvalidPageRange
                      ? 'remove-page-ranges-help remove-page-ranges-error'
                      : 'remove-page-ranges-help'}
                    aria-invalid={hasInvalidPageRange}
                    value={rangeInput}
                    onChange={(event) => handleRangeChange(event.target.value)}
                  />
                  <p id="remove-page-ranges-help">
                    Enter page numbers or ranges to remove, separated by commas.
                  </p>
                  {hasInvalidPageRange && (
                    <p id="remove-page-ranges-error" className="rotate-page-range-error" role="status">
                      Enter valid page numbers and ascending ranges from 1 to {pageCount}.
                    </p>
                  )}
                  {selectedPages.size >= pageCount && pageCount > 0 && (
                    <p className="rotate-page-range-error" role="status">
                      At least one page must remain in the output PDF.
                    </p>
                  )}
                </div>
                <div className="remove-pdf-selection-actions">
                  <button type="button" onClick={selectAll} className="remove-pdf-selection-action">Select All</button>
                  <button type="button" onClick={clearSelection} disabled={!selectedPages.size} className="remove-pdf-selection-action">Clear Selection</button>
                </div>
              </section>

              <section className="remove-pdf-page-preview-panel" aria-labelledby="remove-pdf-page-preview-heading">
                <div className="merge-section-heading merge-output-settings-heading">
                  <div>
                    <h3 id="remove-pdf-page-preview-heading" className="merge-section-heading-title merge-output-settings-title">Page preview</h3>
                    <p>Click a page to select it for removal or use its eye button to view it larger.</p>
                  </div>
                </div>
                <PdfPageGrid
                  file={file}
                  pageCount={pageCount}
                  selectedPages={selectedPages}
                  onToggle={togglePage}
                  actionLabel={actionLabel}
                  showPreviewButton={isRemoving}
                />
                {selectedSummary.length > 0 && (
                  <p className="remove-pdf-selected-summary">
                    Selected pages: {selectedSummary.join(', ')}
                  </p>
                )}
              </section>
            </div>
          ) : (
            <>
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

              <p className="pdf-preview-instructions">Click page previews to select or deselect pages.</p>
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
            </>
          )}

          {isRemoving && (
            <div className="rotate-output-actions remove-pdf-output-actions">
              <label htmlFor="remove-output-filename">Output filename</label>
              <input
                id="remove-output-filename"
                type="text"
                value={outputFileName}
                disabled={isProcessing}
                onChange={(event) => handleOutputFileNameChange(event.target.value)}
                maxLength={120}
                autoComplete="off"
              />
              <p>The .pdf extension is added automatically when needed.</p>
              <button
                type="button"
                onClick={processSelection}
                disabled={isLoading || isProcessing || selectedPages.size === 0 || selectedPages.size >= pageCount || hasInvalidPageRange}
                className={`rotate-process-button flex items-center justify-center gap-2 px-6 rounded-xl font-bold text-white transition-all
                  ${isLoading || isProcessing || !selectedPages.size || selectedPages.size >= pageCount || hasInvalidPageRange
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-200 active:scale-[0.98]'}
                `}
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : null}
                {isProcessing ? 'Processing...' : 'Remove Selected Pages'}
              </button>
            </div>
          )}

          {!isRemoving && (
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
        <DownloadReadyCard
          fileName={outputName}
          sizeBytes={outputBytes.length}
          showFilenameEditor={false}
          onDownload={downloadOutput}
        />
      )}
    </div>
  );
};

export default PageSelectionTool;
