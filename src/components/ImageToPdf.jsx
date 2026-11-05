import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { PDFDocument, PageSizes, rgb } from 'pdf-lib';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  Image as ImageIcon,
  Loader2,
  RotateCw,
  RefreshCw,
  Settings2,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import { AttachedFileActions } from './AttachedFileControls';
import DownloadReadyCard from './DownloadReadyCard';
import { limitImageFiles } from '../lib/imageSelection.mjs';
import { formatToolUiMessage, getLocalizedToolUi } from '../i18n/toolUiLocalization.mjs';
import { getLocalizedTool } from '../i18n/toolTranslations.mjs';
import { useLanguage } from '../i18n/useLanguage';
import {
  calculateImagePageLayout,
  getHexColorComponents
} from '../lib/imagePdfLayout.mjs';
import {
  getEffectiveImagePdfSettings,
  resetImagePdfSettings,
  updateImagePdfSettingsForScope
} from '../lib/imagePdfSettings.mjs';
import { createImagePdfArchive } from '../lib/imagePdfArchive.mjs';

const MAX_IMAGES = 10;
const INITIAL_SETTINGS = {
  pageSize: 'A4',
  orientation: 'portrait',
  autoOrient: false,
  customWidthMm: 210,
  customHeightMm: 297,
  margin: 24,
  fitMode: 'contain',
  backgroundColor: '#ffffff',
  horizontalAlignment: 'center',
  verticalAlignment: 'middle',
  maxWidth: 2400,
  maxHeight: 2400,
  scalePercent: 100,
  maintainAspect: true,
  jpegQuality: 0.9
};
const PDF_PAGE_SIZES = { A4: PageSizes.A4, Letter: PageSizes.Letter };

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

const isValidPreviewSettings = (settings) => (
  Number.isFinite(settings.margin) && settings.margin >= 0 && settings.margin <= 300
  && Number.isSafeInteger(settings.maxWidth) && settings.maxWidth >= 1
  && Number.isSafeInteger(settings.maxHeight) && settings.maxHeight >= 1
  && Number.isFinite(settings.scalePercent) && settings.scalePercent >= 1 && settings.scalePercent <= 100
  && (settings.pageSize !== 'custom'
    || (Number.isFinite(settings.customWidthMm) && Number.isFinite(settings.customHeightMm)
      && settings.customWidthMm >= 10 && settings.customWidthMm <= 2000
      && settings.customHeightMm >= 10 && settings.customHeightMm <= 2000))
);

const ImagePdfPagePreview = ({ image, settings, label, invalidLabel, size = 'compact' }) => {
  if (!isValidPreviewSettings(settings)) {
    return <p className="image-to-pdf-preview-invalid" role="status">{invalidLabel}</p>;
  }

  const layout = calculateImagePageLayout({
    imageWidth: image.width,
    imageHeight: image.height,
    rotation: image.rotation,
    settings,
    pageSizes: PDF_PAGE_SIZES
  });
  const aspectRatio = layout.pageWidth / layout.pageHeight;
  const { placement } = layout;
  const rotated = image.rotation % 180 !== 0;
  const imagePosition = {
    left: `${placement.x / layout.pageWidth * 100}%`,
    top: `${(layout.pageHeight - placement.y - placement.height) / layout.pageHeight * 100}%`,
    width: `${placement.width / layout.pageWidth * 100}%`,
    height: `${placement.height / layout.pageHeight * 100}%`
  };
  const imageStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: rotated ? `${placement.height / placement.width * 100}%` : '100%',
    height: rotated ? `${placement.width / placement.height * 100}%` : '100%',
    maxWidth: 'none',
    transform: `translate(-50%, -50%) rotate(${image.rotation}deg)`
  };
  const maxHeight = size === 'large' ? 560 : 180;

  return (
    <div
      className={`image-to-pdf-page-canvas ${size === 'large' ? 'is-large' : ''}`}
      role="img"
      aria-label={label}
      style={{
        width: `min(100%, ${maxHeight * aspectRatio}px)`,
        aspectRatio: `${layout.pageWidth} / ${layout.pageHeight}`,
        backgroundColor: settings.backgroundColor,
        maxHeight: size === 'large' ? '70vh' : `${maxHeight}px`
      }}
    >
      <div className="image-to-pdf-page-image" style={{ ...imagePosition, overflow: 'visible' }}>
        <img src={image.preview} alt="" aria-hidden="true" style={imageStyle} />
      </div>
    </div>
  );
};

const ImageToPdf = () => {
  const { language, translate } = useLanguage();
  const { imageToPdf: imageUi, fileActions } = getLocalizedToolUi(language);
  const localizedTool = getLocalizedTool(language, {
    id: 'image',
    name: 'Image to PDF',
    description: 'Create a PDF from images.'
  });
  const [images, setImages] = useState([]);
  const [pendingImageCount, setPendingImageCount] = useState(0);
  const pendingImageCountRef = useRef(0);
  const selectionGenerationRef = useRef(0);
  const replaceTargetRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [outputBytes, setOutputBytes] = useState(null);
  const [outputArchive, setOutputArchive] = useState(null);
  const [outputMode, setOutputMode] = useState('single');
  const downloadableOutput = outputArchive
    ? { id: outputArchive.name, blob: outputArchive.blob }
    : outputBytes;
  const markOutputDownloaded = useToolExitGuard(
    images.length > 0 || pendingImageCount > 0,
    downloadableOutput
  );
  const [outputName, setOutputName] = useState('images_to_pdf.pdf');
  const previewUrls = useRef(new Set());

  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [settingsScope, setSettingsScope] = useState('all');
  const [selectedImageIds, setSelectedImageIds] = useState(() => new Set());
  const [largePreviewImageId, setLargePreviewImageId] = useState(null);
  const largePreviewTriggerRef = useRef(null);
  const largePreviewCloseRef = useRef(null);
  const selectedImages = images.filter((image) => selectedImageIds.has(image.id));
  const editingImage = settingsScope === 'select'
    ? selectedImages[0]
    : images[0];
  const activeSettings = editingImage
    ? getEffectiveImagePdfSettings(editingImage, settings)
    : settings;
  const largePreviewImage = images.find((image) => image.id === largePreviewImageId);

  useEffect(() => () => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const closeLargePreview = useCallback(() => setLargePreviewImageId(null), []);

  useEffect(() => {
    if (!largePreviewImageId) {
      if (largePreviewTriggerRef.current?.isConnected) largePreviewTriggerRef.current.focus();
      largePreviewTriggerRef.current = null;
      return undefined;
    }

    largePreviewCloseRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeLargePreview();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [largePreviewImageId, closeLargePreview]);

  const clearOutput = () => {
    setOutputBytes(null);
    setOutputArchive(null);
  };

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
        image.id === targetId ? { ...replacement, settings: image.settings } : image
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
    setSelectedImageIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    if (largePreviewImageId === id) closeLargePreview();
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

  const resetSettings = () => {
    setImages((current) => resetImagePdfSettings(current));
    setSelectedImageIds(new Set());
    setSettingsScope('all');
    setOutputMode('single');
    setSettings(INITIAL_SETTINGS);
    setError('');
    clearOutput();
  };

  const updateSetting = (settingKey, value) => {
    setImages((current) => updateImagePdfSettingsForScope(current, {
      scope: settingsScope,
      selectedImageIds: [...selectedImageIds],
      settingKey,
      value
    }));
    if (settingsScope === 'all') {
      setSettings((current) => ({ ...current, [settingKey]: value }));
    }
    clearOutput();
  };

  const toggleImageSelection = (id) => {
    setSelectedImageIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const changeSettingsScope = (scope) => {
    if (scope === 'select') setSelectedImageIds(new Set());
    setSettingsScope(scope);
  };

  const changeOutputMode = (mode) => {
    setOutputMode(mode);
    clearOutput();
  };

  const openLargePreview = (imageId, event) => {
    largePreviewTriggerRef.current = event.currentTarget;
    setLargePreviewImageId(imageId);
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
    const settingsByImageId = new Map(images.map((image) => [
      image.id,
      getEffectiveImagePdfSettings(image, settings)
    ]));
    for (const imageSettings of settingsByImageId.values()) {
      if (!Number.isFinite(imageSettings.margin) || imageSettings.margin < 0 || imageSettings.margin > 300) {
        setError('Margin must be between 0 and 300 points.');
        return;
      }
      if (!Number.isSafeInteger(imageSettings.maxWidth) || !Number.isSafeInteger(imageSettings.maxHeight)
        || imageSettings.maxWidth < 1 || imageSettings.maxHeight < 1) {
        setError('Maximum width and height must be positive whole pixel values.');
        return;
      }
      if (!Number.isFinite(imageSettings.scalePercent)
        || imageSettings.scalePercent < 1 || imageSettings.scalePercent > 100) {
        setError('Image scale must be between 1% and 100%.');
        return;
      }
      if (!Number.isFinite(imageSettings.jpegQuality)
        || imageSettings.jpegQuality < 0.1 || imageSettings.jpegQuality > 1) {
        setError('JPEG quality must be between 10% and 100%.');
        return;
      }
      if (imageSettings.pageSize === 'custom' && (
        !Number.isFinite(imageSettings.customWidthMm) || !Number.isFinite(imageSettings.customHeightMm)
        || imageSettings.customWidthMm < 10 || imageSettings.customWidthMm > 2000
        || imageSettings.customHeightMm < 10 || imageSettings.customHeightMm > 2000
      )) {
        setError('Custom page width and height must each be between 10 and 2000 millimeters.');
        return;
      }
    }

    setIsProcessing(true);
    setError('');
    clearOutput();
    try {
      const combinedPdf = outputMode === 'single' ? await PDFDocument.create() : null;
      const separatePdfs = [];
      for (const item of images) {
        const pdf = combinedPdf || await PDFDocument.create();
        const imageSettings = settingsByImageId.get(item.id);
        const decoded = await loadImage(item.file);
        try {
          const layout = calculateImagePageLayout({
            imageWidth: decoded.width,
            imageHeight: decoded.height,
            rotation: item.rotation,
            settings: imageSettings,
            pageSizes: PDF_PAGE_SIZES
          });

          const canvas = window.document.createElement('canvas');
          canvas.width = layout.outputWidth;
          canvas.height = layout.outputHeight;
          const context = canvas.getContext('2d');
          if (!context) throw new Error(`The browser could not resize ${item.name}.`);
          context.translate(layout.outputWidth / 2, layout.outputHeight / 2);
          context.rotate((item.rotation * Math.PI) / 180);
          const sourceDrawWidth = item.rotation % 180 ? layout.outputHeight : layout.outputWidth;
          const sourceDrawHeight = item.rotation % 180 ? layout.outputWidth : layout.outputHeight;
          context.drawImage(
            decoded.image,
            -sourceDrawWidth / 2,
            -sourceDrawHeight / 2,
            sourceDrawWidth,
            sourceDrawHeight
          );

          const isJpeg = /\.(jpe?g)$/i.test(item.name) || item.file.type === 'image/jpeg';
          const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
          const imageBytes = await makeImageBytes(canvas, mimeType, imageSettings.jpegQuality);
          const embedded = isJpeg ? await pdf.embedJpg(imageBytes) : await pdf.embedPng(imageBytes);
          canvas.width = 0;
          canvas.height = 0;

          const page = pdf.addPage([layout.pageWidth, layout.pageHeight]);
          const [red, green, blue] = getHexColorComponents(imageSettings.backgroundColor);
          page.drawRectangle({
            x: 0,
            y: 0,
            width: layout.pageWidth,
            height: layout.pageHeight,
            color: rgb(red, green, blue)
          });
          page.drawImage(embedded, {
            x: layout.placement.x,
            y: layout.placement.y,
            width: layout.placement.width,
            height: layout.placement.height
          });
        } finally {
          decoded.close();
        }
        if (outputMode === 'separate') {
          const bytes = await pdf.save();
          const verified = await PDFDocument.load(bytes);
          if (verified.getPageCount() !== 1) {
            throw new Error(`The PDF generated for ${item.name} did not contain exactly one page.`);
          }
          separatePdfs.push({ imageName: item.name, bytes });
        }
      }

      if (outputMode === 'separate') {
        setOutputArchive(await createImagePdfArchive(separatePdfs));
      } else {
        const bytes = await combinedPdf.save();
        const verified = await PDFDocument.load(bytes);
        if (verified.getPageCount() !== images.length) {
          throw new Error('The generated PDF did not contain the expected image page count.');
        }
        setOutputBytes(bytes);
        setOutputName('images_to_pdf.pdf');
      }
    } catch (processingError) {
      console.error('Unable to generate image PDF:', processingError);
      setError(processingError.message || 'The PDF could not be generated. Check that the selected images are valid.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadOutput = (downloadFileName) => {
    if (!outputBytes && !outputArchive) return;
    const blob = outputArchive?.blob || new Blob([outputBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = downloadFileName || outputArchive?.name || outputName;
    link.click();
    markOutputDownloaded(outputArchive?.name);
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="pdf-tool-workflow image-to-pdf-workflow space-y-6">
      <section className="tool-attachment-section image-pdf-attachment-section" aria-labelledby="image-pdf-attachment-heading">
        <div className="tool-attachment-heading">
          <span className="tool-attachment-icon" aria-hidden="true">
            <Upload className="h-5 w-5" />
          </span>
          <div>
            <h2 id="image-pdf-attachment-heading">{translate('attachImagesHere')}</h2>
            <p>{formatToolUiMessage(imageUi.uploadDescription, { max: MAX_IMAGES })}</p>
          </div>
        </div>
        <aside className="tool-attachment-guidance" aria-labelledby="image-pdf-attachment-guidance-heading">
          <h3 id="image-pdf-attachment-guidance-heading">{localizedTool.name}</h3>
          <p>{localizedTool.description}</p>
        </aside>
        <div className="tool-attachment-content">
          <section className="image-to-pdf-file-section" aria-label={imageUi.uploadLabel}>
            {images.length > 0 && (
              <section
                className="conversion-selected-file-section image-to-pdf-selected-file-section"
                aria-labelledby="image-to-pdf-file-heading"
              >
                <header className="image-to-pdf-file-section-header">
                  <div>
                    <div className="merge-panel-title">
                      <ImageIcon aria-hidden="true" />
                      <h3 id="image-to-pdf-file-heading" className="merge-selected-files-title">{imageUi.uploadLabel}</h3>
                    </div>
                    <p>{imageUi.chooseImagesDescription}</p>
                  </div>
                  <span className="image-to-pdf-image-count" aria-live="polite">
                    {formatToolUiMessage(imageUi.imageCount, { count: images.length, max: MAX_IMAGES })}
                  </span>
                </header>
                <ol className="image-to-pdf-attached-image-list" aria-label={imageUi.attachedImages}>
                  {images.map((image, index) => (
                    <li key={image.id} className="pdf-attached-file-card image-to-pdf-attached-image-card">
                      <span className="merge-selected-file-position image-to-pdf-attached-image-position" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <img className="image-to-pdf-attached-image-thumbnail" src={image.preview} alt="" />
                      <div className="merge-selected-file-details">
                        <p className="merge-selected-file-name" title={image.name}>{image.name}</p>
                        <p className="merge-selected-file-meta">
                          <span>{image.width} × {image.height} px</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatBytes(image.file.size)}</span>
                        </p>
                      </div>
                      <div className="image-to-pdf-attached-image-actions">
                        <div className="image-to-pdf-attached-image-reorder">
                          <button
                            type="button"
                            onClick={() => moveImage(index, -1)}
                            disabled={index === 0 || isProcessing}
                            aria-label={`${imageUi.moveUp}: ${image.name}`}
                            title={imageUi.moveUp}
                            className="organize-pdf-page-action image-to-pdf-attached-image-action"
                          >
                            <ArrowUp className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(index, 1)}
                            disabled={index === images.length - 1 || isProcessing}
                            aria-label={`${imageUi.moveDown}: ${image.name}`}
                            title={imageUi.moveDown}
                            className="organize-pdf-page-action image-to-pdf-attached-image-action"
                          >
                            <ArrowDown className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => rotateImage(image.id, 90)}
                          disabled={isProcessing}
                          aria-label={`${imageUi.rotateClockwise}: ${image.name}`}
                          title={imageUi.rotateClockwise}
                          className="organize-pdf-page-action image-to-pdf-attached-image-action"
                        >
                          <RotateCw className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          disabled={isProcessing}
                          aria-label={formatToolUiMessage(fileActions.remove, { fileName: image.name })}
                          title={formatToolUiMessage(fileActions.remove, { fileName: image.name })}
                          className="organize-pdf-page-action image-to-pdf-attached-image-action image-to-pdf-page-remove"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="image-to-pdf-file-actions">
                  <div className="flex justify-end">
                    <button type="button" onClick={open} disabled={isProcessing || images.length >= MAX_IMAGES} className="pdf-upload-trigger rounded-xl border px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50">{formatToolUiMessage(imageUi.addMoreImages, { count: images.length, max: MAX_IMAGES })}</button>
                  </div>
                </div>
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
          </section>
        </div>
      </section>

      {images.length > 0 && (
        <div className="pdf-workflow-controls space-y-4">
          <div className="image-to-pdf-settings-shell">
            <header className="merge-control-intro">
              <div className="merge-panel-title">
                <Settings2 aria-hidden="true" />
                <h3 className="merge-selected-files-title">{imageUi.settingsTitle}</h3>
              </div>
              <p>{imageUi.settingsDescription}</p>
            </header>
            <section className="image-to-pdf-settings-panel" aria-labelledby="image-to-pdf-settings-heading">
              <div className="image-to-pdf-output-mode-setting">
                <p className="image-to-pdf-output-mode-label">{imageUi.outputMode}</p>
                <div className="merge-mode-switch image-to-pdf-output-mode" role="group" aria-label={imageUi.outputMode}>
                  <button
                    type="button"
                    onClick={() => changeOutputMode('single')}
                    aria-pressed={outputMode === 'single'}
                    disabled={isProcessing}
                  >
                    {imageUi.singlePdf}
                  </button>
                  <button
                    type="button"
                    onClick={() => changeOutputMode('separate')}
                    aria-pressed={outputMode === 'separate'}
                    disabled={isProcessing}
                  >
                    {imageUi.separatePdf}
                  </button>
                </div>
              </div>
              <div className="image-to-pdf-scope-toggle-setting">
                <p id="image-to-pdf-scope-toggle-label" className="image-to-pdf-scope-toggle-label">
                  {imageUi.scopeToggleLabel}
                </p>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settingsScope === 'select'}
                  aria-labelledby="image-to-pdf-scope-toggle-label"
                  disabled={isProcessing}
                  onClick={() => changeSettingsScope(settingsScope === 'all' ? 'select' : 'all')}
                  className={`image-to-pdf-scope-toggle${settingsScope === 'select' ? ' is-selected' : ''}`}
                >
                  <span className="image-to-pdf-scope-toggle-value">
                    {settingsScope === 'select' ? imageUi.selectedImages : imageUi.allImages}
                  </span>
                  <span className="image-to-pdf-scope-toggle-track" aria-hidden="true">
                    <span />
                  </span>
                </button>
              </div>
              <fieldset
                className="image-to-pdf-settings-controls grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                disabled={isProcessing || (settingsScope === 'select' && selectedImages.length === 0)}
              >
                <legend className="sr-only">{imageUi.settingsTitle}</legend>
                <div className="image-to-pdf-setting space-y-2">
                  <label htmlFor="image-page-size" className="text-sm font-semibold text-slate-700">{imageUi.pageSize}</label>
                  <select id="image-page-size" value={activeSettings.pageSize} onChange={(event) => updateSetting('pageSize', event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5">
                    <option value="A4">A4</option>
                    <option value="Letter">Letter</option>
                    <option value="fit">{imageUi.fitImageDimensions}</option>
                    <option value="custom">{imageUi.customDimensions}</option>
                  </select>
                </div>
                <div className="image-to-pdf-setting space-y-2">
                  <label htmlFor="image-orientation" className="text-sm font-semibold text-slate-700">{imageUi.orientation}</label>
                  <select id="image-orientation" value={activeSettings.orientation} disabled={activeSettings.autoOrient || activeSettings.pageSize === 'fit'} onChange={(event) => updateSetting('orientation', event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="portrait">{imageUi.portrait}</option>
                    <option value="landscape">{imageUi.landscape}</option>
                  </select>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <input type="checkbox" checked={activeSettings.autoOrient} disabled={activeSettings.pageSize === 'fit'} onChange={(event) => updateSetting('autoOrient', event.target.checked)} className="h-4 w-4 accent-blue-600 disabled:opacity-50" />
                    {imageUi.autoOrient}
                  </label>
                </div>
                {activeSettings.pageSize === 'custom' && (
                  <>
                    <div className="image-to-pdf-setting space-y-2">
                      <label htmlFor="image-custom-width" className="text-sm font-semibold text-slate-700">{imageUi.customWidth}</label>
                      <input id="image-custom-width" type="number" min="10" max="2000" step="0.1" value={activeSettings.customWidthMm} onChange={(event) => updateSetting('customWidthMm', Number(event.target.value))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5" />
                    </div>
                    <div className="image-to-pdf-setting space-y-2">
                      <label htmlFor="image-custom-height" className="text-sm font-semibold text-slate-700">{imageUi.customHeight}</label>
                      <input id="image-custom-height" type="number" min="10" max="2000" step="0.1" value={activeSettings.customHeightMm} onChange={(event) => updateSetting('customHeightMm', Number(event.target.value))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5" />
                    </div>
                  </>
                )}
                <div className="image-to-pdf-setting space-y-2">
                  <label htmlFor="image-fit" className="text-sm font-semibold text-slate-700">{imageUi.imageFit}</label>
                  <select id="image-fit" value={activeSettings.fitMode} onChange={(event) => updateSetting('fitMode', event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5">
                    <option value="contain">{imageUi.contain}</option>
                    <option value="fill">{imageUi.fill}</option>
                  </select>
                </div>
                <div className="image-to-pdf-setting space-y-2">
                  <label htmlFor="image-margin" className="text-sm font-semibold text-slate-700">{imageUi.margin}</label>
                  <input id="image-margin" type="number" min="0" max="300" value={activeSettings.margin} onChange={(event) => updateSetting('margin', Number(event.target.value))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5" />
                </div>
                <div className="image-to-pdf-setting space-y-2">
                  <label htmlFor="image-horizontal-alignment" className="text-sm font-semibold text-slate-700">{imageUi.horizontalAlignment}</label>
                  <select id="image-horizontal-alignment" value={activeSettings.horizontalAlignment} onChange={(event) => updateSetting('horizontalAlignment', event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5">
                    <option value="left">{imageUi.left}</option>
                    <option value="center">{imageUi.center}</option>
                    <option value="right">{imageUi.right}</option>
                  </select>
                </div>
                <div className="image-to-pdf-setting space-y-2">
                  <label htmlFor="image-vertical-alignment" className="text-sm font-semibold text-slate-700">{imageUi.verticalAlignment}</label>
                  <select id="image-vertical-alignment" value={activeSettings.verticalAlignment} onChange={(event) => updateSetting('verticalAlignment', event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5">
                    <option value="top">{imageUi.top}</option>
                    <option value="middle">{imageUi.middle}</option>
                    <option value="bottom">{imageUi.bottom}</option>
                  </select>
                </div>
                <div className="image-to-pdf-setting space-y-2">
                  <label htmlFor="image-max-width" className="text-sm font-semibold text-slate-700">{imageUi.maximumWidth}</label>
                  <input id="image-max-width" type="number" min="1" max="20000" value={activeSettings.maxWidth} onChange={(event) => updateSetting('maxWidth', Number(event.target.value))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5" />
                </div>
                <div className="image-to-pdf-setting space-y-2">
                  <label htmlFor="image-max-height" className="text-sm font-semibold text-slate-700">{imageUi.maximumHeight}</label>
                  <input id="image-max-height" type="number" min="1" max="20000" value={activeSettings.maxHeight} onChange={(event) => updateSetting('maxHeight', Number(event.target.value))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5" />
                </div>
                <div className="image-to-pdf-setting space-y-2">
                  <label htmlFor="image-scale" className="text-sm font-semibold text-slate-700">{imageUi.scale}</label>
                  <input id="image-scale" type="number" min="1" max="100" value={activeSettings.scalePercent} onChange={(event) => updateSetting('scalePercent', Number(event.target.value))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5" />
                </div>
                <div className="image-to-pdf-setting space-y-2">
                  <label htmlFor="image-background-color" className="text-sm font-semibold text-slate-700">{imageUi.pageBackgroundColor}</label>
                  <div className="flex items-center gap-3">
                    <input id="image-background-color" type="color" value={activeSettings.backgroundColor} onChange={(event) => updateSetting('backgroundColor', event.target.value)} className="h-10 w-14 cursor-pointer rounded border border-slate-200 p-1" />
                    <span className="text-sm text-slate-600">{activeSettings.backgroundColor.toUpperCase()}</span>
                  </div>
                </div>
                <div className="image-to-pdf-setting space-y-2">
                  <label htmlFor="jpeg-quality" className="text-sm font-semibold text-slate-700">{formatToolUiMessage(imageUi.jpegQuality, { quality: Math.round(activeSettings.jpegQuality * 100) })}</label>
                  <input id="jpeg-quality" type="range" min="0.1" max="1" step="0.05" value={activeSettings.jpegQuality} onChange={(event) => updateSetting('jpegQuality', Number(event.target.value))} className="w-full accent-blue-600" />
                </div>
                <label className="image-to-pdf-setting inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-700">
                  <input type="checkbox" checked={activeSettings.maintainAspect} onChange={(event) => updateSetting('maintainAspect', event.target.checked)} className="h-4 w-4 accent-blue-600" />
                  {imageUi.maintainAspectRatio}
                </label>
                <p className="image-to-pdf-setting text-xs leading-relaxed text-slate-500 md:col-span-2 lg:col-span-3">
                  {imageUi.encodingNote}
                </p>
              </fieldset>
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={resetSettings}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" /> {imageUi.reset}
                </button>
              </div>
            </section>
          </div>

          <div className="image-to-pdf-preview-shell">
            <header className="merge-control-intro">
              <div className="merge-panel-title">
                <Eye aria-hidden="true" />
                <h3 className="merge-selected-files-title">{imageUi.previewTitle}</h3>
              </div>
              <p>{imageUi.previewDescription}</p>
            </header>
            <section className="image-to-pdf-preview-panel" aria-label={imageUi.previewTitle}>
              {settingsScope === 'select' && (
                <p className="image-to-pdf-page-preview-description">{imageUi.selectImagesHint}</p>
              )}
              <div className="image-to-pdf-page-grid grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {images.map((image, index) => {
                  const imageSettings = getEffectiveImagePdfSettings(image, settings);
                  const isSelected = selectedImageIds.has(image.id);
                  const previewLabel = formatToolUiMessage(imageUi.selectImage, { page: index + 1 });
                  const largerPreviewLabel = formatToolUiMessage(imageUi.viewLargerPreview, { fileName: image.name });

                  return (
                    <article
                      key={image.id}
                      className={`image-to-pdf-page-card merge-page-source-card${isSelected ? ' is-selected' : ''}`}
                    >
                      <div className="image-to-pdf-page-thumbnail-wrap">
                        {settingsScope === 'select' ? (
                          <button
                            type="button"
                            className="merge-page-source-select image-to-pdf-page-select"
                            onClick={() => toggleImageSelection(image.id)}
                            disabled={isProcessing}
                            aria-pressed={isSelected}
                            aria-label={previewLabel}
                            title={previewLabel}
                          >
                            <span className="merge-page-source-image image-to-pdf-page-select-image">
                              <ImagePdfPagePreview
                                image={image}
                                settings={imageSettings}
                                label={`${image.name}, page ${index + 1}`}
                                invalidLabel={imageUi.previewInvalid}
                              />
                              <span className={`merge-page-selection-mark${isSelected ? ' is-selected' : ''}`} aria-hidden="true">
                                {isSelected && <Check className="h-4 w-4" />}
                              </span>
                            </span>
                          </button>
                        ) : (
                          <ImagePdfPagePreview
                            image={image}
                            settings={imageSettings}
                            label={`${image.name}, page ${index + 1}`}
                            invalidLabel={imageUi.previewInvalid}
                          />
                        )}
                        <button
                          type="button"
                          className="merge-page-preview-button organize-pdf-page-preview-button image-to-pdf-page-preview-button"
                          onClick={(event) => openLargePreview(image.id, event)}
                          disabled={isProcessing || !isValidPreviewSettings(imageSettings)}
                          aria-label={largerPreviewLabel}
                          title={largerPreviewLabel}
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="image-to-pdf-page-label" title={image.name}>{image.name}</p>
                      <p className="image-to-pdf-page-details">
                        {image.width} × {image.height} px · {formatBytes(image.file.size)} · {image.rotation}°
                      </p>
                      <AttachedFileActions
                        fileName={image.name}
                        onReplace={() => replaceImage(image.id)}
                        disabled={isProcessing}
                      />
                    </article>
                  );
                })}
              </div>
            </section>
            {largePreviewImage && (
              <div
                className="merge-page-preview-backdrop"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) closeLargePreview();
                }}
              >
                <section
                  className="merge-page-preview-dialog image-to-pdf-page-preview-dialog"
                  role="dialog"
                  aria-modal="true"
                  aria-label={formatToolUiMessage(imageUi.viewLargerPreview, { fileName: largePreviewImage.name })}
                >
                  <div className="merge-page-preview-dialog-header">
                    <h3>{largePreviewImage.name}</h3>
                    <button
                      ref={largePreviewCloseRef}
                      type="button"
                      onClick={closeLargePreview}
                      aria-label={imageUi.closePreview}
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <ImagePdfPagePreview
                    image={largePreviewImage}
                    settings={getEffectiveImagePdfSettings(largePreviewImage, settings)}
                    label={formatToolUiMessage(imageUi.viewLargerPreview, { fileName: largePreviewImage.name })}
                    invalidLabel={imageUi.previewInvalid}
                    size="large"
                  />
                </section>
              </div>
            )}
          </div>
        </div>
      )}

      {images.length > 0 && (
          <div className="pdf-workflow-actions image-to-pdf-action-row flex flex-row flex-wrap justify-end gap-3 pt-2">
              <button type="button" onClick={generatePdf} disabled={isProcessing} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300">
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

      {(outputBytes || outputArchive) && (
        <DownloadReadyCard
          fileName={outputArchive?.name || outputName}
          sizeBytes={outputArchive?.blob.size ?? outputBytes.length}
          onDownload={downloadOutput}
          downloadLabel={outputArchive ? imageUi.downloadZip : imageUi.downloadPdf}
          showFilenameEditor={false}
        />
      )}
    </div>
  );
};

export default ImageToPdf;
