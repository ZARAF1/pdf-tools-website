import React, { useState, useCallback } from 'react';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { PDFDocument, degrees } from 'pdf-lib';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Download, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  RotateCw,
  RotateCcw,
  Settings2
} from 'lucide-react';

const PdfRotator = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState('all'); // 'all' or 'selected'
  const [rotationAngle, setRotationAngle] = useState(0);
  const [rangeInput, setRangeInput] = useState('');
  const [outputBytes, setOutputBytes] = useState(null);

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    setError(null);
    setSuccess(false);
    setOutputBytes(null);

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
      console.error('Unable to validate PDF for rotation:', validationError);
      setError(validationError.message || 'This PDF is invalid or could not be opened.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const removeFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setOutputBytes(null);
    setRangeInput('');
    setRotationAngle(0);
  };

  const parseRanges = (input, maxPages) => {
    const pages = new Set();
    const parts = input.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

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
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleRotate = async () => {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setOutputBytes(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();

      let pagesToRotate = [];
      if (mode === 'all') {
        pagesToRotate = Array.from({ length: pageCount }, (_, i) => i);
      } else {
        const selectedPages = parseRanges(rangeInput, pageCount);
        if (selectedPages.length === 0) {
          throw new Error("Please enter at least one valid page or range.");
        }
        pagesToRotate = selectedPages.map(p => p - 1);
      }

      for (const index of pagesToRotate) {
        const page = pdfDoc.getPage(index);
        const currentRotation = page.getRotation().angle;
        // Apply rotation relative to current orientation
        page.setRotation(degrees(currentRotation + rotationAngle));
      }

      const pdfBytes = await pdfDoc.save();
      setOutputBytes(pdfBytes);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred during rotation.");
    } finally {
      setIsProcessing(false);
    }
  };

  const outputName = `rotated_${file?.name || 'document.pdf'}`;
  const downloadRotatedPdf = () => {
    if (!outputBytes) return;
    const url = URL.createObjectURL(new Blob([outputBytes], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = outputName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="space-y-8">
      {!file ? (
        <div 
          {...getRootProps()} 
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <div className="bg-amber-100 p-4 rounded-full mb-4">
              <Upload className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">Click or drag PDF here to upload</h3>
            <p className="text-slate-500 mt-1">Single PDF file</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <div className="truncate max-w-[200px] md:max-w-sm">
                <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              type="button"
              aria-label={`Remove ${file.name}`}
              onClick={removeFile}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <Settings2 className="w-5 h-5 text-slate-400" />
              <h3 className="font-semibold text-slate-700">Rotation Settings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rotation Angle Selection */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-slate-700">Rotation Angle</legend>
                <div className="flex flex-wrap gap-2">
                  {[90, 180, 270].map((angle) => (
                    <button
                      type="button"
                      key={angle}
                      onClick={() => setRotationAngle(angle)}
                      aria-pressed={rotationAngle === angle}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        rotationAngle === angle 
                        ? 'bg-amber-500 text-white shadow-md' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {angle}° {rotationAngle === angle && <CheckCircle2 className="inline ml-1 w-4 h-4" />}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setRotationAngle(0)}
                    aria-pressed={rotationAngle === 0}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      rotationAngle === 0 
                      ? 'bg-slate-800 text-white shadow-md' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Reset
                  </button>
                </div>
              </fieldset>

              {/* Mode Selection */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-slate-700">Apply To</legend>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('all')}
                    aria-pressed={mode === 'all'}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      mode === 'all' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    All Pages
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('selected')}
                    aria-pressed={mode === 'selected'}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      mode === 'selected' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    Selected Pages
                  </button>
                  </div>
                </fieldset>
            </div>

            {mode === 'selected' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <label htmlFor="rotate-page-ranges" className="text-sm font-semibold text-slate-700">Page Numbers / Ranges</label>
                <input
                  id="rotate-page-ranges"
                  type="text"
                  placeholder="e.g. 1-3, 5"
                  aria-describedby="rotate-page-ranges-help"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                />
                <p id="rotate-page-ranges-help" className="text-xs text-slate-500">Separate with commas. Example: 1-3, 5</p>
              </motion.div>
            )}

            <button
              type="button"
              onClick={handleRotate}
              disabled={isProcessing || rotationAngle === 0}
              className={`
                w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white transition-all
                ${isProcessing ? 'bg-slate-300 cursor-not-allowed' : rotationAngle === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-200 active:scale-[0.98]'}
              `}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RotateCw className="w-5 h-5" />
                  Rotate PDF
                </>
              )}
            </button>
            {isProcessing && <p className="sr-only" role="status">Rotating your PDF.</p>}
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
            <span className="text-sm font-medium">{outputName} is ready. Click to download.</span>
            <button type="button" onClick={downloadRotatedPdf} className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700">
              <Download className="h-4 w-4" aria-hidden="true" /> Download PDF
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PdfRotator;
