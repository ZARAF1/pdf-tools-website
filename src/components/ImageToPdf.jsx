import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { PDFDocument, PageSizes, rgb } from 'pdf-lib';
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Loader2,
  RotateCcw,
  RotateCw,
  RefreshCw,
  Upload
} from 'lucide-react';
import { AttachedFileActions } from './AttachedFileControls';
import DownloadReadyCard from './DownloadReadyCard';
import { limitImageFiles } from '../lib/imageSelection.mjs';
import { formatToolUiMessage, getLocalizedToolUi } from '../i18n/toolUiLocalization.mjs';
import { useLanguage } from '../i18n/useLanguage';
import {
  calculateImagePlacement,
  getCustomPageDimensions,
  getHexColorComponents,
  getOrientedPageDimensions,
  getRotatedImageDimensions
} from '../lib/imagePdfLayout.mjs';

const MAX_IMAGES = 10;

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const loadImage = async (file) => {
  if (typeof window.createImageBitmap === 'function') {
    const bitmap = await window.createImageBitmap(file);
    return {
      image: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      close: () => bitmap.close()
    };
  }

  const url = URL.createObjectURL(file);
  try {
    const image = new window.Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error(`The browser could not decode ${file.name}.`));
      image.src = url;
    });
    return { image, width: image.naturalWidth, height: image.naturalHeight, close: () => {} };
  } finally {
    URL.revokeObjectURL(url);
  }
};

const createImageEntry = async (file, id = `${Date.now()}-${Math.random().toString(16).slice(2)}`) => {
  const decoded = await loadImage(file);
  try {
    return {
      id,
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
      width: decoded.width,
      height: decoded.height,
      rotation: 0
    };
  } finally {
    decoded.close();
  }
};

const makeImageBytes = (canvas, mimeType, quality) => new Promise((resolve, reject) => {
  canvas.toBlob(async (blob) => {
    if (!blob) {
      reject(new Error('The browser could not create a resized image.'));
      return;
    }
    try {
      resolve(new Uint8Array(await blob.arrayBuffer()));
    } catch (error) {
      reject(error);
    }
  }, mimeType, quality);
});

const ImageToPdf = () => {
  const { language } = useLanguage();
  const { imageToPdf: imageUi } = getLocalizedToolUi(language);
  const [images, setImages] = useState([]);
  const [pendingImageCount, setPendingImageCount] = useState(0);
  const pendingImageCountRef = useRef(0);
  const selectionGenerationRef = useRef(0);
  const replaceTargetRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [outputBytes, setOutputBytes] = useState(null);
  const markOutputDownloaded = useToolExitGuard(
    images.length > 0 || pendingImageCount > 0,
    outputBytes
  );
  const [outputName, setOutputName] = useState('images_to_pdf.pdf');
  const previewUrls = useRef(new Set());

  const [pageSize, setPageSize] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');
  const [autoOrient, setAutoOrient] = useState(false);
  const [customWidthMm, setCustomWidthMm] = useState(210);
  const [customHeightMm, setCustomHeightMm] = useState(297);
  const [margin, setMargin] = useState(24);
  const [fitMode, setFitMode] = useState('contain');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [horizontalAlignment, setHorizontalAlignment] = useState('center');
  const [verticalAlignment, setVerticalAlignment] = useState('middle');
  const [maxWidth, setMaxWidth] = useState(2400);
  const [maxHeight, setMaxHeight] = useState(2400);
  const [scalePercent, setScalePercent] = useState(100);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [jpegQuality, setJpegQuality] = useState(0.9);

  useEffect(() => () => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const clearOutput = () => setOutputBytes(null);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setError('');
    clearOutput();
    if (rejectedFiles.length) {
      setError('Choose JPEG, PNG, or BMP images only. WebP is not supported.');
      return;
    }

    const selection = limitImageFiles(
      images.length,
      pendingImageCountRef.current,
      acceptedFiles,
      MAX_IMAGES
    );
    if (selection.overflowCount) {
      setError(`You can add up to ${MAX_IMAGES} images. ${selection.overflowCount} image${selection.overflowCount === 1 ? ' was' : 's were'} not added.`);
    }
    if (!selection.files.length) return;

    pendingImageCountRef.current += selection.files.length;
    setPendingImageCount(pendingImageCountRef.current);
    const selectionGeneration = selectionGenerationRef.current;
    try {
      const results = await Promise.allSettled(selection.files.map((file) => createImageEntry(file)));
      const newImages = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);
      if (selectionGeneration !== selectionGenerationRef.current) {
        newImages.forEach((image) => URL.revokeObjectURL(image.preview));
        return;
      }
      newImages.forEach((image) => previewUrls.current.add(image.preview));
      setImages((current) => [...current, ...newImages].slice(0, MAX_IMAGES));

      const failedImages = results.filter((result) => result.status === 'rejected');
      if (failedImages.length) {
        failedImages.forEach((result) => console.error('Unable to decode selected image:', result.reason));
        setError((current) => [
          current,
          `${failedImages.length} image${failedImages.length === 1 ? ' could' : 's could'} not be decoded and ${failedImages.length === 1 ? 'was' : 'were'} not added.`
        ].filter(Boolean).join(' '));
      }
    } catch (decodeError) {
      console.error('Unable to decode selected image:', decodeError);
      if (selectionGeneration === selectionGenerationRef.current) {
        setError(decodeError.message || 'One or more selected images could not be decoded.');
      }
    } finally {
      if (selectionGeneration === selectionGenerationRef.current) {
        pendingImageCountRef.current -= selection.files.length;
        setPendingImageCount(pendingImageCountRef.current);
      }
    }
  }, [images.length]);

  const onReplaceDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    const targetId = replaceTargetRef.current;
    replaceTargetRef.current = null;
    if (!acceptedFiles.length && !rejectedFiles.length) return;
    if (rejectedFiles.length || acceptedFiles.length !== 1) {
      setError('Choose one JPEG, PNG, or BMP image to replace the selected image.');
      return;
    }

    const target = images.find((image) => image.id === targetId);
    if (!target) {
      setError('The selected image is no longer available to replace.');
      return;
    }

    try {
      const replacement = await createImageEntry(acceptedFiles[0], targetId);
      previewUrls.current.add(replacement.preview);
      setImages((current) => current.map((image) => (
        image.id === targetId ? replacement : image
      )));
      URL.revokeObjectURL(target.preview);
      previewUrls.current.delete(target.preview);
      setError('');
      clearOutput();
    } catch (decodeError) {
      console.error('Unable to decode replacement image:', decodeError);
      setError(decodeError.message || 'The selected image could not be decoded.');
    }
  }, [images]);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/bmp': ['.bmp', '.dib'],
      'image/x-ms-bmp': ['.bmp', '.dib']
    },
    multiple: true,
    disabled: isProcessing || images.length >= MAX_IMAGES
  });

  const {
    getInputProps: getReplaceInputProps,
    open: openReplace
  } = useAccessibleDropzone({
    onDrop: onReplaceDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/bmp': ['.bmp', '.dib'],
      'image/x-ms-bmp': ['.bmp', '.dib']
    },
    multiple: false,
    maxFiles: 1,
    disabled: isProcessing,
    noClick: true,
    noKeyboard: true
  });

  const replaceImage = (id) => {
    replaceTargetRef.current = id;
    openReplace();
  };

  const removeImage = (id) => {
    setImages((current) => {
      const removed = current.find((image) => image.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
        previewUrls.current.delete(removed.preview);
      }
      return current.filter((image) => image.id !== id);
    });
    clearOutput();
  };

  const moveImage = (index, direction) => {
    setImages((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    clearOutput();
  };

  const reset = () => {
    selectionGenerationRef.current += 1;
    pendingImageCountRef.current = 0;
    setPendingImageCount(0);
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current.clear();
    setImages([]);
    setError('');
    clearOutput();
    setPageSize('A4');
    setOrientation('portrait');
    setAutoOrient(false);
    setCustomWidthMm(210);
    setCustomHeightMm(297);
    setMargin(24);
    setFitMode('contain');
    setBackgroundColor('#ffffff');
    setHorizontalAlignment('center');
    setVerticalAlignment('middle');
    setMaxWidth(2400);
    setMaxHeight(2400);
    setScalePercent(100);
    setMaintainAspect(true);
    setJpegQuality(0.9);
  };

  const updateSetting = (setter, value) => {
    setter(value);
    clearOutput();
  };

  const rotateImage = (id, direction) => {
    setImages((current) => current.map((image) => (
      image.id === id
        ? { ...image, rotation: (image.rotation + direction + 360) % 360 }
        : image
    )));
    clearOutput();
  };

  const generatePdf = async () => {
    if (!images.length) {
      setError('Add at least one JPEG, PNG, or BMP image first.');
      return;
    }
    if (!Number.isFinite(margin) || margin < 0 || margin > 300) {
      setError('Margin must be between 0 and 300 points.');
      return;
    }
    if (!Number.isSafeInteger(maxWidth) || !Number.isSafeInteger(maxHeight) || maxWidth < 1 || maxHeight < 1) {
      setError('Maximum width and height must be positive whole pixel values.');
      return;
    }
    if (!Number.isFinite(scalePercent) || scalePercent < 1 || scalePercent > 100) {
      setError('Image scale must be between 1% and 100%.');
      return;
    }
    if (!Number.isFinite(jpegQuality) || jpegQuality < 0.1 || jpegQuality > 1) {
      setError('JPEG quality must be between 10% and 100%.');
      return;
    }
    if (pageSize === 'custom' && (
      !Number.isFinite(customWidthMm) || !Number.isFinite(customHeightMm)
      || customWidthMm < 10 || customWidthMm > 2000
      || customHeightMm < 10 || customHeightMm > 2000
    )) {
      setError('Custom page width and height must each be between 10 and 2000 millimeters.');
      return;
    }

    setIsProcessing(true);
    setError('');
    clearOutput();
    try {
      const pdf = await PDFDocument.create();
      for (const item of images) {
        const decoded = await loadImage(item.file);
        try {
          const [rotatedSourceWidth, rotatedSourceHeight] = getRotatedImageDimensions(
            decoded.width,
            decoded.height,
            item.rotation
          );
          let outputWidth;
          let outputHeight;
          if (maintainAspect) {
            const scale = Math.min(1, scalePercent / 100, maxWidth / rotatedSourceWidth, maxHeight / rotatedSourceHeight);
            outputWidth = Math.max(1, Math.round(rotatedSourceWidth * scale));
            outputHeight = Math.max(1, Math.round(rotatedSourceHeight * scale));
          } else {
            outputWidth = Math.max(1, Math.round(Math.min(rotatedSourceWidth, maxWidth) * scalePercent / 100));
            outputHeight = Math.max(1, Math.round(Math.min(rotatedSourceHeight, maxHeight) * scalePercent / 100));
          }

          const canvas = window.document.createElement('canvas');
          canvas.width = outputWidth;
          canvas.height = outputHeight;
          const context = canvas.getContext('2d');
          if (!context) throw new Error(`The browser could not resize ${item.name}.`);
          context.translate(outputWidth / 2, outputHeight / 2);
          context.rotate((item.rotation * Math.PI) / 180);
          const sourceDrawWidth = item.rotation % 180 ? outputHeight : outputWidth;
          const sourceDrawHeight = item.rotation % 180 ? outputWidth : outputHeight;
          context.drawImage(
            decoded.image,
            -sourceDrawWidth / 2,
            -sourceDrawHeight / 2,
            sourceDrawWidth,
            sourceDrawHeight
          );

          const isJpeg = /\.(jpe?g)$/i.test(item.name) || item.file.type === 'image/jpeg';
          const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
          const imageBytes = await makeImageBytes(canvas, mimeType, jpegQuality);
          const embedded = isJpeg ? await pdf.embedJpg(imageBytes) : await pdf.embedPng(imageBytes);
          canvas.width = 0;
          canvas.height = 0;

          let [pageWidth, pageHeight] = pageSize === 'A4'
            ? PageSizes.A4
            : pageSize === 'Letter'
              ? PageSizes.Letter
              : pageSize === 'custom'
                ? getCustomPageDimensions(customWidthMm, customHeightMm)
                : [outputWidth * 0.75 + margin * 2, outputHeight * 0.75 + margin * 2];
          if (pageSize !== 'fit') {
            [pageWidth, pageHeight] = getOrientedPageDimensions(pageWidth, pageHeight, {
              autoOrient,
              orientation,
              imageWidth: outputWidth,
              imageHeight: outputHeight
            });
          }
          const page = pdf.addPage([pageWidth, pageHeight]);
          const [red, green, blue] = getHexColorComponents(backgroundColor);
          page.drawRectangle({
            x: 0,
            y: 0,
            width: pageWidth,
            height: pageHeight,
            color: rgb(red, green, blue)
          });
          const placement = calculateImagePlacement({
            imageWidth: embedded.width,
            imageHeight: embedded.height,
            pageWidth,
            pageHeight,
            margin,
            fitMode: pageSize === 'fit' ? 'contain' : fitMode,
            horizontalAlignment,
            verticalAlignment
          });
          page.drawImage(embedded, {
            x: placement.x,
            y: placement.y,
            width: placement.width,
            height: placement.height
          });
        } finally {
          decoded.close();
        }
      }

      const bytes = await pdf.save();
      const verified = await PDFDocument.load(bytes);
      if (verified.getPageCount() !== images.length) {
        throw new Error('The generated PDF did not contain the expected image page count.');
      }
      setOutputBytes(bytes);
      setOutputName('images_to_pdf.pdf');
    } catch (processingError) {
      console.error('Unable to generate image PDF:', processingError);
      setError(processingError.message || 'The PDF could not be generated. Check that the selected images are valid.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = (downloadFileName) => {
    if (!outputBytes) return;
    const url = URL.createObjectURL(new Blob([outputBytes], { type: 'application/pdf' }));
    const link = window.document.createElement('a');
    link.href = url;
    link.download = downloadFileName || outputName;
    link.click();
    markOutputDownloaded();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="pdf-tool-workflow image-to-pdf-workflow mx-auto max-w-4xl space-y-6">
      {images.length > 0 && (
        <div className="pdf-workflow-selected space-y-3">
          <p className="pdf-preview-instructions">Review the image previews and use the controls to set their order and orientation in the PDF.</p>
          {images.map((image, index) => (
            <div key={image.id} className="pdf-attached-file-card group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none">
              <img
                src={image.preview}
                alt=""
                style={{ transform: `rotate(${image.rotation}deg)` }}
                className="h-16 w-16 shrink-0 rounded-lg bg-slate-100 object-contain transition-transform"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">{image.name}</p>
                <p className="text-xs text-slate-500">{image.width} × {image.height} px · {formatBytes(image.file.size)} · {image.rotation}°</p>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0 || isProcessing} aria-label={`${imageUi.moveUp}: ${image.name}`} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-30"><ChevronUp className="h-4 w-4" aria-hidden="true" /></button>
                <button type="button" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1 || isProcessing} aria-label={`${imageUi.moveDown}: ${image.name}`} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-30"><ChevronDown className="h-4 w-4" aria-hidden="true" /></button>
                <button type="button" onClick={() => rotateImage(image.id, -90)} disabled={isProcessing} aria-label={`${imageUi.rotateCounterclockwise}: ${image.name}`} title={imageUi.rotateCounterclockwise} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-30"><RotateCcw className="h-4 w-4" aria-hidden="true" /></button>
                <button type="button" onClick={() => rotateImage(image.id, 90)} disabled={isProcessing} aria-label={`${imageUi.rotateClockwise}: ${image.name}`} title={imageUi.rotateClockwise} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-30"><RotateCw className="h-4 w-4" aria-hidden="true" /></button>
                <AttachedFileActions
                  fileName={image.name}
                  onReplace={() => replaceImage(image.id)}
                  onRemove={() => removeImage(image.id)}
                  disabled={isProcessing}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
      <section className="pdf-workflow-controls grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 lg:grid-cols-3">
        <div className="image-to-pdf-setting space-y-2">
          <label htmlFor="image-page-size" className="text-sm font-semibold text-slate-700">{imageUi.pageSize}</label>
          <select id="image-page-size" value={pageSize} onChange={(event) => updateSetting(setPageSize, event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5">
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
            <option value="fit">{imageUi.fitImageDimensions}</option>
            <option value="custom">{imageUi.customDimensions}</option>
          </select>
        </div>
        <div className="image-to-pdf-setting space-y-2">
          <label htmlFor="image-orientation" className="text-sm font-semibold text-slate-700">{imageUi.orientation}</label>
          <select id="image-orientation" value={orientation} disabled={autoOrient || pageSize === 'fit'} onChange={(event) => updateSetting(setOrientation, event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="portrait">{imageUi.portrait}</option>
            <option value="landscape">{imageUi.landscape}</option>
          </select>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <input type="checkbox" checked={autoOrient} disabled={pageSize === 'fit'} onChange={(event) => updateSetting(setAutoOrient, event.target.checked)} className="h-4 w-4 accent-blue-600 disabled:opacity-50" />
            {imageUi.autoOrient}
          </label>
        </div>
        {pageSize === 'custom' && (
          <>
            <div className="image-to-pdf-setting space-y-2">
              <label htmlFor="image-custom-width" className="text-sm font-semibold text-slate-700">{imageUi.customWidth}</label>
              <input id="image-custom-width" type="number" min="10" max="2000" step="0.1" value={customWidthMm} onChange={(event) => updateSetting(setCustomWidthMm, Number(event.target.value))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5" />
            </div>
            <div className="image-to-pdf-setting space-y-2">
              <label htmlFor="image-custom-height" className="text-sm font-semibold text-slate-700">{imageUi.customHeight}</label>
              <input id="image-custom-height" type="number" min="10" max="2000" step="0.1" value={customHeightMm} onChange={(event) => updateSetting(setCustomHeightMm, Number(event.target.value))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5" />
            </div>
          </>
        )}
        <div className="image-to-pdf-setting space-y-2">
          <label htmlFor="image-fit" className="text-sm font-semibold text-slate-700">{imageUi.imageFit}</label>
          <select id="image-fit" value={fitMode} onChange={(event) => updateSetting(setFitMode, event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5">
            <option value="contain">{imageUi.contain}</option>
            <option value="fill">{imageUi.fill}</option>
          </select>
        </div>
        <div className="image-to-pdf-setting space-y-2">
          <label htmlFor="image-margin" className="text-sm font-semibold text-slate-700">{imageUi.margin}</label>
          <input id="image-margin" type="number" min="0" max="300" value={margin} onChange={(event) => updateSetting(setMargin, Number(event.target.value))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5" />
        </div>
        <div className="image-to-pdf-setting space-y-2">
          <label htmlFor="image-horizontal-alignment" className="text-sm font-semibold text-slate-700">{imageUi.horizontalAlignment}</label>
          <select id="image-horizontal-alignment" value={horizontalAlignment} onChange={(event) => updateSetting(setHorizontalAlignment, event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5">
            <option value="left">{imageUi.left}</option>
            <option value="center">{imageUi.center}</option>
            <option value="right">{imageUi.right}</option>
          </select>
        </div>
        <div className="image-to-pdf-setting space-y-2">
          <label htmlFor="image-vertical-alignment" className="text-sm font-semibold text-slate-700">{imageUi.verticalAlignment}</label>
          <select id="image-vertical-alignment" value={verticalAlignment} onChange={(event) => updateSetting(setVerticalAlignment, event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5">
            <option value="top">{imageUi.top}</option>
            <option value="middle">{imageUi.middle}</option>
            <option value="bottom">{imageUi.bottom}</option>
          </select>
        </div>
        <div className="image-to-pdf-setting space-y-2">
          <label htmlFor="image-max-width" className="text-sm font-semibold text-slate-700">{imageUi.maximumWidth}</label>
          <input id="image-max-width" type="number" min="1" max="20000" value={maxWidth} onChange={(event) => updateSetting(setMaxWidth, Number(event.target.value))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5" />
        </div>
        <div className="image-to-pdf-setting space-y-2">
          <label htmlFor="image-max-height" className="text-sm font-semibold text-slate-700">{imageUi.maximumHeight}</label>
          <input id="image-max-height" type="number" min="1" max="20000" value={maxHeight} onChange={(event) => updateSetting(setMaxHeight, Number(event.target.value))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5" />
        </div>
        <div className="image-to-pdf-setting space-y-2">
          <label htmlFor="image-scale" className="text-sm font-semibold text-slate-700">{imageUi.scale}</label>
          <input id="image-scale" type="number" min="1" max="100" value={scalePercent} onChange={(event) => updateSetting(setScalePercent, Number(event.target.value))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5" />
        </div>
        <div className="image-to-pdf-setting space-y-2">
          <label htmlFor="image-background-color" className="text-sm font-semibold text-slate-700">{imageUi.pageBackgroundColor}</label>
          <div className="flex items-center gap-3">
            <input id="image-background-color" type="color" value={backgroundColor} onChange={(event) => updateSetting(setBackgroundColor, event.target.value)} className="h-10 w-14 cursor-pointer rounded border border-slate-200 p-1" />
            <span className="text-sm text-slate-600">{backgroundColor.toUpperCase()}</span>
          </div>
        </div>
        <div className="image-to-pdf-setting space-y-2">
          <label htmlFor="jpeg-quality" className="text-sm font-semibold text-slate-700">{formatToolUiMessage(imageUi.jpegQuality, { quality: Math.round(jpegQuality * 100) })}</label>
          <input id="jpeg-quality" type="range" min="0.1" max="1" step="0.05" value={jpegQuality} onChange={(event) => updateSetting(setJpegQuality, Number(event.target.value))} className="w-full accent-blue-600" />
        </div>
        <label className="image-to-pdf-setting inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={maintainAspect} onChange={(event) => updateSetting(setMaintainAspect, event.target.checked)} className="h-4 w-4 accent-blue-600" />
          {imageUi.maintainAspectRatio}
        </label>
        <p className="image-to-pdf-setting text-xs leading-relaxed text-slate-500 md:col-span-2 lg:col-span-3">
          {imageUi.encodingNote}
        </p>
      </section>
      )}

      <div
        {...getRootProps({
          role: 'group',
          'aria-label': imageUi.uploadLabel,
          tabIndex: images.length ? -1 : undefined
        })}
        aria-hidden={images.length ? 'true' : undefined}
        className={images.length
          ? 'sr-only'
          : `pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone rounded-2xl border-2 border-dashed transition-all duration-200 ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'cursor-pointer border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md'
          }`}
      >
        <input {...getInputProps()} />
        <input {...getReplaceInputProps()} />
        {images.length === 0 && (
          <div className="merge-pdf-upload-content">
            <div className="pdf-upload-icon" aria-hidden="true">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <div className="merge-pdf-upload-copy">
              <h3>{isDragActive ? imageUi.dropPrompt : imageUi.uploadPrompt}</h3>
              <p>{formatToolUiMessage(imageUi.uploadDescription, { max: MAX_IMAGES })}</p>
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
              {imageUi.chooseImages}
            </button>
          </div>
        )}
      </div>

      {images.length > 0 && (
          <div className="pdf-workflow-actions flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="button" onClick={reset} disabled={isProcessing} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
              <RefreshCw className="h-4 w-4" aria-hidden="true" /> {imageUi.reset}
            </button>
            <button type="button" onClick={open} disabled={isProcessing || images.length >= MAX_IMAGES} className="pdf-upload-trigger rounded-xl border px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50">{formatToolUiMessage(imageUi.addMoreImages, { count: images.length, max: MAX_IMAGES })}</button>
            <button type="button" onClick={generatePdf} disabled={isProcessing} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300">
              {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <ImageIcon className="h-5 w-5" aria-hidden="true" />}
              {isProcessing
                ? imageUi.creatingPdf
                : formatToolUiMessage(imageUi.createPdf, {
                  count: images.length,
                  pageUnit: images.length === 1 ? imageUi.page : imageUi.pages
                })}
            </button>
          </div>
      )}

      {error && <div role="alert" className="image-to-pdf-error flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800"><AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" /><span className="text-sm">{error}</span></div>}

      {outputBytes && (
        <DownloadReadyCard
          fileName={outputName}
          sizeBytes={outputBytes.length}
          onDownload={downloadPdf}
          downloadLabel={imageUi.downloadPdf}
        />
      )}
    </div>
  );
};

export default ImageToPdf;
