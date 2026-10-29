import React, { useState, useCallback, useEffect, useRef } from 'react';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { PDFDocument } from 'pdf-lib';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import { motion, Reorder } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Download, 
  Loader2, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const MAX_FILES = 5;

const PdfMerger = () => {
  const [files, setFiles] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [outputBytes, setOutputBytes] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const isValidatingRef = useRef(false);
  const pendingFocusRef = useRef(null);

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
          await validateUnencryptedPdf(file);
          validatedFiles.push(file);
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
          ...validatedFiles.map((file) => ({
            file,
            id: Math.random().toString(36).substring(7),
            name: file.name,
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

  useEffect(() => {
    const pendingFocus = pendingFocusRef.current;
    if (!pendingFocus) return;
    pendingFocusRef.current = null;
    const target = pendingFocus === 'upload'
      ? document.querySelector('[data-merge-upload]')
      : [...document.querySelectorAll('[data-merge-file-remove]')]
        .find((button) => button.dataset.mergeFileRemove === pendingFocus);
    target?.focus();
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
    disabled: isValidating || files.length >= MAX_FILES,
  });

  const removeFile = (id) => {
    const index = files.findIndex((file) => file.id === id);
    const nextFile = files[index + 1] || files[index - 1];
    pendingFocusRef.current = nextFile?.id || 'upload';
    const removedFile = files[index];
    setFiles(files.filter(f => f.id !== id));
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
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError("Please add at least 2 PDF files to merge.");
      return;
    }

    setIsMerging(true);
    setAnnouncement('');
    setError(null);
    setSuccess(false);
    setOutputBytes(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const fileObj of files) {
        const pdf = await validateUnencryptedPdf(fileObj.file);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      setOutputBytes(pdfBytes);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err?.message?.startsWith('Password-protected PDFs')
        ? err.message
        : 'An error occurred while merging the PDFs. Please ensure they are valid PDF files.');
    } finally {
      setIsMerging(false);
    }
  };

  const downloadMergedPdf = () => {
    if (!outputBytes) return;
    const url = URL.createObjectURL(new Blob([outputBytes], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'merged_document.pdf';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <div 
        {...getRootProps({ 'aria-label': 'Choose PDF files to merge', 'data-merge-upload': '' })}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
          ${files.length >= MAX_FILES ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps({ 'aria-label': 'Choose PDF files to merge' })} />
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
          <h3 className="text-lg font-semibold text-slate-700" aria-live="polite" aria-atomic="true">
            {isValidating
              ? 'Checking selected PDFs...'
              : files.length >= MAX_FILES
                ? `Limit reached (max ${MAX_FILES})`
                : 'Click or drag PDFs here to upload'}
          </h3>
          <p className="text-slate-500 mt-1">Up to {MAX_FILES} PDF files supported</p>
        </div>
      </div>

      {/* Error/Success Messages */}
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
          <span className="text-sm font-medium">PDFs merged successfully. Your output is ready to download below.</span>
        </motion.div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
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
                className="group relative flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <FileText className="w-6 h-6 text-slate-500" />
                  </div>
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
                      disabled={index === 0}
                      className="p-1 hover:bg-slate-100 rounded disabled:opacity-20"
                    >
                      <ChevronUp className="w-4 h-4 text-slate-500" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Move ${fileObj.name} down`}
                      onClick={() => moveFile(index, 1)}
                      disabled={index === files.length - 1}
                      className="p-1 hover:bg-slate-100 rounded disabled:opacity-20"
                    >
                      <ChevronDown className="w-4 h-4 text-slate-500" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${fileObj.name}`}
                    data-merge-file-remove={fileObj.id}
                    onClick={() => removeFile(fileObj.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <div className="pt-4">
            <button
              type="button"
              onClick={mergePdfs}
              disabled={isMerging || files.length < 2}
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
              <div role="group" aria-label="Merged PDF download" className="mt-4 flex flex-col gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-5 w-5" aria-hidden="true" /> merged_document.pdf is ready ({(outputBytes.length / 1024).toFixed(1)} KB)</span>
                <button type="button" onClick={downloadMergedPdf} className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700">
                  <Download className="h-4 w-4" aria-hidden="true" /> Download PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfMerger;
