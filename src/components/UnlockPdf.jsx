import React, { useCallback, useState } from 'react';
import { decryptPDF, isEncrypted } from '@pdfsmaller/pdf-decrypt';
import { PDFDocument } from 'pdf-lib';
import pdfjsLib from '../lib/pdfjsClient';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Trash2,
  Unlock,
  Upload
} from 'lucide-react';

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getErrorMessage = (error) => {
  const message = error?.message || '';
  if (message.includes('Incorrect password')) {
    return 'That password did not unlock this PDF. Check it and try again.';
  }
  if (message.includes('Unsupported encryption')) {
    return 'This PDF uses unsupported encryption. Unlock supports AES-256 R6 and legacy RC4 R2/R3; AES-128 R4 and other encryption types are not supported.';
  }
  if (message.includes('not encrypted')) {
    return 'This PDF is not password-protected, so there is nothing to unlock.';
  }
  return 'This file could not be read as a supported PDF. Check that it is a valid PDF and try again.';
};

const UnlockPdf = () => {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [algorithm, setAlgorithm] = useState('');
  const [password, setPassword] = useState('');
  const [outputBytes, setOutputBytes] = useState(null);
  const [outputName, setOutputName] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles, rejections) => {
    setError('');
    setFile(null);
    setPageCount(0);
    setAlgorithm('');
    setPassword('');
    setOutputBytes(null);
    setOutputName('');

    if (rejections.length > 0) {
      setError('Choose one valid PDF file.');
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setIsValidating(true);
    try {
      const inputBytes = new Uint8Array(await selectedFile.arrayBuffer());
      const encryptionInfo = await isEncrypted(inputBytes);
      if (!encryptionInfo.encrypted) {
        throw new Error('This PDF is not encrypted.');
      }

      setFile(selectedFile);
      setAlgorithm(encryptionInfo.algorithm);
    } catch (validationError) {
      setError(getErrorMessage(validationError));
    } finally {
      setIsValidating(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isValidating || isProcessing,
    noClick: Boolean(file)
  });

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setAlgorithm('');
    setPassword('');
    setOutputBytes(null);
    setOutputName('');
    setError('');
  };

  const unlockPdf = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Choose a password-protected PDF first.');
      return;
    }
    if (!password) {
      setError('Enter the password you are authorized to use for this PDF.');
      return;
    }

    const suppliedPassword = password;
    setIsProcessing(true);
    setError('');
    setOutputBytes(null);
    setOutputName('');

    try {
      const inputBytes = new Uint8Array(await file.arrayBuffer());
      const decryptedBytes = await decryptPDF(inputBytes, suppliedPassword);
      const sourceLoadingTask = pdfjsLib.getDocument({
        data: inputBytes,
        password: suppliedPassword
      });
      let sourcePageCount;
      try {
        const sourcePdf = await sourceLoadingTask.promise;
        sourcePageCount = sourcePdf.numPages;
      } finally {
        await sourceLoadingTask.destroy().catch((destroyError) => {
          console.error('Unable to release the source PDF validation task:', destroyError);
        });
      }

      const outputPdf = await PDFDocument.load(decryptedBytes, { updateMetadata: false });

      if (outputPdf.isEncrypted) {
        throw new Error('The output is still encrypted.');
      }
      if (outputPdf.getPageCount() !== sourcePageCount) {
        throw new Error('The unlocked PDF did not retain the original page count.');
      }

      const baseName = file.name.replace(/\.pdf$/i, '') || 'document';
      setOutputBytes(decryptedBytes);
      setOutputName(`${baseName}_unlocked.pdf`);
      setPageCount(sourcePageCount);
    } catch (unlockError) {
      setError(getErrorMessage(unlockError));
    } finally {
      setPassword('');
      setIsProcessing(false);
    }
  };

  const downloadOutput = () => {
    if (!outputBytes) return;
    const url = URL.createObjectURL(new Blob([outputBytes], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = outputName;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {!file ? (
        <section
          {...getRootProps({
            role: 'group',
            'aria-label': 'Choose a password-protected PDF',
            className: `pdf-upload-trigger pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone protect-extract-upload-zone w-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
            } ${isValidating ? 'cursor-wait opacity-70' : ''}`
          })}
        >
          <input {...getInputProps()} />
          <div className="merge-pdf-upload-content">
            <div className="pdf-upload-icon" aria-hidden="true">
              {isValidating
                ? <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                : <Upload className="h-6 w-6 text-blue-600" />}
            </div>
            <div className="merge-pdf-upload-copy">
              <h3 aria-live="polite">
                {isValidating
                  ? 'Checking PDF encryption…'
                  : isDragActive
                    ? 'Drop the password-protected PDF here'
                    : 'Choose or drop a password-protected PDF'}
              </h3>
              <p>One password-protected PDF · processed in your browser</p>
            </div>
            <button
              type="button"
              className="pdf-editor-primary-button merge-pdf-upload-button"
              onClick={(event) => {
                event.stopPropagation();
                open();
              }}
              disabled={isValidating || isProcessing}
            >
              Choose PDF
            </button>
          </div>
        </section>
      ) : (
        <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <FileText className="h-8 w-8 shrink-0 text-blue-600" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-800">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)} · {algorithm}{pageCount > 0 ? ` · ${pageCount} ${pageCount === 1 ? 'page' : 'pages'}` : ''}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            disabled={isProcessing}
            aria-label="Remove selected PDF"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Remove PDF
          </button>
        </section>
      )}

      {file && (
        <form onSubmit={unlockPdf} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-2">
            <label htmlFor="unlock-pdf-password" className="block text-sm font-semibold text-slate-800">
              PDF opening password
            </label>
            <input
              id="unlock-pdf-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setOutputBytes(null);
                setOutputName('');
                setError('');
              }}
              disabled={isProcessing}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-60"
              placeholder="Enter the correct password"
            />
            <p className="text-sm text-slate-500">
              Only use a password you are authorized to use. This tool does not guess or recover passwords.
            </p>
          </div>

          <div className="site-surface rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
            Decryption happens in your browser. The PDF and password are not uploaded to a processing server.
            Supported encryption: AES-256 R6 and legacy RC4 R2/R3. AES-128 R4 is not supported.
          </div>

          <button
            type="submit"
            disabled={isProcessing || !password}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Unlock className="h-5 w-5" aria-hidden="true" />}
            {isProcessing ? 'Unlocking PDF…' : 'Unlock PDF'}
          </button>
        </form>
      )}

      {isProcessing && <p className="text-sm text-blue-700" role="status" aria-live="polite">Checking the password, decrypting, and verifying the new PDF…</p>}
      {error && (
        <p className="site-surface flex items-start gap-2 rounded-xl border border-slate-200 p-4 text-sm text-slate-800" role="alert">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
      {outputBytes && (
        <section className="site-surface flex flex-col gap-3 rounded-2xl border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 font-semibold text-slate-800" role="status">
            <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden="true" />
            {outputName} is ready. Verified as an unencrypted {pageCount}-page PDF.
          </p>
          <button
            type="button"
            onClick={downloadOutput}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            <Download className="h-5 w-5" aria-hidden="true" />
            Download unlocked PDF
          </button>
        </section>
      )}
    </div>
  );
};

export default UnlockPdf;
