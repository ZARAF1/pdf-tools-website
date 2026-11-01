import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import { recoverPdfPageTreeRoot } from '../lib/pdfPageTreeRecovery.mjs';
import { motion, Reorder } from 'framer-motion';
import { 
  Upload, 
  Trash2, 
  RefreshCw,
  ChevronUp, 
  ChevronDown, 
  Download, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import { AttachedFileIcon } from './AttachedFileControls';
import DownloadReadyCard from './DownloadReadyCard';
import PdfMergePagePicker from './PdfMergePagePicker';
import { addPageToMergeOrder, getFitPageDimensions, normalizePdfFileName } from '../lib/pdfMergeOptions.mjs';
import { buildMergedPdf } from '../lib/pdfMergeOutput.mjs';

const MAX_FILES = 5;

const PdfMerger = () => {
  const [files, setFiles] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [outputBytes, setOutputBytes] = useState(null);
  const markOutputDownloaded = useToolExitGuard(files.length > 0, outputBytes);
  const [mergeMode, setMergeMode] = useState('all');
  const [selectedPages, setSelectedPages] = useState([]);
  const [previewImages, setPreviewImages] = useState({});
  const [outputFileName, setOutputFileName] = useState('merged_document.pdf');
  const [addSourceBookmarks, setAddSourceBookmarks] = useState(false);
  const [pageSize, setPageSize] = useState('preserve');
  const [addBlankPages, setAddBlankPages] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const isValidatingRef = useRef(false);
  const pendingFocusRef = useRef(null);
  const replaceTargetRef = useRef(null);

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    setError(null);
    setSuccess(false);
    setOutputBytes(null);

    if (isValidatingRef.current) {
      setError('Please wait while the selected PDFs are checked.');
      return;
    }

    const remainingSlots = MAX_FILES - files.length;
    if (remainingSlots <= 0) {
      setError(`Limit reached: You can add up to ${MAX_FILES} PDF files.`);
      return;
    }

    isValidatingRef.current = true;
    setIsValidating(true);
    const filesToCheck = acceptedFiles.slice(0, remainingSlots);
    const validationErrors = fileRejections.length > 0
      ? ['Only valid PDF files can be added.']
      : [];
    const validatedFiles = [];
    try {
      for (const file of filesToCheck) {
        try {
          const document = await validateUnencryptedPdf(file);
          recoverPdfPageTreeRoot(document);
          validatedFiles.push({ file, pageCount: document.getPageCount() });
        } catch (validationError) {
          validationErrors.push(`${file.name}: ${validationError.message || 'This PDF could not be opened.'}`);
        }
      }

      const skippedCount = acceptedFiles.length - filesToCheck.length;
      if (skippedCount > 0) {
        validationErrors.push(`Limit reached: only ${MAX_FILES} PDF files can be added.`);
      }

      if (validatedFiles.length > 0) {
        setFiles((previous) => [
          ...previous,
          ...validatedFiles.map(({ file, pageCount }) => ({
            file,
            id: Math.random().toString(36).substring(7),
            name: file.name,
            pageCount,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
          }))
        ]);
        setAnnouncement(`${validatedFiles.length} PDF${validatedFiles.length === 1 ? '' : 's'} added. ${files.length + validatedFiles.length} of ${MAX_FILES} files selected.`);
      }

      if (validationErrors.length > 0) setError(validationErrors.join(' '));
      else if (acceptedFiles.length === 0) setError('Please choose valid PDF files.');
    } finally {
      isValidatingRef.current = false;
      setIsValidating(false);
    }
  }, [files.length]);

  const onReplaceDrop = useCallback(async (acceptedFiles, fileRejections) => {
    const targetId = replaceTargetRef.current;
    replaceTargetRef.current = null;
    if (!acceptedFiles.length && !fileRejections.length) return;
    setError(null);
    setSuccess(false);
    setOutputBytes(null);

    if (isValidatingRef.current) {
      setError('Please wait while the selected PDFs are checked.');
      return;
    }

    const replacementFile = acceptedFiles[0];
    if (fileRejections.length > 0 || acceptedFiles.length !== 1 || !replacementFile) {
      setError('Choose one valid PDF file to replace the selected file.');
      return;
    }

    isValidatingRef.current = true;
    setIsValidating(true);
    try {
      const replacementDocument = await validateUnencryptedPdf(replacementFile);
      recoverPdfPageTreeRoot(replacementDocument);
      const currentFile = files.find((file) => file.id === targetId);
      if (!currentFile) {
        setError('The selected PDF is no longer available to replace.');
        return;
      }

      pendingFocusRef.current = { id: targetId, action: 'replace' };
      setFiles((previous) => previous.map((file) => file.id === targetId
        ? {
            ...file,
            file: replacementFile,
            name: replacementFile.name,
            pageCount: replacementDocument.getPageCount(),
            size: (replacementFile.size / 1024 / 1024).toFixed(2) + ' MB'
          }
        : file
      ));
      setSelectedPages((previous) => previous.filter((page) => page.fileId !== targetId));
      setPreviewImages((previous) => {
        const next = { ...previous };
        delete next[targetId];
        return next;
      });
      setAnnouncement(`${currentFile.name} replaced with ${replacementFile.name}.`);
    } catch (validationError) {
      console.error('Unable to validate replacement PDF:', validationError);
      setError(`${replacementFile.name}: ${validationError.message || 'This PDF could not be opened.'}`);
    } finally {
      isValidatingRef.current = false;
      setIsValidating(false);
    }
  }, [files]);

  useEffect(() => {
    const pendingFocus = pendingFocusRef.current;
    if (!pendingFocus) return;
    pendingFocusRef.current = null;
    const target = pendingFocus.action === 'upload'
      ? document.querySelector('[data-merge-upload]')
      : [...document.querySelectorAll(`[data-merge-file-${pendingFocus.action}]`)]
        .find((button) => button.getAttribute(`data-merge-file-${pendingFocus.action}`) === pendingFocus.id);
    target?.focus();
  }, [files]);

  const { getRootProps, getInputProps, open, isDragActive } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
    disabled: isValidating || isMerging || files.length >= MAX_FILES,
  });

  const {
    getInputProps: getReplaceInputProps,
    open: openReplace
  } = useAccessibleDropzone({
    onDrop: onReplaceDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxFiles: 1,
    disabled: isValidating || isMerging,
    noClick: true,
    noKeyboard: true
  });

  const replaceFile = (id) => {
    replaceTargetRef.current = id;
    openReplace();
  };

  const removeFile = (id) => {
    const index = files.findIndex((file) => file.id === id);
    const nextFile = files[index + 1] || files[index - 1];
    pendingFocusRef.current = nextFile
      ? { id: nextFile.id, action: 'remove' }
      : { action: 'upload' };
    const removedFile = files[index];
    setFiles(files.filter(f => f.id !== id));
    setSelectedPages((previous) => previous.filter((page) => page.fileId !== id));
    setPreviewImages((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
    setAnnouncement(`${removedFile?.name || 'PDF'} removed.`);
    setError(null);
    setOutputBytes(null);
    setSuccess(false);
  };

  const moveFile = (index, direction) => {
    const newFiles = [...files];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
    setAnnouncement(`${newFiles[targetIndex].name} moved to position ${targetIndex + 1} of ${files.length}.`);
    setOutputBytes(null);
    setSuccess(false);
  };

  const reorderFiles = (nextFiles) => {
    setFiles(nextFiles);
    setAnnouncement(`File order updated. ${nextFiles.map((file) => file.name).join(', ')}.`);
    setOutputBytes(null);
    setSuccess(false);
  };

  const toggleMergeMode = (mode) => {
    if (mode === 'select' && mergeMode !== 'select') setSelectedPages([]);
    setMergeMode(mode);
    setOutputBytes(null);
    setSuccess(false);
    setError(null);
  };

  const togglePageSelection = (fileEntry, pageIndex) => {
    const next = addPageToMergeOrder(selectedPages, { fileId: fileEntry.id, pageIndex });
    setSelectedPages(next);
    setOutputBytes(null);
    setSuccess(false);
    setError(null);
    const wasSelected = selectedPages.some((page) => page.fileId === fileEntry.id && page.pageIndex === pageIndex);
    setAnnouncement(`Page ${pageIndex + 1} ${wasSelected ? 'removed from' : 'added to'} the live output.`);
  };

  const selectVisiblePages = (fileId, count) => {
    setSelectedPages((previous) => {
      const next = [...previous];
      for (let pageIndex = 0; pageIndex < count; pageIndex += 1) {
        if (!next.some((page) => page.fileId === fileId && page.pageIndex === pageIndex)) {
          next.push({ fileId, pageIndex });
        }
      }
      return next;
    });
    setOutputBytes(null);
    setSuccess(false);
  };

  const clearFilePageSelection = (fileId) => {
    setSelectedPages((previous) => previous.filter((page) => page.fileId !== fileId));
    setOutputBytes(null);
    setSuccess(false);
  };

  const reorderSelectedPages = (nextPages) => {
    setSelectedPages(nextPages);
    setOutputBytes(null);
    setSuccess(false);
    setAnnouncement('Live output page order updated.');
  };

  const moveSelectedPage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= selectedPages.length) return;
    const next = [...selectedPages];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    reorderSelectedPages(next);
  };

  const handlePreviewsReady = useCallback((fileId, previews) => {
    setPreviewImages((previous) => ({ ...previous, [fileId]: previews }));
  }, []);

  const fileEntriesById = new Map(files.map((file) => [file.id, file]));
  let outputPageNumber = 0;
  const liveOutputItems = selectedPages.map((page, index) => {
    const fileEntry = fileEntriesById.get(page.fileId);
    const preview = previewImages[page.fileId]?.[page.pageIndex];
    const previousPage = selectedPages[index - 1];
    const blankBefore = Boolean(addBlankPages && previousPage && previousPage.fileId !== page.fileId);
    outputPageNumber += Number(blankBefore) + 1;
    return {
      ...page,
      key: `${page.fileId}:${page.pageIndex}`,
      fileEntry,
      preview,
      blankBefore,
      outputPageNumber
    };
  });
  const blankPageCount = liveOutputItems.filter((item) => item.blankBefore).length;

  const getOutputPageStyle = (preview) => {
    if (!preview) return undefined;
    if (pageSize === 'preserve') {
      return { aspectRatio: `${preview.width} / ${preview.height}` };
    }
    const fitted = getFitPageDimensions(preview.width, preview.height, pageSize);
    return { aspectRatio: `${fitted.pageWidth} / ${fitted.pageHeight}` };
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError("Please add at least 2 PDF files to merge.");
      return;
    }
    if (mergeMode === 'select' && selectedPages.length === 0) {
      setError('Select at least one page in Select pages mode.');
      return;
    }

    setIsMerging(true);
    setAnnouncement('');
    setError(null);
    setSuccess(false);
    setOutputBytes(null);

    try {
      const normalizedFileName = normalizePdfFileName(outputFileName);
      const pdfBytes = await buildMergedPdf({
        files,
        mode: mergeMode,
        selectedPages,
        addBlankPages,
        addBookmarks: addSourceBookmarks,
        pageSize
      });
      setOutputFileName(normalizedFileName);
      setOutputBytes(pdfBytes);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'An error occurred while merging the PDFs. Please ensure they are valid PDF files.');
    } finally {
      setIsMerging(false);
    }
  };

  const downloadMergedPdf = (downloadFileName) => {
    if (!outputBytes) return;
    const url = URL.createObjectURL(new Blob([outputBytes], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFileName || normalizePdfFileName(outputFileName);
    link.click();
    markOutputDownloaded();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const uploadZone = (
    <div
      {...getRootProps({ role: 'group', 'aria-label': 'Choose PDF files to merge', 'data-merge-upload': '' })}
      className={`
        pdf-workflow-upload merge-pdf-upload-zone border-2 border-dashed rounded-2xl cursor-pointer transition-all
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
        ${files.length >= MAX_FILES ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps({ 'aria-label': 'Choose PDF files to merge' })} />
      <input {...getReplaceInputProps()} />
      <div className="merge-pdf-upload-content">
        <div className="pdf-upload-icon" aria-hidden="true">
          {isValidating
            ? <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            : <Upload className="w-6 h-6 text-blue-600" />}
        </div>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
        <div className="merge-pdf-upload-copy">
          <h3 aria-live="polite" aria-atomic="true">
            {isDragActive
              ? 'Drop the PDFs here'
              : isValidating
                ? 'Checking selected PDFs...'
                : files.length >= MAX_FILES
                  ? `Limit reached (max ${MAX_FILES})`
                  : 'Choose or drop PDFs to merge'}
          </h3>
          <p>Combine PDFs into a single document in your chosen order.</p>
        </div>
        <button
          type="button"
          className="pdf-editor-primary-button merge-pdf-upload-button"
          onClick={(event) => {
            event.stopPropagation();
            open();
          }}
          disabled={isValidating || isMerging || files.length >= MAX_FILES}
        >
          Choose Up to 5 PDFs
        </button>
      </div>
    </div>
  );

  return (
    <div className="pdf-tool-workflow space-y-8">
      {files.length === 0 && uploadZone}

      {/* File List */}
      {files.length > 0 && (
        <>
        <div className="pdf-workflow-selected space-y-3">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Files to merge ({files.length}/{MAX_FILES})
            </h4>
          </div>
          
          <Reorder.Group axis="y" values={files} onReorder={reorderFiles} className="space-y-3">
            {files.map((fileObj, index) => (
              <Reorder.Item 
                key={fileObj.id} 
                value={fileObj}
                className="pdf-attached-file-card group relative flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <AttachedFileIcon />
                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-700 truncate">{fileObj.name}</p>
                    <p className="text-xs text-slate-400">{fileObj.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Move controls for mobile/non-drag users */}
                  <div className="flex flex-col mr-2 border-r border-slate-100 pr-2">
                    <button
                      type="button"
                      aria-label={`Move ${fileObj.name} up`}
                      onClick={() => moveFile(index, -1)}
                      disabled={isMerging || index === 0}
                      className="p-1 hover:bg-slate-100 rounded disabled:opacity-20"
                    >
                      <ChevronUp className="w-4 h-4 text-slate-500" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Move ${fileObj.name} down`}
                      onClick={() => moveFile(index, 1)}
                      disabled={isMerging || index === files.length - 1}
                      className="p-1 hover:bg-slate-100 rounded disabled:opacity-20"
                    >
                      <ChevronDown className="w-4 h-4 text-slate-500" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    aria-label={`Replace ${fileObj.name}`}
                    title={`Replace ${fileObj.name}`}
                    data-merge-file-replace={fileObj.id}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => replaceFile(fileObj.id)}
                    disabled={isValidating || isMerging}
                    className="pdf-attached-file-action is-replace disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RefreshCw className="w-5 h-5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    aria-label={`Remove ${fileObj.name}`}
                    title={`Remove ${fileObj.name}`}
                    data-merge-file-remove={fileObj.id}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => removeFile(fileObj.id)}
                    disabled={isValidating || isMerging}
                    className="pdf-attached-file-action is-remove disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        {uploadZone}

        <section className="merge-pdf-settings space-y-6" aria-label="Merge options">
          <div className="merge-mode-switch" role="group" aria-label="Choose merge mode">
            <button
              type="button"
              aria-pressed={mergeMode === 'all'}
              onClick={() => toggleMergeMode('all')}
              disabled={isMerging}
            >
              Merge all pages
            </button>
            <button
              type="button"
              aria-pressed={mergeMode === 'select'}
              onClick={() => toggleMergeMode('select')}
              disabled={isMerging}
            >
              Select pages
            </button>
          </div>

          {mergeMode === 'select' && (
            <div className="merge-page-selection-workspace">
              <div className="merge-section-heading">
                <div>
                  <h3>Select pages</h3>
                  <p>Click pages to add them to the live output in that order. New selections start empty.</p>
                </div>
                <p className="merge-page-count-summary" aria-live="polite">
                  {selectedPages.length} pages selected
                </p>
              </div>
              <div className="merge-source-page-pickers">
                {files.map((fileEntry) => (
                  <PdfMergePagePicker
                    key={fileEntry.id}
                    fileEntry={fileEntry}
                    selectedPages={selectedPages}
                    onTogglePage={togglePageSelection}
                    onSelectVisible={selectVisiblePages}
                    onClear={clearFilePageSelection}
                    onPreviewsReady={handlePreviewsReady}
                    disabled={isMerging}
                  />
                ))}
              </div>

              <section className="merge-live-output" aria-labelledby="merge-live-output-heading">
                <div className="merge-section-heading">
                  <div>
                    <h3 id="merge-live-output-heading">Live output preview</h3>
                    <p>Pages are shown in the order they will appear. Drag to reorder, or use the move buttons.</p>
                  </div>
                  <p className="merge-page-count-summary">
                    {selectedPages.length + blankPageCount} output pages
                  </p>
                </div>
                {selectedPages.length === 0 ? (
                  <p className="merge-live-output-empty">Select a page above to start building the output.</p>
                ) : (
                  <Reorder.Group
                    axis="x"
                    values={selectedPages}
                    onReorder={reorderSelectedPages}
                    className="merge-live-output-list"
                    aria-label="Pages in merged output order"
                  >
                    {liveOutputItems.map((item, index) => (
                      <Reorder.Item
                        key={item.key}
                        value={selectedPages[index]}
                        dragListener={!isMerging}
                        className="merge-live-output-item"
                      >
                        <div className={`merge-live-blank-slot${addBlankPages ? ' is-enabled' : ''}`}>
                          {item.blankBefore && (
                            <span className="merge-live-blank-before" aria-label="A blank page will be inserted before this page">
                              Blank page
                            </span>
                          )}
                        </div>
                        <div className="merge-live-output-page">
                          <div className="merge-live-output-page-number">Output page {item.outputPageNumber}</div>
                          <div className="merge-live-output-image" style={getOutputPageStyle(item.preview)}>
                            {item.preview
                              ? <img src={item.preview.preview} alt="" draggable={false} />
                              : <span>Rendering preview…</span>}
                          </div>
                          <p className="merge-live-output-source" title={`${item.fileEntry?.name || 'PDF'}, page ${item.pageIndex + 1}`}>
                            {item.fileEntry?.name || 'PDF'} · Page {item.pageIndex + 1}
                          </p>
                          <div className="merge-live-output-actions">
                            <button
                              type="button"
                              aria-label={`Move output page ${index + 1} up`}
                              onClick={() => moveSelectedPage(index, -1)}
                              disabled={isMerging || index === 0}
                            >
                              <ChevronUp className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Move output page ${index + 1} down`}
                              onClick={() => moveSelectedPage(index, 1)}
                              disabled={isMerging || index === selectedPages.length - 1}
                            >
                              <ChevronDown className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Remove page ${item.pageIndex + 1} from ${item.fileEntry?.name || 'PDF'} output`}
                              onClick={() => item.fileEntry && togglePageSelection(item.fileEntry, item.pageIndex)}
                              disabled={isMerging}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                )}
              </section>
            </div>
          )}

          <div className="merge-output-settings">
            <div className="merge-option-field">
              <label htmlFor="merge-output-filename">Output filename</label>
              <input
                id="merge-output-filename"
                type="text"
                value={outputFileName}
                disabled={isMerging}
                onChange={(event) => {
                  setOutputFileName(event.target.value);
                  setOutputBytes(null);
                  setSuccess(false);
                }}
                maxLength={120}
                autoComplete="off"
              />
              <p>The .pdf extension is added automatically when needed.</p>
            </div>
            <div className="merge-option-field">
              <label htmlFor="merge-page-size">Page size</label>
              <select
                id="merge-page-size"
                value={pageSize}
                disabled={isMerging}
                onChange={(event) => {
                  setPageSize(event.target.value);
                  setOutputBytes(null);
                  setSuccess(false);
                }}
              >
                <option value="preserve">Preserve original page sizes</option>
                <option value="letter">Fit to US Letter</option>
                <option value="a4">Fit to A4</option>
              </select>
              <p>Fitting centers and scales page content proportionally without cropping. Some interactive PDF features may not carry over; preserve original sizes when they matter.</p>
            </div>
            <label className="merge-option-checkbox">
              <input
                type="checkbox"
                checked={addSourceBookmarks}
                disabled={isMerging}
                onChange={(event) => {
                  setAddSourceBookmarks(event.target.checked);
                  setOutputBytes(null);
                  setSuccess(false);
                }}
              />
              <span>
                <strong>Bookmark each source file</strong>
                <small>Add a PDF outline entry at the first page from each source document.</small>
              </span>
            </label>
            <label className="merge-option-checkbox">
              <input
                type="checkbox"
                checked={addBlankPages}
                disabled={isMerging}
                onChange={(event) => {
                  setAddBlankPages(event.target.checked);
                  setOutputBytes(null);
                  setSuccess(false);
                }}
              />
              <span>
                <strong>Insert a blank page between source files</strong>
                <small>In Select pages mode, a blank is inserted whenever the output switches to a different source file.</small>
              </span>
            </label>
          </div>
        </section>

        <div className="pdf-workflow-actions pt-4">
            <button
              type="button"
              onClick={mergePdfs}
              disabled={isMerging || files.length < 2 || (mergeMode === 'select' && selectedPages.length === 0)}
              className={`
                w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white transition-all
                ${isMerging || files.length < 2 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98]'}
              `}
            >
              {isMerging ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Merging...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Merge PDFs
                </>
              )}
            </button>
            {isMerging && <p className="sr-only" role="status">Merging the selected PDFs.</p>}
            {success && outputBytes && (
              <DownloadReadyCard
                fileName={normalizePdfFileName(outputFileName)}
                sizeBytes={outputBytes.length}
                onDownload={downloadMergedPdf}
                downloadLabel="Download PDF"
              />
            )}
          </div>
        </>
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

    </div>
  );
};

export default PdfMerger;
