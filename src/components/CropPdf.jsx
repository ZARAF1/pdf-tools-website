import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useToolExitGuard } from './ToolExitGuard';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import { ArrowLeft, ArrowRight, Loader2, RotateCcw, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import pdfjsLib from '../lib/pdfjsClient';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';
import DownloadReadyCard from './DownloadReadyCard';

const MIN_CROP_SIZE = 0.05;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const fullPage = { x: 0, y: 0, width: 1, height: 1 };
const cropHandles = [
  { id: 'nw', label: 'top left corner', x: 0, y: 0 },
  { id: 'n', label: 'top edge', x: 50, y: 0 },
  { id: 'ne', label: 'top right corner', x: 100, y: 0 },
  { id: 'e', label: 'right edge', x: 100, y: 50 },
  { id: 'se', label: 'bottom right corner', x: 100, y: 100 },
  { id: 's', label: 'bottom edge', x: 50, y: 100 },
  { id: 'sw', label: 'bottom left corner', x: 0, y: 100 },
  { id: 'w', label: 'left edge', x: 0, y: 50 }
];

const formatBytes = (bytes) => (
  bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
);

const adjustCrop = (crop, handle, dx, dy) => {
  let left = crop.x;
  let right = crop.x + crop.width;
  let top = crop.y;
  let bottom = crop.y + crop.height;

  if (handle.includes('w')) left = clamp(left + dx, 0, right - MIN_CROP_SIZE);
  if (handle.includes('e')) right = clamp(right + dx, left + MIN_CROP_SIZE, 1);
  if (handle.includes('n')) top = clamp(top + dy, 0, bottom - MIN_CROP_SIZE);
  if (handle.includes('s')) bottom = clamp(bottom + dy, top + MIN_CROP_SIZE, 1);

  return { x: left, y: top, width: right - left, height: bottom - top };
};

const cropToPdfRectangle = (page, pdfPage, selection) => {
  const viewport = page.getViewport({ scale: 1 });
  const screenCorners = [
    [selection.x * viewport.width, selection.y * viewport.height],
    [(selection.x + selection.width) * viewport.width, selection.y * viewport.height],
    [selection.x * viewport.width, (selection.y + selection.height) * viewport.height],
    [(selection.x + selection.width) * viewport.width, (selection.y + selection.height) * viewport.height]
  ];
  const pdfCorners = screenCorners.map(([x, y]) => viewport.convertToPdfPoint(x, y));
  const mediaBox = pdfPage.getMediaBox();
  const cropBox = pdfPage.getCropBox();
  const bounds = {
    x: Math.max(mediaBox.x, cropBox.x),
    y: Math.max(mediaBox.y, cropBox.y),
    right: Math.min(mediaBox.x + mediaBox.width, cropBox.x + cropBox.width),
    top: Math.min(mediaBox.y + mediaBox.height, cropBox.y + cropBox.height)
  };
  const x = Math.max(bounds.x, Math.min(...pdfCorners.map(([pointX]) => pointX)));
  const y = Math.max(bounds.y, Math.min(...pdfCorners.map(([, pointY]) => pointY)));
  const right = Math.min(bounds.right, Math.max(...pdfCorners.map(([pointX]) => pointX)));
  const top = Math.min(bounds.top, Math.max(...pdfCorners.map(([, pointY]) => pointY)));
  const rectangle = { x, y, width: right - x, height: top - y };

  if (
    !Object.values(rectangle).every(Number.isFinite)
    || rectangle.width <= 0
    || rectangle.height <= 0
  ) {
    throw new Error('The crop area is outside the page or too small. Adjust it and try again.');
  }
  return rectangle;
};

const rectanglesMatch = (actual, expected) => (
  ['x', 'y', 'width', 'height'].every((key) => Math.abs(actual[key] - expected[key]) < 0.02)
);

const CropPdf = () => {
  const [file, setFile] = useState(null);
  const [pdfjsDocument, setPdfjsDocument] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [crop, setCrop] = useState(fullPage);
  const [cropBoundDrafts, setCropBoundDrafts] = useState({});
  const [draftCrops, setDraftCrops] = useState({});
  const [pageCrops, setPageCrops] = useState({});
  const [scope, setScope] = useState('current');
  const [previewWidth, setPreviewWidth] = useState(680);
  const [zoom, setZoom] = useState(1);
  const [renderInfo, setRenderInfo] = useState(null);
  const [pageTextSummary, setPageTextSummary] = useState('');
  const [output, setOutput] = useState(null);
  const markOutputDownloaded = useToolExitGuard(Boolean(file), output);
  const [isLoading, setIsLoading] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [previewMessage, setPreviewMessage] = useState('');
  const requestId = useRef(0);
  const loadingTaskRef = useRef(null);
  const previewAreaRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const dragRef = useRef(null);

  const clearOutput = useCallback(() => {
    setOutput(null);
  }, []);

  useEffect(() => {
    const element = previewAreaRef.current;
    if (!element) return undefined;
    const updateWidth = () => setPreviewWidth(Math.max(240, element.getBoundingClientRect().width - 32));
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, [file]);

  useEffect(() => {
    if (!pdfjsDocument) return undefined;
    return () => {
      pdfjsDocument.destroy().catch((destroyError) => {
        console.error('Unable to release the Crop PDF preview:', destroyError);
      });
    };
  }, [pdfjsDocument]);

  useEffect(() => () => {
    requestId.current += 1;
    loadingTaskRef.current?.destroy().catch((destroyError) => {
      console.error('Unable to cancel PDF loading:', destroyError);
    });
  }, []);

  const onDrop = useCallback(async (acceptedFiles, rejections) => {
    if (rejections.length) {
      setError('Choose one valid, unencrypted PDF file.');
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;
    const request = requestId.current + 1;
    requestId.current = request;
    setIsLoading(true);
    setError('');
    setPreviewMessage('');

    let loadingTask;
    try {
      const validated = await validateUnencryptedPdf(selectedFile);
      const count = validated.getPageCount();
      if (!count) throw new Error('This PDF does not contain any pages.');

      const data = new Uint8Array(await selectedFile.arrayBuffer());
      loadingTask = pdfjsLib.getDocument({ data });
      loadingTaskRef.current = loadingTask;
      const document = await loadingTask.promise;
      if (document.numPages !== count) {
        await document.destroy();
        throw new Error('The PDF preview could not read the expected page count.');
      }

      if (request !== requestId.current) {
        await document.destroy();
        return;
      }

      setFile(selectedFile);
      setPdfjsDocument(document);
      setPageCount(count);
      setCurrentPage(0);
      setCrop(fullPage);
      setCropBoundDrafts({});
      setDraftCrops({});
      setPageCrops({});
      setScope('current');
      setZoom(1);
      setRenderInfo(null);
      clearOutput();
    } catch (loadError) {
      if (request === requestId.current) {
        console.error('Unable to load PDF for cropping:', loadError);
        const message = loadError?.message || '';
        setError(/failed to parse pdf document|no pdf header found/i.test(message)
          ? 'This file could not be opened as a PDF. Choose a valid, unencrypted PDF.'
          : (message || 'This PDF is invalid or could not be opened.'));
      }
    } finally {
      if (loadingTaskRef.current === loadingTask) loadingTaskRef.current = null;
      if (request === requestId.current) setIsLoading(false);
    }
  }, [clearOutput]);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isLoading || isProcessing,
    noClick: Boolean(file),
    noKeyboard: Boolean(file)
  });

  useEffect(() => {
    if (!pdfjsDocument || !pageCount || !canvasRef.current) return undefined;
    let active = true;
    let task;
    setIsRendering(true);
    setPageTextSummary('');
    setRenderInfo(null);
    setPreviewMessage('');

    const renderPage = async () => {
      try {
        const page = await pdfjsDocument.getPage(currentPage + 1);
        if (!active) return;
        const baseViewport = page.getViewport({ scale: 1 });
        const fitScale = Math.min(1.25, Math.max(0.1, (previewWidth - 16) / baseViewport.width));
        const displayScale = fitScale * zoom;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: displayScale * pixelRatio });
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) throw new Error('Your browser could not create the PDF preview canvas.');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const info = {
          width: viewport.width / pixelRatio,
          height: viewport.height / pixelRatio,
          pixelRatio
        };
        setRenderInfo(info);
        task = page.render({ canvasContext: context, viewport, intent: 'display' });
        renderTaskRef.current = task;
        await task.promise;
        try {
          const textContent = await page.getTextContent();
          const summary = textContent.items
            .map((item) => ('str' in item ? item.str : ''))
            .filter(Boolean)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 320);
          if (active) setPageTextSummary(summary || 'No selectable text was found on this page; the preview is visual-only.');
        } catch {
          if (active) setPageTextSummary('Page text could not be extracted; the preview is visual-only.');
        }
      } catch (renderError) {
        if (active && renderError?.name !== 'RenderingCancelledException') {
          console.error('Unable to render PDF crop preview:', renderError);
          setPreviewMessage(renderError?.message || 'This page could not be rendered.');
        }
      } finally {
        if (active) setIsRendering(false);
        if (renderTaskRef.current === task) renderTaskRef.current = null;
      }
    };

    renderPage();
    return () => {
      active = false;
      task?.cancel();
      if (renderTaskRef.current === task) renderTaskRef.current = null;
    };
  }, [currentPage, pdfjsDocument, pageCount, previewWidth, zoom]);

  const removeFile = () => {
    requestId.current += 1;
    loadingTaskRef.current?.destroy().catch((destroyError) => {
      console.error('Unable to cancel PDF loading:', destroyError);
    });
    setFile(null);
    setPdfjsDocument(null);
    setPageCount(0);
    setCurrentPage(0);
    setCrop(fullPage);
    setCropBoundDrafts({});
    setDraftCrops({});
    setPageCrops({});
    setScope('current');
    setRenderInfo(null);
    setIsLoading(false);
    setError('');
    setPreviewMessage('');
    clearOutput();
  };

  const navigatePage = (pageIndex) => {
    if (pageIndex < 0 || pageIndex >= pageCount) return;
    setCurrentPage(pageIndex);
    setCrop(pageCrops[pageIndex] || draftCrops[pageIndex] || fullPage);
  };

  const updateCrop = (nextCrop) => {
    setCrop(nextCrop);
    setDraftCrops((current) => ({ ...current, [currentPage]: nextCrop }));
  };

  const updateCropBound = (bound, value) => {
    setCropBoundDrafts((current) => ({ ...current, [bound]: value }));
    if (value.trim() === '') return;
    const amount = Number(value) / 100;
    if (!Number.isFinite(amount)) return;
    const nextCrop = { ...crop };
    if (bound === 'x') nextCrop.x = clamp(amount, 0, 1 - crop.width);
    if (bound === 'y') nextCrop.y = clamp(amount, 0, 1 - crop.height);
    if (bound === 'width') nextCrop.width = clamp(amount, MIN_CROP_SIZE, 1 - crop.x);
    if (bound === 'height') nextCrop.height = clamp(amount, MIN_CROP_SIZE, 1 - crop.y);
    updateCrop(nextCrop);
    clearOutput();
    setError('');
  };

  const pointFromEvent = (event) => {
    const stage = stageRef.current;
    const bounds = stage?.getBoundingClientRect();
    if (!stage || !bounds || !stage.clientWidth || !stage.clientHeight) return null;
    return {
      x: clamp((event.clientX - bounds.left - stage.clientLeft) / stage.clientWidth, 0, 1),
      y: clamp((event.clientY - bounds.top - stage.clientTop) / stage.clientHeight, 0, 1)
    };
  };

  const handlePointerDown = (event) => {
    if (!renderInfo || isRendering || isProcessing) return;
    const point = pointFromEvent(event);
    if (!point) return;
    const handle = event.target.closest('[data-crop-handle]')?.dataset.cropHandle;
    const inside = point.x >= crop.x
      && point.x <= crop.x + crop.width
      && point.y >= crop.y
      && point.y <= crop.y + crop.height;
    const start = handle
      ? {
        x: handle.includes('w') ? crop.x : (handle.includes('e') ? crop.x + crop.width : point.x),
        y: handle.includes('n') ? crop.y : (handle.includes('s') ? crop.y + crop.height : point.y)
      }
      : point;
    dragRef.current = {
      mode: handle ? 'resize' : (inside ? 'move' : 'draw'),
      handle,
      start,
      initialCrop: crop
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    clearOutput();
    setError('');
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    const point = pointFromEvent(event);
    if (!point) return;
    const dx = point.x - drag.start.x;
    const dy = point.y - drag.start.y;
    if (drag.mode === 'move') {
      updateCrop({
        ...drag.initialCrop,
        x: clamp(drag.initialCrop.x + dx, 0, 1 - drag.initialCrop.width),
        y: clamp(drag.initialCrop.y + dy, 0, 1 - drag.initialCrop.height)
      });
    } else if (drag.mode === 'resize') {
      updateCrop(adjustCrop(drag.initialCrop, drag.handle, dx, dy));
    } else {
      const left = Math.min(drag.start.x, point.x);
      const top = Math.min(drag.start.y, point.y);
      updateCrop({
        x: clamp(left, 0, 1 - MIN_CROP_SIZE),
        y: clamp(top, 0, 1 - MIN_CROP_SIZE),
        width: clamp(Math.abs(dx), MIN_CROP_SIZE, 1 - left),
        height: clamp(Math.abs(dy), MIN_CROP_SIZE, 1 - top)
      });
    }
  };

  const finishPointer = (event) => {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const resizeByKeyboard = (event, handle) => {
    const step = event.shiftKey ? 0.05 : 0.01;
    const changes = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step]
    };
    const change = changes[event.key];
    if (!change) return;
    event.preventDefault();
    clearOutput();
    updateCrop(adjustCrop(crop, handle, change[0], change[1]));
  };

  const resetCrop = () => {
    setCrop(fullPage);
    setCropBoundDrafts({});
    setDraftCrops({});
    setPageCrops({});
    clearOutput();
    setError('');
  };

  const adjustCurrentCrop = () => {
    setCrop(pageCrops[currentPage] || fullPage);
    setCropBoundDrafts({});
    setOutput(null);
  };

  const applyCrop = async () => {
    if (!file || !pdfjsDocument || !pageCount) {
      setError('Choose a PDF before applying a crop.');
      return;
    }
    if (crop.width >= 0.9999 && crop.height >= 0.9999 && crop.x <= 0.0001 && crop.y <= 0.0001) {
      setError('Adjust the crop area before applying it.');
      return;
    }

    setIsProcessing(true);
    setError('');
    clearOutput();
    try {
      const source = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: false,
        updateMetadata: false
      });
      if (source.isEncrypted) throw new Error('Password-protected PDFs are not supported.');
      if (source.getPageCount() !== pageCount) throw new Error('The source PDF changed. Please select it again.');

      const cropMap = scope === 'all'
        ? Object.fromEntries(Array.from({ length: pageCount }, (_, index) => [index, { ...crop }]))
        : { ...pageCrops, [currentPage]: { ...crop } };
      const pageIndices = Object.keys(cropMap).map(Number).sort((a, b) => a - b);
      const expected = new Map();
      for (const pageIndex of pageIndices) {
        const pdfJsPage = await pdfjsDocument.getPage(pageIndex + 1);
        const pdfPage = source.getPage(pageIndex);
        const pageSelection = cropMap[pageIndex];
        const rectangle = cropToPdfRectangle(pdfJsPage, pdfPage, pageSelection);
        const baseViewport = pdfJsPage.getViewport({ scale: 1 });
        expected.set(pageIndex, {
          rectangle,
          width: baseViewport.width * pageSelection.width,
          height: baseViewport.height * pageSelection.height
        });
        pdfPage.setCropBox(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
      }

      const bytes = await source.save({ useObjectStreams: true });
      const verified = await PDFDocument.load(bytes, { updateMetadata: false });
      if (verified.getPageCount() !== pageCount || verified.isEncrypted) {
        throw new Error('The generated PDF did not pass page-count or encryption validation.');
      }
      for (const [pageIndex, value] of expected) {
        if (!rectanglesMatch(verified.getPage(pageIndex).getCropBox(), value.rectangle)) {
          throw new Error(`The exported crop on page ${pageIndex + 1} did not match the selection.`);
        }
      }

      const outputLoadingTask = pdfjsLib.getDocument({ data: new Uint8Array(bytes) });
      try {
        const outputPreview = await outputLoadingTask.promise;
        if (outputPreview.numPages !== pageCount) throw new Error('The exported PDF preview has an unexpected page count.');
        for (const [pageIndex, value] of expected) {
          const outputPage = await outputPreview.getPage(pageIndex + 1);
          const outputViewport = outputPage.getViewport({ scale: 1 });
          if (
            Math.abs(outputViewport.width - value.width) > 0.05
            || Math.abs(outputViewport.height - value.height) > 0.05
          ) {
            throw new Error(`The exported dimensions on page ${pageIndex + 1} did not match the crop area.`);
          }
        }
        await outputPreview.destroy();
      } catch (verificationError) {
        await outputLoadingTask.destroy().catch((destroyError) => {
          console.error('Unable to release the exported PDF verification:', destroyError);
        });
        throw verificationError;
      }

      setOutput(new Blob([bytes], { type: 'application/pdf' }));
      setPageCrops(cropMap);
      setDraftCrops((current) => ({ ...current, ...cropMap }));
    } catch (processError) {
      console.error('Unable to crop PDF:', processError);
      setError(processError?.message || 'The PDF could not be cropped. Try another document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!output || !file) return;
    const url = URL.createObjectURL(output);
    const anchor = window.document.createElement('a');
    anchor.href = url;
    anchor.download = `${file.name.replace(/\.pdf$/i, '') || 'document'}_cropped.pdf`;
    anchor.style.display = 'none';
    window.document.body.appendChild(anchor);
    anchor.click();
    markOutputDownloaded();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const displayedCrop = output ? pageCrops[currentPage] : null;
  const stageWidth = renderInfo ? renderInfo.width * (displayedCrop?.width ?? 1) : undefined;
  const stageHeight = renderInfo ? renderInfo.height * (displayedCrop?.height ?? 1) : undefined;
  const handleStyle = (handle) => ({
    left: `${handle.x}%`,
    top: `${handle.y}%`
  });

  return (
    <div className="crop-pdf-tool">
      <div
        {...getRootProps({
          role: 'group',
          'aria-label': file ? `Selected PDF ${file.name}` : 'Choose a PDF to crop'
        })}
        className={`crop-pdf-upload pdf-workflow-upload merge-pdf-upload-zone ${isDragActive ? 'is-drag-active' : ''}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="crop-pdf-file">
            <div className="crop-pdf-file-details">
              <AttachedFileIcon />
              <div>
              <strong>{file.name}</strong>
              <span>{formatBytes(file.size)} · {pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
              </div>
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
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-blue-600" /> : <Upload className="h-6 w-6 text-blue-600" />}
            </div>
            <div className="merge-pdf-upload-copy">
              <h3>{isLoading ? 'Loading and validating PDF…' : isDragActive ? 'Drop the PDF here' : 'Choose or drop a PDF to crop'}</h3>
              <p>Crop PDF pages to adjust the visible page area.</p>
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

      {isLoading && (
        <p className="crop-pdf-message" role="status"><Loader2 className="crop-pdf-spinner" aria-hidden="true" size={17} /> Loading and checking PDF pages...</p>
      )}
      {error && <p className="crop-pdf-message crop-pdf-error" role="alert">{error}</p>}

      {file && pdfjsDocument && (
        <div className="crop-pdf-workspace">
          <div className="crop-pdf-toolbar">
            <div className="crop-pdf-page-navigation" aria-label="PDF page navigation">
              <button type="button" className="crop-pdf-icon-button" onClick={() => navigatePage(currentPage - 1)} disabled={currentPage === 0 || isProcessing} aria-label="Previous page">
                <ArrowLeft aria-hidden="true" size={18} />
              </button>
              <span aria-live="polite">Page {currentPage + 1} of {pageCount}</span>
              <button type="button" className="crop-pdf-icon-button" onClick={() => navigatePage(currentPage + 1)} disabled={currentPage >= pageCount - 1 || isProcessing} aria-label="Next page">
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            </div>
            <div className="crop-pdf-zoom-controls" aria-label="Preview zoom">
              <button type="button" className="crop-pdf-icon-button" onClick={() => setZoom((value) => Math.max(0.75, Math.round((value - 0.25) * 100) / 100))} disabled={zoom <= 0.75 || isProcessing} aria-label="Zoom out">
                <ZoomOut aria-hidden="true" size={18} />
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button type="button" className="crop-pdf-icon-button" onClick={() => setZoom((value) => Math.min(1.5, Math.round((value + 0.25) * 100) / 100))} disabled={zoom >= 1.5 || isProcessing} aria-label="Zoom in">
                <ZoomIn aria-hidden="true" size={18} />
              </button>
            </div>
          </div>

          <div className="crop-pdf-scope">
            <label htmlFor="crop-pdf-scope">Apply crop to</label>
            <select
              id="crop-pdf-scope"
              value={scope}
              onChange={(event) => {
                setScope(event.target.value);
                clearOutput();
              }}
              disabled={isProcessing}
            >
              <option value="current">Current page only</option>
              <option value="all">All pages</option>
            </select>
            <span>
              {scope === 'all'
                ? 'Applies this relative crop to every page, replacing earlier page-specific crop settings.'
                : 'Crops only the current page; previously cropped pages remain included.'}
            </span>
          </div>

          <fieldset className="crop-pdf-bounds" disabled={isProcessing || isRendering}>
            <legend>Crop area bounds</legend>
            <p id="crop-pdf-bounds-help">
              Set the crop using the keyboard. Values are percentages measured from the page&apos;s top-left corner; the crop stays within the page.
            </p>
            <div className="crop-pdf-bounds-grid">
              {[
                ['width', 'Width', MIN_CROP_SIZE * 100, 100 - crop.x * 100],
                ['height', 'Height', MIN_CROP_SIZE * 100, 100 - crop.y * 100],
                ['x', 'Left', 0, 100 - crop.width * 100],
                ['y', 'Top', 0, 100 - crop.height * 100]
              ].map(([bound, label, min, max]) => (
                <div key={bound}>
                  <label htmlFor={`crop-pdf-${bound}`}>{label} (%)</label>
                  <input
                    id={`crop-pdf-${bound}`}
                    type="number"
                    min={min}
                    max={max}
                    step="0.1"
                    value={Object.prototype.hasOwnProperty.call(cropBoundDrafts, bound)
                      ? cropBoundDrafts[bound]
                      : (crop[bound] * 100).toFixed(1)}
                    aria-describedby="crop-pdf-bounds-help"
                    onChange={(event) => updateCropBound(bound, event.target.value)}
                    onBlur={() => setCropBoundDrafts((current) => {
                      const next = { ...current };
                      delete next[bound];
                      return next;
                    })}
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <div className="crop-pdf-preview-area" ref={previewAreaRef}>
            {isRendering && <p className="crop-pdf-preview-status" role="status"><Loader2 className="crop-pdf-spinner" aria-hidden="true" size={16} /> Rendering page preview...</p>}
            {previewMessage && <p className="crop-pdf-message crop-pdf-error" role="alert">{previewMessage}</p>}
            {pdfjsDocument && (
              <div
                ref={stageRef}
                className={`crop-pdf-page-stage ${displayedCrop ? 'is-cropped-preview' : ''}`}
                style={{ width: renderInfo ? stageWidth : 1, height: renderInfo ? stageHeight : 1 }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={finishPointer}
                onPointerCancel={finishPointer}
              >
                <canvas
                  ref={canvasRef}
                  className="crop-pdf-canvas"
                  role="img"
                  aria-label={`Preview of page ${currentPage + 1}`}
                  aria-describedby="crop-pdf-page-description"
                  style={{
                    width: renderInfo?.width ?? 0,
                    height: renderInfo?.height ?? 0,
                    left: displayedCrop && renderInfo ? -displayedCrop.x * renderInfo.width : 0,
                    top: displayedCrop && renderInfo ? -displayedCrop.y * renderInfo.height : 0
                  }}
                />
                <p id="crop-pdf-page-description" className="sr-only">
                  {pageTextSummary || 'This is a visual preview of the PDF page; extracted text is not available yet.'}
                </p>
                {renderInfo && !displayedCrop && (
                  <>
                    <svg className="crop-pdf-shade" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                      <path
                        d={`M0 0H100V100H0Z M${crop.x * 100} ${crop.y * 100}h${crop.width * 100}v${crop.height * 100}h${-crop.width * 100}Z`}
                        fillRule="evenodd"
                      />
                    </svg>
                    <div
                      className="crop-pdf-selection"
                      style={{
                        left: `${crop.x * 100}%`,
                        top: `${crop.y * 100}%`,
                        width: `${crop.width * 100}%`,
                        height: `${crop.height * 100}%`
                      }}
                    />
                    {cropHandles.map((handle) => (
                      <button
                        key={handle.id}
                        type="button"
                        className={`crop-pdf-handle crop-pdf-handle-${handle.id}`}
                        style={handleStyle(handle)}
                        data-crop-handle={handle.id}
                        aria-label={`Resize crop from ${handle.label}; use arrow keys to adjust`}
                        title={`Resize from ${handle.label}`}
                        disabled={isProcessing || isRendering}
                        onKeyDown={(event) => resizeByKeyboard(event, handle.id)}
                      />
                    ))}
                  </>
                )}
              </div>
            )}
            {renderInfo && (
              <>
                <p className="crop-pdf-measurement">
                  {displayedCrop
                    ? `Cropped preview: ${Math.round(displayedCrop.width * 100)}% × ${Math.round(displayedCrop.height * 100)}% of the original page.`
                    : `Crop area: ${Math.round(crop.width * 100)}% × ${Math.round(crop.height * 100)}% of the visible page.`}
                </p>
                {output && !displayedCrop && (
                  <p className="crop-pdf-message">The current page was not included in the last crop. The source page is shown here.</p>
                )}
              </>
            )}
          </div>

          <div className="crop-pdf-actions">
            {output && displayedCrop && (
              <button type="button" className="crop-pdf-button crop-pdf-button-secondary" onClick={adjustCurrentCrop} disabled={isProcessing || isRendering}>
                Adjust current page crop
              </button>
            )}
            <button type="button" className="crop-pdf-button crop-pdf-button-secondary" onClick={resetCrop} disabled={isProcessing || isRendering}>
              <RotateCcw aria-hidden="true" size={16} /> Reset crop
            </button>
            <button type="button" className="crop-pdf-button crop-pdf-button-primary" onClick={applyCrop} disabled={isProcessing || isRendering || isLoading}>
              {isProcessing ? <Loader2 className="crop-pdf-spinner" aria-hidden="true" size={17} /> : null}
              {isProcessing ? 'Applying crop...' : 'Apply crop'}
            </button>
          </div>
          {output && file && (
            <DownloadReadyCard
              fileName={`${file.name.replace(/\.pdf$/i, '') || 'document'}_cropped.pdf`}
              sizeBytes={output.size}
              onDownload={downloadPdf}
            />
          )}
          <p className="crop-pdf-disclosure">
            Cropping changes each page&apos;s visible CropBox boundary; it does not erase content outside that boundary. Hidden content may be recovered by changing the PDF page box. Your original file is left untouched.
          </p>
        </div>
      )}
    </div>
  );
};

export default CropPdf;
