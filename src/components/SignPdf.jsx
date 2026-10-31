import React, { useCallback, useRef, useState } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { FILE_DOWNLOAD_READY_MESSAGE } from '../lib/toolMessages.mjs';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { CheckCircle2, Download, Loader2, PenLine, Trash2, Upload } from 'lucide-react';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';

const parsePages = (input, pageCount) => {
  const value = input.trim();
  if (!value) throw new Error('Enter one or more page numbers or ranges.');
  const pages = new Set();
  for (const part of value.split(',')) {
    const token = part.trim();
    if (!token) throw new Error('Page selections cannot contain empty entries.');
    const range = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (start < 1 || end > pageCount) throw new Error(`Page ranges must be between 1 and ${pageCount}.`);
      if (start > end) throw new Error(`The page range "${token}" is reversed.`);
      for (let page = start; page <= end; page += 1) pages.add(page);
      continue;
    }
    if (!/^\d+$/.test(token)) throw new Error(`"${token}" is not a valid page number or range.`);
    const page = Number(token);
    if (page < 1 || page > pageCount) throw new Error(`Page numbers must be between 1 and ${pageCount}.`);
    pages.add(page);
  }
  if (!pages.size) throw new Error('Select at least one page.');
  return [...pages].sort((a, b) => a - b);
};

const decodeCanvasPng = (dataUrl) => {
  const binary = window.atob(dataUrl.split(',')[1]);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const SignPdf = () => {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [signatureMode, setSignatureMode] = useState('type');
  const [signatureText, setSignatureText] = useState('');
  const [signatureFont, setSignatureFont] = useState('HelveticaOblique');
  const [signatureImage, setSignatureImage] = useState(null);
  useToolExitGuard(Boolean(file || signatureImage));
  const [signatureImageFormat, setSignatureImageFormat] = useState('');
  const [signatureImageName, setSignatureImageName] = useState('');
  const [selectionMode, setSelectionMode] = useState('all');
  const [pageSelection, setPageSelection] = useState('1');
  const [placement, setPlacement] = useState('bottom-right');
  const [signatureWidth, setSignatureWidth] = useState(180);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const requestId = useRef(0);

  const onDrop = useCallback(async (acceptedFiles, rejections) => {
    setError('');
    setOutput(null);
    if (rejections.length) {
      setError('Please choose one valid PDF file.');
      return;
    }
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;
    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;
    setIsLoading(true);
    try {
      const source = await validateUnencryptedPdf(selectedFile);
      if (!source.getPageCount()) throw new Error('This PDF does not contain any pages.');
      if (requestId.current === currentRequest) {
        setFile(selectedFile);
        setPageCount(source.getPageCount());
      }
    } catch (loadError) {
      console.error('Unable to load PDF for signing:', loadError);
      if (requestId.current === currentRequest) setError(loadError.message || 'This PDF is invalid or could not be opened.');
    } finally {
      if (requestId.current === currentRequest) setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isLoading || isProcessing,
    noClick: Boolean(file),
    noKeyboard: Boolean(file)
  });

  const reset = () => {
    requestId.current += 1;
    setFile(null);
    setPageCount(0);
    setIsLoading(false);
    setOutput(null);
    setError('');
    setSignatureMode('type');
    setSignatureText('');
    setSignatureFont('HelveticaOblique');
    setSignatureImage(null);
    setSignatureImageFormat('');
    setSignatureImageName('');
    setSelectionMode('all');
    setPageSelection('1');
    setPlacement('bottom-right');
    setSignatureWidth(180);
    drawing.current = false;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const removeFile = () => {
    requestId.current += 1;
    setFile(null);
    setPageCount(0);
    setIsLoading(false);
    setOutput(null);
    setError('');
  };

  const updateSetting = (setter) => (event) => {
    setter(event.target.value);
    setOutput(null);
    setError('');
  };

  const drawAt = (event, begin) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const x = (event.clientX - bounds.left) * (canvas.width / bounds.width);
    const y = (event.clientY - bounds.top) * (canvas.height / bounds.height);
    const context = canvas.getContext('2d');
    if (!context) return;
    if (begin) {
      drawing.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      context.beginPath();
      context.moveTo(x, y);
    } else if (drawing.current) {
      context.lineTo(x, y);
      context.strokeStyle = '#111827';
      context.lineWidth = 4;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.stroke();
    }
    setOutput(null);
  };

  const clearDrawing = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
    setOutput(null);
    setError('');
  };

  const handleSignatureImage = async (event) => {
    const imageFile = event.target.files?.[0];
    setSignatureImage(null);
    setSignatureImageFormat('');
    setSignatureImageName('');
    setOutput(null);
    setError('');
    if (!imageFile) return;
    if (!['image/png', 'image/jpeg'].includes(imageFile.type)) {
      setError('Choose a PNG or JPEG signature image.');
      event.target.value = '';
      return;
    }
    try {
      setSignatureImage(new Uint8Array(await imageFile.arrayBuffer()));
      setSignatureImageFormat(imageFile.type);
      setSignatureImageName(imageFile.name);
    } catch (readError) {
      console.error('Unable to read signature image:', readError);
      setError('The selected signature image could not be read.');
    }
  };

  const createSignedPdf = async () => {
    if (!file) {
      setError('Choose a PDF before adding a signature.');
      return;
    }
    if (signatureMode === 'type' && !signatureText.trim()) {
      setError('Enter the signature text.');
      return;
    }
    if (signatureMode === 'image' && !signatureImage) {
      setError('Choose a PNG or JPEG signature image.');
      return;
    }
    const canvas = canvasRef.current;
    if (signatureMode === 'draw' && (!canvas || !canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height).data.some((value, index) => index % 4 === 3 && value > 0))) {
      setError('Draw a signature before creating the signed PDF.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setOutput(null);
    try {
      const document = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
      if (document.isEncrypted) throw new Error('Password-protected PDFs are not supported.');
      const selectedPages = selectionMode === 'all'
        ? Array.from({ length: pageCount }, (_, index) => index + 1)
        : parsePages(pageSelection, pageCount);

      let embeddedImage;
      let font;
      if (signatureMode === 'image') {
        embeddedImage = signatureImageFormat === 'image/png'
          ? await document.embedPng(signatureImage)
          : await document.embedJpg(signatureImage);
      } else if (signatureMode === 'draw') {
        embeddedImage = await document.embedPng(decodeCanvasPng(canvas.toDataURL('image/png')));
      } else {
        const fontMap = {
          HelveticaOblique: StandardFonts.HelveticaOblique,
          TimesRomanItalic: StandardFonts.TimesRomanItalic
        };
        font = await document.embedFont(fontMap[signatureFont]);
      }

      for (const pageNumber of selectedPages) {
        const page = document.getPage(pageNumber - 1);
        const pageWidth = page.getWidth();
        const maxWidth = Math.min(Number(signatureWidth), Math.max(40, pageWidth - 48));
        const x = placement === 'bottom-left' ? 24 : placement === 'bottom-center' ? (pageWidth - maxWidth) / 2 : pageWidth - maxWidth - 24;
        if (embeddedImage) {
          const scale = Math.min(maxWidth / embeddedImage.width, 72 / embeddedImage.height);
          const width = embeddedImage.width * scale;
          const height = embeddedImage.height * scale;
          page.drawImage(embeddedImage, { x: x + (maxWidth - width) / 2, y: 30, width, height });
        } else {
          const size = Math.min(28, Math.max(8, maxWidth / Math.max(1, font.widthOfTextAtSize(signatureText.trim(), 1))));
          page.drawText(signatureText.trim(), {
            x,
            y: 38,
            font,
            size,
            maxWidth
          });
        }
      }

      const bytes = await document.save();
      const verified = await PDFDocument.load(bytes);
      if (verified.getPageCount() !== pageCount) throw new Error('The signed PDF did not preserve the page count.');
      setOutput(new Blob([bytes], { type: 'application/pdf' }));
    } catch (processError) {
      console.error('Unable to sign PDF:', processError);
      setError(processError.message || 'The PDF could not be signed. Check the signature and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!output || !file) return;
    const url = URL.createObjectURL(output);
    const anchor = window.document.createElement('a');
    anchor.href = url;
    anchor.download = `${file.name.replace(/\.pdf$/i, '')}_signed.pdf`;
    anchor.style.display = 'none';
    window.document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps({
          role: 'group',
          'aria-label': file ? `Selected PDF ${file.name}` : 'Choose a PDF to sign'
        })}
        className={`pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone edit-sign-upload-zone ${file ? 'has-file' : ''} transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : file
              ? 'border-slate-300 bg-white'
              : 'cursor-pointer border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="merge-pdf-upload-content">
            <AttachedFileIcon />
            <div className="merge-pdf-upload-copy">
              <h3 className="truncate">{file.name}</h3>
              <p>{(file.size / 1024).toFixed(1)} KB · {pageCount} pages</p>
            </div>
            <AttachedFileActions
              fileName={file.name}
              onReplace={open}
              onRemove={removeFile}
              disabled={isLoading || isProcessing}
            />
          </div>
        ) : (
          <div className="merge-pdf-upload-content">
            <div className="pdf-upload-icon" aria-hidden="true">
              {isLoading
                ? <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                : <Upload className="h-6 w-6 text-blue-600" />}
            </div>
            <div className="merge-pdf-upload-copy">
              <h3>{isLoading ? 'Checking PDF pages…' : isDragActive ? 'Drop the PDF here' : 'Choose or drop a PDF to sign'}</h3>
              <p>Add a visible typed, drawn, or image signature to PDF pages.</p>
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
        <div className="space-y-5">
          <fieldset>
            <legend className="mb-2 font-semibold text-slate-800">Signature style</legend>
            <div className="flex flex-wrap gap-2">
              {[
                ['type', 'Type signature'],
                ['draw', 'Draw signature'],
                ['image', 'Upload image']
              ].map(([value, label]) => (
                <button key={value} type="button" onClick={() => { setSignatureMode(value); setOutput(null); setError(''); }} aria-pressed={signatureMode === value} className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${signatureMode === value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          {signatureMode === 'type' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Signature text
                <input value={signatureText} onChange={updateSetting(setSignatureText)} maxLength={100} placeholder="Type your name" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Style
                <select value={signatureFont} onChange={updateSetting(setSignatureFont)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
                  <option value="HelveticaOblique">Helvetica italic</option>
                  <option value="TimesRomanItalic">Times italic</option>
                </select>
              </label>
            </div>
          )}

          {signatureMode === 'draw' && (
            <div className="space-y-2">
              <p className="block text-sm font-medium text-slate-700">Draw your signature below</p>
              <canvas
                ref={canvasRef}
                id="signature-canvas"
                width="640"
                height="160"
                role="img"
                aria-label="Signature drawing area"
                aria-describedby="signature-drawing-help"
                onPointerDown={(event) => drawAt(event, true)}
                onPointerMove={(event) => drawAt(event, false)}
                onPointerUp={() => { drawing.current = false; }}
                onPointerCancel={() => { drawing.current = false; }}
                className="h-32 w-full touch-none rounded-lg border border-slate-300 bg-white"
              />
              <p id="signature-drawing-help" className="text-xs text-slate-500">
                Drawing uses a pointer or touch input. Choose Type signature to enter your name with the keyboard.
              </p>
              <button type="button" onClick={clearDrawing} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><Trash2 className="h-4 w-4" aria-hidden="true" /> Clear drawing</button>
            </div>
          )}

          {signatureMode === 'image' && (
            <label className="block text-sm font-medium text-slate-700">
              Signature image (PNG or JPEG)
              <input type="file" accept="image/png,image/jpeg" onChange={handleSignatureImage} className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700" />
              {signatureImageName && <span className="mt-1 block text-xs text-slate-500">{signatureImageName}</span>}
            </label>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-slate-800">Apply to</legend>
              <div className="space-y-2 text-sm text-slate-700">
                <label className="flex items-center gap-2"><input type="radio" name="sign-page-mode" checked={selectionMode === 'all'} onChange={() => { setSelectionMode('all'); setOutput(null); }} /> All pages</label>
                <label className="flex items-center gap-2"><input type="radio" name="sign-page-mode" checked={selectionMode === 'selected'} onChange={() => { setSelectionMode('selected'); setOutput(null); }} /> Selected pages</label>
              </div>
            </fieldset>
            <label className="block text-sm font-medium text-slate-700">
              Page numbers
              <input value={pageSelection} onChange={updateSetting(setPageSelection)} disabled={selectionMode !== 'selected'} placeholder="1,3,5-7" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-50" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Placement
              <select value={placement} onChange={updateSetting(setPlacement)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
                <option value="bottom-right">Bottom right</option>
                <option value="bottom-center">Bottom center</option>
                <option value="bottom-left">Bottom left</option>
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Signature width ({signatureWidth} pt)
            <input type="range" min="100" max="300" step="10" value={signatureWidth} onChange={updateSetting((value) => setSignatureWidth(Number(value)))} className="mt-2 block w-full" />
          </label>
        </div>
      )}

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      {file && (
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={createSignedPdf} disabled={isLoading || isProcessing} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <PenLine className="h-5 w-5" aria-hidden="true" />}
            {isProcessing ? 'Signing PDF…' : 'Sign PDF'}
          </button>
          <button type="button" onClick={reset} disabled={isProcessing} className="rounded-lg border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">Reset</button>
          {output && <button type="button" onClick={downloadPdf} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"><Download className="h-5 w-5" aria-hidden="true" /> Download Signed PDF</button>}
        </div>
      )}
      {output && <p className="text-sm text-emerald-700" role="status">{FILE_DOWNLOAD_READY_MESSAGE}</p>}
      <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">A visible signature does not verify identity, create a certificate signature, or prevent later changes.</p>
    </div>
  );
};

export default SignPdf;
