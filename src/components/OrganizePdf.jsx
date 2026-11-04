import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import { degrees, PDFDocument } from 'pdf-lib';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import {
  adjustOrganizeCrop,
  clampOrganizeCrop,
  fullPageCrop,
  hasOrganizeChanges,
  rotateOrganizeCropClockwise,
  selectionToPdfRectangle
} from '../lib/organizePdfCrop.mjs';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { ArrowDown, ArrowUp, CheckCircle2, Crop as CropIcon, Eye, Loader2, RotateCw, Trash2, Upload, X } from 'lucide-react';
import pdfjsLib from '../lib/pdfjsClient';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';
import DownloadReadyCard from './DownloadReadyCard';

const MAX_PAGES = 30;

const formatBytes = (bytes) => (
  bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
);

const OrganizePdf = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [sourcePageCount, setSourcePageCount] = useState(0);
  const [previews, setPreviews] = useState([]);
  const [previewSummaries, setPreviewSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState(null);
  const markOutputDownloaded = useToolExitGuard(Boolean(file), output);
  const [error, setError] = useState('');
  const [previewError, setPreviewError] = useState('');
  const [largePreview, setLargePreview] = useState(null);
  const [draggedPage, setDraggedPage] = useState(null);
  const [dropTargetPage, setDropTargetPage] = useState(null);
  const requestId = useRef(0);
  const largePreviewRequestRef = useRef(0);
  const largePreviewRenderTaskRef = useRef(null);
  const largePreviewTriggerRef = useRef(null);
  const largePreviewCloseRef = useRef(null);
  const cropStageRef = useRef(null);
  const cropDragRef = useRef(null);
  const pageCardRefs = useRef(new Map());
  const pageRectsRef = useRef(new Map());
  const pageAnimationFramesRef = useRef(new Set());
  const previewRotationKey = pages
    .map(({ sourceIndex, rotation }) => `${sourceIndex}:${rotation}`)
    .sort()
    .join('|');
  const hasChanges = Boolean(file && hasOrganizeChanges(pages, sourcePageCount));

  useLayoutEffect(() => {
    const previousRects = pageRectsRef.current;
    const currentRects = new Map();
    pageCardRefs.current.forEach((card, sourceIndex) => {
      currentRects.set(sourceIndex, card.getBoundingClientRect());
    });

    currentRects.forEach((nextRect, sourceIndex) => {
      const previousRect = previousRects.get(sourceIndex);
      const card = pageCardRefs.current.get(sourceIndex);
      if (!previousRect || !card) return;
      const deltaX = previousRect.left - nextRect.left;
      const deltaY = previousRect.top - nextRect.top;
      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
      card.style.transition = 'none';
      card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      card.getBoundingClientRect();
      const frame = window.requestAnimationFrame(() => {
        card.style.transition = '';
        card.getBoundingClientRect();
        card.style.transform = '';
        pageAnimationFramesRef.current.delete(frame);
      });
      pageAnimationFramesRef.current.add(frame);
    });

    pageRectsRef.current = currentRects;
    return () => {
      pageAnimationFramesRef.current.forEach((frame) => window.cancelAnimationFrame(frame));
      pageAnimationFramesRef.current.clear();
      pageCardRefs.current.forEach((card) => {
        card.style.transition = '';
        card.style.transform = '';
      });
    };
  }, [pages]);

  const clearOutput = () => setOutput(null);

  const capturePageRects = () => {
    const rects = new Map();
    pageCardRefs.current.forEach((card, sourceIndex) => {
      rects.set(sourceIndex, card.getBoundingClientRect());
    });
    pageRectsRef.current = rects;
  };

  const closeLargePreview = useCallback(() => {
    largePreviewRequestRef.current += 1;
    largePreviewRenderTaskRef.current?.cancel();
    largePreviewRenderTaskRef.current = null;
    cropDragRef.current = null;
    setLargePreview(null);
    largePreviewTriggerRef.current?.focus();
  }, []);

  const openLargePreview = async (page, pageIndex, event, mode = 'preview') => {
    largePreviewTriggerRef.current = event.currentTarget;
    largePreviewRenderTaskRef.current?.cancel();
    largePreviewRenderTaskRef.current = null;
    const requestId = largePreviewRequestRef.current + 1;
    largePreviewRequestRef.current = requestId;
    setLargePreview({
      pageNumber: pageIndex + 1,
      sourcePageNumber: page.sourceIndex + 1,
      sourceIndex: page.sourceIndex,
      mode,
      crop: mode === 'crop' ? { ...(page.crop || fullPageCrop) } : null,
      preview: null,
      width: null,
      height: null,
      error: null
    });

    let canvas;
    let loadingTask;
    let document;
    let renderTask;
    try {
      const data = await file.arrayBuffer();
      if (largePreviewRequestRef.current !== requestId) return;
      loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(data) });
      document = await loadingTask.promise;
      if (largePreviewRequestRef.current !== requestId) return;
      const sourcePage = await document.getPage(page.sourceIndex + 1);
      if (largePreviewRequestRef.current !== requestId) return;
      const rotation = ((sourcePage.rotate + page.rotation) % 360 + 360) % 360;
      const baseViewport = sourcePage.getViewport({ scale: 1, rotation });
      const scale = mode === 'crop'
        ? Math.min(1.5, 720 / baseViewport.width, (window.innerHeight * 0.68) / baseViewport.height)
        : Math.min(1.5, 1200 / baseViewport.width, 1200 / baseViewport.height);
      const viewport = sourcePage.getViewport({ scale, rotation });
      canvas = window.document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Your browser could not render a page preview.');

      renderTask = sourcePage.render({ canvasContext: context, viewport, intent: 'print' });
      largePreviewRenderTaskRef.current = renderTask;
      await renderTask.promise;
      if (largePreviewRequestRef.current === requestId) {
        const preview = canvas.toDataURL('image/jpeg', 0.86);
        const previewWidth = canvas.width;
        const previewHeight = canvas.height;
        setLargePreview((current) => current && current.pageNumber === pageIndex + 1
          ? { ...current, preview, width: previewWidth, height: previewHeight }
          : current);
      }
    } catch (previewFailure) {
      if (largePreviewRequestRef.current === requestId) {
        console.error('Unable to render larger PDF organization preview:', previewFailure);
        setLargePreview((current) => current && current.pageNumber === pageIndex + 1
          ? { ...current, error: 'A larger preview could not be rendered.' }
          : current);
      }
    } finally {
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
      if (largePreviewRenderTaskRef.current === renderTask) {
        largePreviewRenderTaskRef.current = null;
      }
      try {
        if (document) await document.destroy();
        else if (loadingTask) await loadingTask.destroy();
      } catch (destroyFailure) {
        console.error('Unable to release larger PDF organization preview:', destroyFailure);
      }
    }
  };

  useEffect(() => {
    if (!largePreview) return undefined;
    largePreviewCloseRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeLargePreview();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [largePreview?.sourceIndex, closeLargePreview]);

  const openCropEditor = (page, pageIndex, event) => {
    openLargePreview(page, pageIndex, event, 'crop');
  };

  const updateCropEditor = (crop) => {
    setLargePreview((current) => current?.mode === 'crop'
      ? { ...current, crop: clampOrganizeCrop(crop) }
      : current);
    clearOutput();
    setError('');
  };

  const cropPointFromEvent = (event) => {
    const stage = cropStageRef.current;
    const bounds = stage?.getBoundingClientRect();
    if (!stage || !bounds?.width || !bounds.height) return null;
    return {
      x: Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width)),
      y: Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height))
    };
  };

  const handleCropPointerDown = (event) => {
    if (!largePreview?.crop || isProcessing) return;
    const point = cropPointFromEvent(event);
    if (!point) return;
    const handle = event.target.closest('[data-organize-crop-handle]')?.dataset.organizeCropHandle;
    const insideFrame = event.target.closest('.organize-pdf-crop-frame');
    const isFullPage = largePreview.crop.width >= 0.9999
      && largePreview.crop.height >= 0.9999
      && largePreview.crop.x <= 0.0001
      && largePreview.crop.y <= 0.0001;
    cropDragRef.current = {
      mode: handle ? 'resize' : (insideFrame && !isFullPage ? 'move' : 'draw'),
      handle,
      start: point,
      initialCrop: largePreview.crop
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handleCropPointerMove = (event) => {
    const drag = cropDragRef.current;
    if (!drag) return;
    const point = cropPointFromEvent(event);
    if (!point) return;
    const dx = point.x - drag.start.x;
    const dy = point.y - drag.start.y;
    if (drag.mode === 'move') {
      updateCropEditor({
        ...drag.initialCrop,
        x: Math.min(1 - drag.initialCrop.width, Math.max(0, drag.initialCrop.x + dx)),
        y: Math.min(1 - drag.initialCrop.height, Math.max(0, drag.initialCrop.y + dy))
      });
    } else if (drag.mode === 'resize') {
      updateCropEditor(adjustOrganizeCrop(drag.initialCrop, drag.handle, dx, dy));
    } else {
      updateCropEditor({
        x: Math.min(drag.start.x, point.x),
        y: Math.min(drag.start.y, point.y),
        width: Math.abs(dx),
        height: Math.abs(dy)
      });
    }
  };

  const finishCropPointer = (event) => {
    cropDragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const resizeCropByKeyboard = (event, handle) => {
    const step = event.shiftKey ? 0.05 : 0.01;
    const changes = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step]
    };
    const change = changes[event.key];
    if (!change || !largePreview?.crop) return;
    event.preventDefault();
    updateCropEditor(adjustOrganizeCrop(largePreview.crop, handle, change[0], change[1]));
  };

  const updateCropBound = (bound, value) => {
    if (!largePreview?.crop || value.trim() === '') return;
    const amount = Number(value) / 100;
    if (!Number.isFinite(amount)) return;
    const crop = { ...largePreview.crop };
    if (bound === 'left') crop.x = Math.min(1 - crop.width, Math.max(0, amount));
    if (bound === 'top') crop.y = Math.min(1 - crop.height, Math.max(0, amount));
    if (bound === 'width') crop.width = Math.min(1 - crop.x, Math.max(0.02, amount));
    if (bound === 'height') crop.height = Math.min(1 - crop.y, Math.max(0.02, amount));
    updateCropEditor(crop);
  };

  const resetCropEditor = () => updateCropEditor({ ...fullPageCrop });

  const saveCropEditor = () => {
    if (!largePreview?.crop) return;
    const crop = largePreview.crop.width >= 0.9999
      && largePreview.crop.height >= 0.9999
      && largePreview.crop.x <= 0.0001
      && largePreview.crop.y <= 0.0001
      ? null
      : { ...largePreview.crop };
    setPages((current) => current.map((page) => (
      page.sourceIndex === largePreview.sourceIndex ? { ...page, crop } : page
    )));
    clearOutput();
    closeLargePreview();
  };

  useEffect(() => () => {
    largePreviewRequestRef.current += 1;
    largePreviewRenderTaskRef.current?.cancel();
  }, []);

  const onDrop = useCallback(async (acceptedFiles, rejections) => {
    closeLargePreview();
    setError('');
    clearOutput();
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
      const count = source.getPageCount();
      if (!count) throw new Error('This PDF does not contain any pages.');
      if (count > MAX_PAGES) throw new Error(`This tool supports PDFs with up to ${MAX_PAGES} pages; this file has ${count}.`);
      if (requestId.current === currentRequest) {
        setPreviews([]);
        setPreviewSummaries([]);
        setFile(selectedFile);
        setSourcePageCount(count);
        setPages(Array.from({ length: count }, (_, sourceIndex) => ({ sourceIndex, rotation: 0, crop: null })));
      }
    } catch (loadError) {
      console.error('Unable to load PDF for organizing:', loadError);
      if (requestId.current === currentRequest) {
        setError(loadError.message || 'This PDF is invalid or could not be opened.');
      }
    } finally {
      if (requestId.current === currentRequest) setIsLoading(false);
    }
  }, [closeLargePreview]);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isLoading || isProcessing,
    noClick: Boolean(file),
    noKeyboard: Boolean(file)
  });

  useEffect(() => {
    if (!file || !pages.length) return undefined;
    let active = true;
    let loadingTask;
    const rotationsBySourceIndex = new Map(
      pages.map(({ sourceIndex, rotation }) => [sourceIndex, rotation])
    );

    const renderPreviews = async () => {
      setPreviewError('');
      try {
        const data = new Uint8Array(await file.arrayBuffer());
        loadingTask = pdfjsLib.getDocument({ data });
        const document = await loadingTask.promise;
        const rendered = [];
        for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
          if (!active) return;
          const page = await document.getPage(pageNumber);
          const rotation = page.rotate + (rotationsBySourceIndex.get(pageNumber - 1) || 0);
          const baseViewport = page.getViewport({ scale: 1, rotation });
          const viewport = page.getViewport({
            scale: Math.min(1, 180 / baseViewport.width),
            rotation
          });
          const canvas = window.document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Your browser could not render a page preview.');
          await page.render({ canvasContext: context, viewport, intent: 'print' }).promise;
          let summary = '';
          try {
            const textContent = await page.getTextContent();
            summary = textContent.items
              .map((item) => ('str' in item ? item.str : ''))
              .filter(Boolean)
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 320);
          } catch {
            summary = 'Page text could not be extracted; the preview is visual-only.';
          }
          rendered.push({
            sourceIndex: pageNumber - 1,
            preview: canvas.toDataURL('image/jpeg', 0.75),
            width: canvas.width,
            height: canvas.height,
            summary
          });
          canvas.width = 0;
          canvas.height = 0;
        }
        if (active) {
          const nextPreviews = Array(document.numPages);
          const nextSummaries = Array(document.numPages);
          rendered.forEach(({ sourceIndex, preview, width, height, summary }) => {
            nextPreviews[sourceIndex] = { src: preview, width, height };
            nextSummaries[sourceIndex] = summary;
          });
          setPreviews(nextPreviews);
          setPreviewSummaries(nextSummaries);
        }
        await document.destroy();
      } catch (renderError) {
        if (active) console.error('Unable to render PDF organization previews:', renderError);
        if (active) setPreviewError('Page previews could not be rendered, but the page controls remain available.');
      }
    };

    renderPreviews();
    return () => {
      active = false;
      loadingTask?.destroy();
    };
  }, [file, pages.length, previewRotationKey]);

  const clearFile = () => {
    requestId.current += 1;
    closeLargePreview();
    setFile(null);
    setPages([]);
    setSourcePageCount(0);
    setPreviews([]);
    setPreviewSummaries([]);
    setError('');
    setPreviewError('');
    setIsLoading(false);
    clearOutput();
  };

  const reorderPage = (fromIndex, toIndex) => {
    if (fromIndex === toIndex || fromIndex == null || toIndex < 0 || toIndex >= pages.length) return;
    capturePageRects();
    setPages((current) => {
      const updated = [...current];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
    clearOutput();
    setError('');
  };

  const rotatePage = (index) => {
    setPages((current) => current.map((page, pageIndex) => (
      pageIndex === index
        ? {
          ...page,
          rotation: (page.rotation + 90) % 360,
          crop: page.crop ? rotateOrganizeCropClockwise(page.crop) : null
        }
        : page
    )));
    clearOutput();
    setError('');
  };

  const removePage = (index) => {
    if (pages.length <= 1) {
      setError('At least one page must remain in the output PDF.');
      return;
    }
    capturePageRects();
    setPages((current) => current.filter((_, pageIndex) => pageIndex !== index));
    clearOutput();
    setError('');
  };

  const createPdf = async () => {
    if (!file || !pages.length) {
      setError('Choose a PDF with at least one page.');
      return;
    }
    if (!hasChanges) return;
    setIsProcessing(true);
    setError('');
    clearOutput();
    let previewLoadingTask;
    let previewDocument;
    try {
      const sourceData = await file.arrayBuffer();
      const source = await PDFDocument.load(sourceData, { ignoreEncryption: false });
      if (source.isEncrypted) throw new Error('Password-protected PDFs are not supported.');
      const result = await PDFDocument.create();
      if (pages.some((item) => item.crop)) {
        previewLoadingTask = pdfjsLib.getDocument({ data: new Uint8Array(sourceData) });
        previewDocument = await previewLoadingTask.promise;
      }
      const expectedCrops = [];
      const expectedRotations = [];
      for (const [outputIndex, item] of pages.entries()) {
        const sourcePage = source.getPage(item.sourceIndex);
        const [page] = await result.copyPages(source, [item.sourceIndex]);
        const rotation = ((sourcePage.getRotation().angle + item.rotation) % 360 + 360) % 360;
        if (item.crop) {
          const previewPage = await previewDocument.getPage(item.sourceIndex + 1);
          const viewport = previewPage.getViewport({ scale: 1, rotation });
          const rectangle = selectionToPdfRectangle(viewport, sourcePage, item.crop);
          page.setCropBox(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
          expectedCrops.push({ outputIndex, rectangle });
        }
        page.setRotation(degrees(rotation));
        expectedRotations.push(rotation);
        result.addPage(page);
      }
      const bytes = await result.save();
      const verified = await PDFDocument.load(bytes);
      if (verified.getPageCount() !== pages.length) {
        throw new Error('The generated PDF did not contain the expected number of pages.');
      }
      for (const [pageIndex, rotation] of expectedRotations.entries()) {
        if (verified.getPage(pageIndex).getRotation().angle !== rotation) {
          throw new Error(`The generated PDF rotation on page ${pageIndex + 1} did not match the selection.`);
        }
      }
      for (const { outputIndex, rectangle } of expectedCrops) {
        const actual = verified.getPage(outputIndex).getCropBox();
        if (
          Math.abs(actual.x - rectangle.x) > 0.02
          || Math.abs(actual.y - rectangle.y) > 0.02
          || Math.abs(actual.width - rectangle.width) > 0.02
          || Math.abs(actual.height - rectangle.height) > 0.02
        ) {
          throw new Error(`The generated crop on page ${outputIndex + 1} did not match the selection.`);
        }
      }
      setOutput(new Blob([bytes], { type: 'application/pdf' }));
    } catch (processError) {
      console.error('Unable to organize PDF:', processError);
      setError(processError.message || 'The PDF could not be organized. Try another document.');
    } finally {
      try {
        if (previewDocument) await previewDocument.destroy();
        else if (previewLoadingTask) await previewLoadingTask.destroy();
      } catch (destroyError) {
        console.error('Unable to release PDF crop verification resources:', destroyError);
      }
      setIsProcessing(false);
    }
  };

  const downloadPdf = (downloadFileName) => {
    if (!output || !file) return;
    const url = URL.createObjectURL(output);
    const anchor = window.document.createElement('a');
    anchor.href = url;
    anchor.download = downloadFileName || `${file.name.replace(/\.pdf$/i, '')}_organized.pdf`;
    anchor.style.display = 'none';
    window.document.body.appendChild(anchor);
    anchor.click();
    markOutputDownloaded();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="pdf-tool-workflow organize-pdf-workflow space-y-6">
      <input {...getInputProps()} />
      {file ? (
      <section className="organize-pdf-file-section" aria-labelledby="organize-pdf-file-heading">
        <header>
          <h3 id="organize-pdf-file-heading" className="merge-selected-files-title">PDF to organize</h3>
          <p>One PDF selected. Replace it or remove it to choose another.</p>
        </header>
        <section
          {...getRootProps({
            role: 'group',
            'aria-label': `Selected PDF ${file.name}`
          })}
          className={`pdf-workflow-selected pdf-attached-file-card organize-pdf-attached-file-card flex items-center justify-between gap-4 p-3 ${isDragActive ? 'is-drag-active' : ''}`}
        >
          <div className="organize-pdf-file-details">
            <AttachedFileIcon />
            <div>
              <strong className="truncate">{file.name}</strong>
              <span>{formatBytes(file.size)} · {pages.length} {pages.length === 1 ? 'page' : 'pages'}</span>
            </div>
          </div>
          <AttachedFileActions
            fileName={file.name}
            onReplace={open}
            onRemove={clearFile}
            disabled={isLoading || isProcessing}
          />
        </section>
      </section>
    ) : (
        <div
          {...getRootProps({
            role: 'group',
            'aria-label': 'Choose a PDF to organize'
          })}
          className={`organize-pdf-upload pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone ${isDragActive ? 'is-drag-active' : ''}`}
        >
          <div className="merge-pdf-upload-content">
            <div className="pdf-upload-icon" aria-hidden="true">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-blue-600" aria-hidden="true" /> : <Upload className="h-6 w-6 text-blue-600" aria-hidden="true" />}
            </div>
            <div className="merge-pdf-upload-copy">
              <h3 aria-live="polite">{isLoading ? 'Reading PDF…' : isDragActive ? 'Drop the PDF here' : 'Choose or drop a PDF to organize'}</h3>
              <p>Reorder, rotate, crop, or remove PDF pages.</p>
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
        </div>
      )}

      {previewError && <p className="text-sm text-amber-700" role="status">{previewError}</p>}
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

      {pages.length > 0 && (
        <div className="pdf-workflow-controls space-y-4">
          <div className="organize-pdf-preview-shell">
            <div className="merge-control-intro">
              <h3 className="merge-selected-files-title">Preview</h3>
              <p>Review, reorder, rotate, and remove pages before creating your organized PDF.</p>
            </div>
            <section className="merge-page-selection-panel organize-pdf-page-preview-panel" aria-labelledby="organize-pdf-page-preview-heading">
              <div className="merge-section-heading merge-page-selection-heading">
                <div>
                  <h3 id="organize-pdf-page-preview-heading" className="merge-section-heading-title merge-page-selection-title">Page Preview</h3>
                  <p>Drag page cards to reorder, or use the controls on each page.</p>
                </div>
              </div>
              <div className="organize-pdf-page-grid grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {pages.map((page, index) => {
                  const preview = previews[page.sourceIndex];
                  const previewAspectRatio = preview ? preview.width / preview.height : 0;
                  const previewFillsWidth = previewAspectRatio >= 0.75;
                  return (
                  <article
                    key={page.sourceIndex}
                    ref={(card) => {
                      if (card) pageCardRefs.current.set(page.sourceIndex, card);
                      else pageCardRefs.current.delete(page.sourceIndex);
                    }}
                    draggable={!isLoading && !isProcessing}
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setDragImage(
                        event.currentTarget,
                        event.currentTarget.offsetWidth / 2,
                        event.currentTarget.offsetHeight / 2
                      );
                      setDraggedPage(index);
                      setDropTargetPage(null);
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = 'move';
                    }}
                    onDragEnter={() => setDropTargetPage(index)}
                    onDrop={(event) => {
                      event.preventDefault();
                      reorderPage(draggedPage, index);
                      setDraggedPage(null);
                      setDropTargetPage(null);
                    }}
                    onDragEnd={() => {
                      setDraggedPage(null);
                      setDropTargetPage(null);
                    }}
                    className={`organize-pdf-page-card min-w-0 rounded-xl border p-2 shadow-sm ${draggedPage === index ? 'is-dragging' : ''} ${dropTargetPage === index && draggedPage !== index ? 'is-drop-target' : ''}`}
                  >
                    <div className="organize-pdf-page-thumbnail-wrap mb-2 flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg">
                      {preview
                        ? (
                          <div
                            className="organize-pdf-page-image-frame"
                            style={{
                              aspectRatio: `${preview.width} / ${preview.height}`,
                              width: previewFillsWidth ? '100%' : 'auto',
                              height: previewFillsWidth ? 'auto' : '100%',
                              maxWidth: '100%',
                              maxHeight: '100%'
                            }}
                          >
                            <img
                              src={preview.src}
                              alt={`Preview of source page ${page.sourceIndex + 1}, ${page.rotation ? `rotated clockwise ${page.rotation} degrees` : 'original orientation'}${page.crop ? ', crop saved' : ''}`}
                              aria-describedby={`organize-page-${page.sourceIndex + 1}-description`}
                              draggable="false"
                            />
                            {page.crop && (
                              <div
                                className="organize-pdf-saved-crop-frame"
                                aria-hidden="true"
                                style={{
                                  left: `${page.crop.x * 100}%`,
                                  top: `${page.crop.y * 100}%`,
                                  width: `${page.crop.width * 100}%`,
                                  height: `${page.crop.height * 100}%`
                                }}
                              />
                            )}
                          </div>
                        )
                        : <span className="text-xs text-slate-400">Page {page.sourceIndex + 1}</span>}
                      {page.crop && <span className="organize-pdf-crop-saved-badge" aria-hidden="true">Crop saved</span>}
                      <button
                        type="button"
                        className="organize-pdf-page-preview-button"
                        onClick={(event) => openLargePreview(page, index, event)}
                        disabled={!previews[page.sourceIndex] || isLoading || isProcessing}
                        aria-label={`View larger preview of page ${index + 1}`}
                        title={`Larger preview, page ${index + 1}`}
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p id={`organize-page-${page.sourceIndex + 1}-description`} className="sr-only">
                      {page.crop ? 'A saved crop for this page is shown in the preview. ' : ''}
                      {previewSummaries[page.sourceIndex] || 'No selectable text was found on this page; its preview is visual-only.'}
                    </p>
                    <p className="organize-pdf-page-label mb-2 text-center text-xs font-semibold">
                      Position {index + 1} · Source page {page.sourceIndex + 1}{page.rotation ? ` · +${page.rotation}°` : ''}
                    </p>
                    <div className="organize-pdf-page-actions flex justify-center gap-1">
                      <button type="button" onClick={() => reorderPage(index, index - 1)} disabled={index === 0} aria-label={`Move page ${index + 1} earlier`} className="organize-pdf-page-action">
                        <ArrowUp className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => reorderPage(index, index + 1)} disabled={index === pages.length - 1} aria-label={`Move page ${index + 1} later`} className="organize-pdf-page-action">
                        <ArrowDown className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => rotatePage(index)} aria-label={`Rotate page ${index + 1} clockwise`} className="organize-pdf-page-action">
                        <RotateCw className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => openCropEditor(page, index, event)}
                        disabled={isLoading || isProcessing}
                        aria-label={`Crop page ${index + 1}`}
                        title={`Crop page ${index + 1}`}
                        className="organize-pdf-page-action"
                      >
                        <CropIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => removePage(index)} aria-label={`Remove page ${index + 1}`} className="organize-pdf-page-action">
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                  );
                })}
              </div>
            </section>
            {largePreview && (
              <div
                className="merge-page-preview-backdrop"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) closeLargePreview();
                }}
              >
                <section
                  className={`merge-page-preview-dialog ${largePreview.mode === 'crop' ? 'organize-pdf-crop-dialog' : ''}`}
                  role="dialog"
                  aria-modal="true"
                  aria-label={largePreview.mode === 'crop'
                    ? `Crop page ${largePreview.pageNumber}`
                    : `Page ${largePreview.pageNumber} preview`}
                >
                  <div className="merge-page-preview-dialog-header">
                    <h3>{file.name} · {largePreview.mode === 'crop' ? 'Crop page' : 'Page'} {largePreview.pageNumber}</h3>
                    <button
                      ref={largePreviewCloseRef}
                      type="button"
                      onClick={closeLargePreview}
                      aria-label={largePreview.mode === 'crop' ? 'Close crop editor' : 'Close larger page preview'}
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  {largePreview.mode === 'crop' ? (
                    <>
                      <p className="organize-pdf-crop-instructions">
                        Drag on the page to select an area. Move the selection, adjust its handles, or enter exact percentages.
                      </p>
                      {largePreview.preview && largePreview.crop ? (
                        <>
                          <div
                            ref={cropStageRef}
                            className="organize-pdf-crop-stage"
                            style={{
                              width: `min(100%, ${largePreview.width}px)`,
                              aspectRatio: `${largePreview.width} / ${largePreview.height}`
                            }}
                            onPointerDown={handleCropPointerDown}
                            onPointerMove={handleCropPointerMove}
                            onPointerUp={finishCropPointer}
                            onPointerCancel={finishCropPointer}
                          >
                            <img
                              src={largePreview.preview}
                              alt={`Crop preview of page ${largePreview.pageNumber}`}
                              draggable="false"
                            />
                            <div
                              className="organize-pdf-crop-frame"
                              style={{
                                left: `${largePreview.crop.x * 100}%`,
                                top: `${largePreview.crop.y * 100}%`,
                                width: `${largePreview.crop.width * 100}%`,
                                height: `${largePreview.crop.height * 100}%`
                              }}
                              role="group"
                              aria-label="Selected crop area"
                            >
                              {[
                                ['nw', 'top left'],
                                ['n', 'top'],
                                ['ne', 'top right'],
                                ['e', 'right'],
                                ['se', 'bottom right'],
                                ['s', 'bottom'],
                                ['sw', 'bottom left'],
                                ['w', 'left']
                              ].map(([handle, label]) => (
                                <button
                                  key={handle}
                                  type="button"
                                  className={`organize-pdf-crop-handle handle-${handle}`}
                                  data-organize-crop-handle={handle}
                                  aria-label={`Resize crop from ${label}`}
                                  onKeyDown={(event) => resizeCropByKeyboard(event, handle)}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="organize-pdf-crop-fields">
                            {[
                              ['left', 'Left (%)'],
                              ['top', 'Top (%)'],
                              ['width', 'Width (%)'],
                              ['height', 'Height (%)']
                            ].map(([bound, label]) => (
                              <label key={bound}>
                                <span>{label}</span>
                                <input
                                  type="number"
                                  min={bound === 'width' || bound === 'height' ? 2 : 0}
                                  max={100}
                                  step="0.1"
                                  value={(largePreview.crop[bound === 'left' ? 'x' : bound === 'top' ? 'y' : bound] * 100).toFixed(1)}
                                  onChange={(event) => updateCropBound(bound, event.target.value)}
                                />
                              </label>
                            ))}
                          </div>
                        </>
                      ) : largePreview.error ? (
                        <p role="alert">{largePreview.error}</p>
                      ) : (
                        <p role="status">Rendering page for cropping…</p>
                      )}
                      <div className="organize-pdf-crop-actions">
                        <button type="button" onClick={resetCropEditor}>Reset crop</button>
                        <button type="button" onClick={closeLargePreview}>Cancel</button>
                        <button type="button" onClick={saveCropEditor} disabled={!largePreview.preview}>Save crop</button>
                      </div>
                    </>
                  ) : largePreview.preview ? (
                    <img src={largePreview.preview} alt={`Larger preview of page ${largePreview.pageNumber}`} />
                  ) : largePreview.error ? (
                    <p role="alert">{largePreview.error}</p>
                  ) : (
                    <p role="status">Rendering larger page preview…</p>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="pdf-workflow-actions flex flex-wrap gap-3 justify-end">
        {file && (
          <>
            <button type="button" onClick={createPdf} disabled={isLoading || isProcessing || !hasChanges} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
              {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
              {isProcessing ? 'Creating PDF…' : 'Organize PDF'}
            </button>
            <button type="button" onClick={clearFile} disabled={isProcessing} className="rounded-lg border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
              Reset
            </button>
          </>
        )}
      </div>
      {output && file && (
        <DownloadReadyCard
          fileName={`${file.name.replace(/\.pdf$/i, '')}_organized.pdf`}
          sizeBytes={output.size}
          onDownload={downloadPdf}
        />
      )}
    </div>
  );
};

export default OrganizePdf;
