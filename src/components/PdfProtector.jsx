import React, { useState, useCallback } from 'react';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  Trash2,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const PdfProtector = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
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
      console.error('Unable to validate PDF for protection:', validationError);
      setError(validationError.message || 'This PDF is invalid or could not be opened.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setPassword('');
    setConfirmPassword('');
    setOwnerPassword('');
    setError(null);
    setSuccess(false);
    setOutputBytes(null);
  };

  const protectPdf = async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }
    if (!password) {
      setError('Please enter a password to protect your document.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setOutputBytes(null);

    try {
      const srcDoc = await validateUnencryptedPdf(file);

      const filled = await srcDoc.save();

      const options = {
        algorithm: 'AES-256',
        ownerPassword: ownerPassword || password,
        allowPrinting: true,
        allowModifying: false,
        allowCopying: false,
        allowAnnotating: false,
        allowFillingForms: false,
        allowExtraction: false,
        allowAssembly: false,
        allowHighQualityPrint: true,
      };

      const encryptedBytes = await encryptPDF(new Uint8Array(filled), password, options);
      setOutputBytes(encryptedBytes);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      if (err?.code === 'UNSUPPORTED_PASSWORD_CHARACTER' ||
          err?.code === 'PROHIBITED_PASSWORD_CHARACTER' ||
          err?.code === 'UNSTABLE_PASSWORD_CHARACTER' ||
          err?.code === 'BIDIRECTIONAL_PASSWORD') {
        setError('This password cannot be used (unsupported characters). Try letters, numbers, and basic symbols like ! @ # $ % ^ & * .');
      } else {
        setError(err.message || 'An error occurred while protecting the PDF. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const outputName = `protected_${file?.name || 'document.pdf'}`;
  const downloadProtectedPdf = () => {
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
      {/* Upload Zone */}
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
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">Click or drag a PDF here to upload</h3>
            <p className="text-slate-500 mt-1">Single PDF file</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" />
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
            <div className="flex gap-4 border-b border-slate-100 pb-4">
              <h3 className="pt-2 text-lg font-semibold text-slate-800">Secure your document</h3>
            </div>

            <div className="space-y-2">
              <label htmlFor="protect-password" className="text-sm font-semibold text-slate-700">Password</label>
              <input
                id="protect-password"
                type="password"
                value={password}
                required
                minLength={4}
                aria-describedby="protect-password-help"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set a password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
              <p id="protect-password-help" className="text-xs text-slate-500">
                Required to open the PDF. You will need this to view or unlock the file.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="protect-confirm-password" className="text-sm font-semibold text-slate-700">Confirm password</label>
              <input
                id="protect-confirm-password"
                type="password"
                value={confirmPassword}
                required
                minLength={4}
                aria-describedby="protect-confirm-password-help"
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter the password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
              <p id="protect-confirm-password-help" className="text-xs text-slate-500">Enter the same password again.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="protect-owner-password" className="text-sm font-semibold text-slate-700">Owner password <span className="text-slate-400">(optional)</span></label>
              <input
                id="protect-owner-password"
                type="password"
                value={ownerPassword}
                aria-describedby="protect-owner-password-help"
                onChange={(e) => setOwnerPassword(e.target.value)}
                placeholder="Leave empty to use the same password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
              <p id="protect-owner-password-help" className="text-xs text-slate-500">
                Manages permissions. Leaving it empty uses the same password for both.
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-red-800 text-sm">
              Encryption is performed in your browser; the PDF and password are not uploaded to a processing server. AES-256 encryption with restricted permissions (printing, copying, and editing disabled).
            </div>

            <button
              type="button"
              onClick={protectPdf}
              disabled={isProcessing}
              className={`
                w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white transition-all
                ${isProcessing ? 'bg-slate-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 active:scale-[0.98]'}
              `}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Encrypting...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Protect PDF
                </>
              )}
            </button>
            {isProcessing && <p className="sr-only" role="status">Encrypting your PDF.</p>}
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
            <button type="button" onClick={downloadProtectedPdf} className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700">
              Download Protected PDF
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PdfProtector;
