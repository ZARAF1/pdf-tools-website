import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import useAccessibleDropzone from '../lib/useAccessibleDropzone';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  FileImage,
  Highlighter,
  ImagePlus,
  Loader2,
  Minus,
  MousePointer2,
  Pencil,
  Redo2,
  RectangleHorizontal,
  RotateCcw,
  Save,
  Trash2,
  Type,
  Undo2,
  Upload
} from 'lucide-react';
import pdfjsLib from '../lib/pdfjsClient';
import { validateUnencryptedPdf } from '../lib/pdfValidation';
import { AttachedFileActions, AttachedFileIcon } from './AttachedFileControls';

const TOOL_OPTIONS = [
  { id: 'select', label: 'Select / move', icon: MousePointer2 },
  { id: 'text', label: 'Add text', icon: Type },
  { id: 'image', label: 'Add image', icon: ImagePlus },
  { id: 'draw', label: 'Draw', icon: Pencil },
  { id: 'highlight', label: 'Highlight', icon: Highlighter },
  { id: 'rectangle', label: 'Rectangle', icon: RectangleHorizontal },
  { id: 'line', label: 'Line', icon: Minus }
];

const hexToRgb = (value) => {
  const normalized = value.replace('#', '');
  return rgb(
    parseInt(normalized.slice(0, 2), 16) / 255,
    parseInt(normalized.slice(2, 4), 16) / 255,
    parseInt(normalized.slice(4, 6), 16) / 255
  );
};

const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / (1024 ** index);
  return `${size >= 10 || index === 0 ? size.toFixed(0) : size.toFixed(1)} ${units[index]}`;
};

const destroyPdfJsDocument = async (document) => {
  if (!document) return;
  try {
    await document.destroy();
  } catch (destroyError) {
    console.error('Unable to release PDF preview resources:', destroyError);
  }
};

const getEditorState = (commands) => {
  const items = new Map();
  const deletedPageIds = new Set();

  commands.forEach((command) => {
    if (command.type === 'add') items.set(command.item.id, command.item);
    if (command.type === 'delete-page') deletedPageIds.add(command.pageId);
    if (command.type === 'remove-item') items.delete(command.itemId);
    if (command.type === 'move-item') {
      const item = items.get(command.itemId);
      if (item) items.set(item.id, moveItem(item, command.dx, command.dy));
    }
    if (command.type === 'resize-image') {
      const item = items.get(command.itemId);
      if (item?.type === 'image') items.set(item.id, { ...item, width: command.width, height: command.height });
    }
  });

  return { items: [...items.values()], deletedPageIds };
};

const moveItem = (item, dx, dy) => {
  if (item.type === 'text' || item.type === 'image' || item.type === 'rectangle' || item.type === 'highlight') {
    return { ...item, x: item.x + dx, y: item.y + dy };
  }
  if (item.type === 'line') {
    return { ...item, x1: item.x1 + dx, y1: item.y1 + dy, x2: item.x2 + dx, y2: item.y2 + dy };
  }
  return { ...item, points: item.points.map((point) => ({ x: point.x + dx, y: point.y + dy })) };
};

const getItemBounds = (item) => {
  if (item.type === 'text') {
    return {
      x: item.x,
      y: item.y - item.size * 0.25,
      width: item.text.length * item.size * 0.62,
      height: item.size * 1.25
    };
  }
  if (item.type === 'image' || item.type === 'rectangle' || item.type === 'highlight') {
    return { x: item.x, y: item.y, width: item.width, height: item.height };
  }
  const points = item.type === 'line'
    ? [{ x: item.x1, y: item.y1 }, { x: item.x2, y: item.y2 }]
    : item.points;
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return {
    x: Math.min(...xs) - item.strokeWidth,
    y: Math.min(...ys) - item.strokeWidth,
    width: Math.max(item.strokeWidth * 2, Math.max(...xs) - Math.min(...xs) + item.strokeWidth * 2),
    height: Math.max(item.strokeWidth * 2, Math.max(...ys) - Math.min(...ys) + item.strokeWidth * 2)
  };
};

const EditorItem = ({ item, selected }) => {
  let artwork = null;
  if (item.type === 'text') {
    artwork = (
      <text
        transform={`translate(${item.x} ${item.y}) scale(1 -1)`}
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize={item.size}
        fill={item.color}
      >
        {item.text}
      </text>
    );
  } else if (item.type === 'image') {
    artwork = (
      <image
        href={item.previewUrl}
        x={item.x}
        y={item.y}
        width={item.width}
        height={item.height}
        preserveAspectRatio="none"
        transform={`translate(0 ${2 * item.y + item.height}) scale(1 -1)`}
      />
    );
  } else if (item.type === 'rectangle') {
    artwork = (
      <rect
        x={item.x}
        y={item.y}
        width={item.width}
        height={item.height}
        fill="none"
        stroke={item.color}
        strokeWidth={item.strokeWidth}
      />
    );
  } else if (item.type === 'highlight') {
    artwork = (
      <rect
        x={item.x}
        y={item.y}
        width={item.width}
        height={item.height}
        fill={item.color}
        fillOpacity="0.35"
      />
    );
  } else if (item.type === 'line') {
    artwork = (
      <line
        x1={item.x1}
        y1={item.y1}
        x2={item.x2}
        y2={item.y2}
        stroke={item.color}
        strokeWidth={item.strokeWidth}
        strokeLinecap="round"
      />
    );
  } else if (item.type === 'draw') {
    artwork = (
      <polyline
        points={item.points.map((point) => `${point.x},${point.y}`).join(' ')}
        fill="none"
        stroke={item.color}
        strokeWidth={item.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }

  const bounds = selected ? getItemBounds(item) : null;
  return (
    <g>
      {artwork}
      {selected && (
        <rect
          x={bounds.x}
          y={bounds.y}
          width={bounds.width}
          height={bounds.height}
          fill="none"
          stroke="#2563eb"
          strokeWidth="1.5"
          strokeDasharray="5 3"
          pointerEvents="none"
        />
      )}
    </g>
  );
};

const EditPdf = () => {
  const [file, setFile] = useState(null);
  const [sourceBytes, setSourceBytes] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pdfjsDocument, setPdfjsDocument] = useState(null);
  const [currentPageId, setCurrentPageId] = useState(0);
  const [history, setHistory] = useState({ done: [], undone: [] });
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeTool, setActiveTool] = useState('select');
  const [color, setColor] = useState('#dc2626');
  const [fontSize, setFontSize] = useState(18);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [textPosition, setTextPosition] = useState(null);
  const [textValue, setTextValue] = useState('');
  const [pendingImage, setPendingImage] = useState(null);
  const [imageWidth, setImageWidth] = useState(144);
  const [imageWidthDraft, setImageWidthDraft] = useState('');
  const [draftItem, setDraftItem] = useState(null);
  const [dragPreview, setDragPreview] = useState(null);
  const [keyboardPoint, setKeyboardPoint] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [canvasAreaWidth, setCanvasAreaWidth] = useState(720);
  const [renderInfo, setRenderInfo] = useState(null);
  const [pageTextSummary, setPageTextSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [deletePageConfirmation, setDeletePageConfirmation] = useState(false);
  const requestId = useRef(0);
  const itemId = useRef(0);
  const canvasAreaRef = useRef(null);
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const renderTaskRef = useRef(null);
  const pdfjsDocumentRef = useRef(null);
  const renderInfoRef = useRef(null);
  const imageInputRef = useRef(null);
  const textInputRef = useRef(null);
  const imageUrlsRef = useRef(new Set());
  const pointerStateRef = useRef(null);

  const editorState = useMemo(() => getEditorState(history.done), [history.done]);
  const visiblePageIds = useMemo(
    () => Array.from({ length: pageCount }, (_, index) => index)
      .filter((pageId) => !editorState.deletedPageIds.has(pageId)),
    [editorState.deletedPageIds, pageCount]
  );
  const currentPageIndex = visiblePageIds.indexOf(currentPageId);
  const pageItems = editorState.items.filter((item) => item.pageId === currentPageId);
  const selectedItem = pageItems.find((item) => item.id === selectedItemId);
  const hasChanges = history.done.length > 0;

  const pushCommand = useCallback((command) => {
    setHistory((current) => ({ done: [...current.done, command], undone: [] }));
    setOutput(null);
    setStatus('');
  }, []);

  const clearImageUrls = useCallback(() => {
    imageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    imageUrlsRef.current.clear();
  }, []);

  const clearWorkspace = useCallback(() => {
    requestId.current += 1;
    renderTaskRef.current?.cancel();
    renderTaskRef.current = null;
    if (pdfjsDocumentRef.current) {
      void destroyPdfJsDocument(pdfjsDocumentRef.current);
      pdfjsDocumentRef.current = null;
    }
    clearImageUrls();
    setFile(null);
    setSourceBytes(null);
    setPageCount(0);
    setPdfjsDocument(null);
    setCurrentPageId(0);
    setHistory({ done: [], undone: [] });
    setSelectedItemId(null);
    setActiveTool('select');
    setTextPosition(null);
    setTextValue('');
    setPendingImage(null);
    setImageWidth(144);
    setImageWidthDraft('');
    setDraftItem(null);
    setDragPreview(null);
    setKeyboardPoint(null);
    setRenderInfo(null);
    setIsLoading(false);
    setIsRendering(false);
    setIsSaving(false);
    setOutput(null);
    setError('');
    setStatus('');
    setDeletePageConfirmation(false);
  }, [clearImageUrls]);

  useEffect(() => () => {
    requestId.current += 1;
    renderTaskRef.current?.cancel();
    void destroyPdfJsDocument(pdfjsDocumentRef.current);
    clearImageUrls();
  }, [clearImageUrls]);

  useEffect(() => {
    const element = canvasAreaRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver((entries) => {
      setCanvasAreaWidth(entries[0].contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const onDrop = useCallback(async (acceptedFiles, rejections) => {
    setError('');
    setStatus('');
    if (rejections.length) {
      setError('Choose a valid, unencrypted PDF file.');
      return;
    }
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;
    setIsLoading(true);
    let candidateDocument;
    try {
      const validatedPdf = await validateUnencryptedPdf(selectedFile);
      const bytes = new Uint8Array(await selectedFile.arrayBuffer());
      const count = validatedPdf.getPageCount();
      if (count < 1) throw new Error('This PDF does not contain any pages.');

      const loadingTask = pdfjsLib.getDocument({ data: bytes.slice() });
      candidateDocument = await loadingTask.promise;
      if (candidateDocument.numPages !== count) {
        throw new Error('The PDF preview could not read all pages from this document.');
      }
      await candidateDocument.getPage(1);
      if (requestId.current !== currentRequest) return;

      renderTaskRef.current?.cancel();
      await destroyPdfJsDocument(pdfjsDocumentRef.current);
      clearImageUrls();
      pdfjsDocumentRef.current = candidateDocument;
      setPdfjsDocument(candidateDocument);
      setFile(selectedFile);
      setSourceBytes(bytes);
      setPageCount(count);
      setCurrentPageId(0);
      setHistory({ done: [], undone: [] });
      setSelectedItemId(null);
      setActiveTool('select');
      setTextPosition(null);
      setTextValue('');
      setPendingImage(null);
      setKeyboardPoint(null);
      setOutput(null);
      setRenderInfo(null);
      setDeletePageConfirmation(false);
      setStatus(`${selectedFile.name} loaded. ${count} ${count === 1 ? 'page' : 'pages'} ready to edit.`);
      candidateDocument = null;
    } catch (loadError) {
      console.error('Unable to load PDF for editing:', loadError);
      if (requestId.current === currentRequest) {
        const message = loadError?.message || '';
        const isParseError = /failed to parse pdf|no pdf header|invalid pdf/i.test(message);
        setError(isParseError ? 'Choose a valid, unencrypted PDF that can be opened in this browser.' : message || 'This PDF could not be opened.');
      }
    } finally {
      if (candidateDocument) await destroyPdfJsDocument(candidateDocument);
      if (requestId.current === currentRequest) setIsLoading(false);
    }
  }, [clearImageUrls]);

  const { getRootProps, getInputProps, isDragActive, open } = useAccessibleDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isLoading || isSaving,
    noClick: true,
    noKeyboard: true
  });

  useEffect(() => {
    if (!pdfjsDocument || currentPageId < 0) return undefined;
    let active = true;
    let task;
    setIsRendering(true);
    setRenderInfo(null);
    setPageTextSummary('');

    const renderPage = async () => {
      try {
        const page = await pdfjsDocument.getPage(currentPageId + 1);
        if (!active) return;
        const baseViewport = page.getViewport({ scale: 1 });
        const fitScale = Math.min(1.35, Math.max(0.1, (canvasAreaWidth - 40) / baseViewport.width));
        const displayScale = fitScale * zoom;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: displayScale * pixelRatio });
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) throw new Error('Your browser could not create the PDF preview canvas.');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        canvas.style.width = `${viewport.width / pixelRatio}px`;
        canvas.style.height = `${viewport.height / pixelRatio}px`;
        const transform = viewport.transform.map((value) => value / pixelRatio);
        const info = {
          viewport,
          pixelRatio,
          width: viewport.width / pixelRatio,
          height: viewport.height / pixelRatio,
          svgTransform: `matrix(${transform.join(' ')})`
        };
        renderInfoRef.current = info;
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
          console.error('Unable to render PDF editor page:', renderError);
          setError(renderError?.message || 'This page could not be rendered.');
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
  }, [canvasAreaWidth, currentPageId, pdfjsDocument, zoom]);

  useEffect(() => {
    if (textPosition) textInputRef.current?.focus();
  }, [textPosition]);

  useEffect(() => {
    if (!selectedItem) {
      setImageWidthDraft('');
      return;
    }
    if (selectedItem.type === 'image') setImageWidthDraft(String(Math.round(selectedItem.width)));
  }, [selectedItem?.id, selectedItem?.width, selectedItem?.type]);

  const [pageDimensions, setPageDimensions] = useState(null);
  useEffect(() => {
    let active = true;
    if (!pdfjsDocument || currentPageId < 0) {
      setPageDimensions(null);
      return undefined;
    }
    pdfjsDocument.getPage(currentPageId + 1).then((page) => {
      const viewport = page.getViewport({ scale: 1, rotation: 0 });
      if (active) setPageDimensions({ width: viewport.width, height: viewport.height });
    }).catch((dimensionError) => {
      if (active) {
        console.error('Unable to read PDF page dimensions:', dimensionError);
        setError('The selected page dimensions could not be read.');
      }
    });
    return () => { active = false; };
  }, [currentPageId, pdfjsDocument]);

  const selectedPage = (pageId) => {
    setCurrentPageId(pageId);
    setSelectedItemId(null);
    setTextPosition(null);
    setDraftItem(null);
    setDragPreview(null);
    setKeyboardPoint(null);
    setDeletePageConfirmation(false);
  };

  const selectTool = (toolId) => {
    if (toolId === 'image') {
      imageInputRef.current?.click();
      return;
    }
    setActiveTool(toolId);
    setTextPosition(null);
    setDraftItem(null);
    setDragPreview(null);
    setKeyboardPoint(null);
    setError('');
  };

  const addText = () => {
    const text = textValue.trim();
    if (!text || !textPosition) {
      setError('Enter the text you want to add, then choose a position on the page.');
      return;
    }
    if (!Number.isFinite(fontSize) || fontSize < 4 || fontSize > 144) {
      setError('Text size must be between 4 and 144 points.');
      return;
    }
    pushCommand({
      type: 'add',
      item: {
        id: `edit-${itemId.current += 1}`,
        type: 'text',
        pageId: currentPageId,
        x: textPosition.x,
        y: textPosition.y,
        text,
        size: fontSize,
        color
      }
    });
    setTextPosition(null);
    setTextValue('');
    setActiveTool('select');
    setStatus('Text added to the page preview. Save PDF to create the edited copy.');
    setError('');
  };

  const onImageSelected = async (event) => {
    const imageFile = event.target.files?.[0];
    event.target.value = '';
    if (!imageFile) return;
    setError('');
    setStatus('');
    if (!['image/png', 'image/jpeg'].includes(imageFile.type)) {
      setError('Choose a PNG or JPEG image.');
      return;
    }
    try {
      const image = await createImageBitmap(imageFile);
      const previewUrl = URL.createObjectURL(imageFile);
      imageUrlsRef.current.add(previewUrl);
      const bytes = new Uint8Array(await imageFile.arrayBuffer());
      setPendingImage({
        bytes,
        mimeType: imageFile.type,
        name: imageFile.name,
        previewUrl,
        pixelWidth: image.width,
        pixelHeight: image.height
      });
      const initialWidth = Math.min(180, (pageDimensions?.width || 612) * 0.4);
      setImageWidth(initialWidth);
      setActiveTool('image');
      setKeyboardPoint(null);
      image.close();
      setStatus(`${imageFile.name} is ready. Click the page to place it.`);
    } catch (imageError) {
      console.error('Unable to read image for PDF editing:', imageError);
      setError(imageError?.message || 'The selected image could not be read.');
    }
  };

  const placePendingImage = (point) => {
    if (!pendingImage) return;
    const width = Number(imageWidth);
    if (!Number.isFinite(width) || width < 8 || width > 1440) {
      setError('Image width must be between 8 and 1440 points.');
      return;
    }
    const height = width / (pendingImage.pixelWidth / pendingImage.pixelHeight);
    pushCommand({
      type: 'add',
      item: {
        id: `edit-${itemId.current += 1}`,
        type: 'image',
        pageId: currentPageId,
        x: point.x,
        y: point.y,
        width,
        height,
        mimeType: pendingImage.mimeType,
        bytes: pendingImage.bytes,
        previewUrl: pendingImage.previewUrl
      }
    });
    setPendingImage(null);
    setActiveTool('select');
    setKeyboardPoint(null);
    setStatus('Image added to the page preview. Drag it to reposition, or select it to change its width.');
  };

  const pointFromPointer = (event) => {
    const info = renderInfoRef.current;
    const svg = svgRef.current;
    if (!info || !svg) return null;
    const bounds = svg.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return null;
    const viewportX = ((event.clientX - bounds.left) / bounds.width) * info.width;
    const viewportY = ((event.clientY - bounds.top) / bounds.height) * info.height;
    const [x, y] = info.viewport.convertToPdfPoint(
      viewportX * info.pixelRatio,
      viewportY * info.pixelRatio
    );
    return { x, y };
  };

  const hitTestItem = (point) => {
    for (let index = pageItems.length - 1; index >= 0; index -= 1) {
      const item = pageItems[index];
      const bounds = getItemBounds(item);
      if (
        point.x >= bounds.x - 6 && point.x <= bounds.x + bounds.width + 6
        && point.y >= bounds.y - 6 && point.y <= bounds.y + bounds.height + 6
      ) return item;
    }
    return null;
  };

  const onPointerDown = (event) => {
    if (isSaving || isLoading || !renderInfo) return;
    const point = pointFromPointer(event);
    if (!point) return;
    setError('');
    setStatus('');
    setKeyboardPoint(null);

    if (activeTool === 'text') {
      setTextPosition(point);
      setKeyboardPoint(null);
      return;
    }
    if (activeTool === 'image' && pendingImage) {
      placePendingImage(point);
      return;
    }
    if (activeTool === 'select') {
      const item = hitTestItem(point);
      setSelectedItemId(item?.id || null);
      if (item) {
        pointerStateRef.current = {
          type: 'move',
          itemId: item.id,
          start: point,
          item
        };
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      return;
    }

    pointerStateRef.current = { type: 'draw', tool: activeTool, start: point, current: point, points: [point] };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraftItem({
      type: activeTool,
      pageId: currentPageId,
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
      x1: point.x,
      y1: point.y,
      x2: point.x,
      y2: point.y,
      points: [point],
      color,
      strokeWidth
    });
  };

  const onPointerMove = (event) => {
    const pointer = pointerStateRef.current;
    if (!pointer) return;
    const point = pointFromPointer(event);
    if (!point) return;
    if (pointer.type === 'move') {
      setDragPreview({ dx: point.x - pointer.start.x, dy: point.y - pointer.start.y });
      return;
    }

    pointer.current = point;
    if (pointer.tool === 'draw') pointer.points.push(point);
    if (pointer.tool === 'line') {
      setDraftItem((current) => current && ({ ...current, x2: point.x, y2: point.y }));
      return;
    }
    if (pointer.tool === 'rectangle' || pointer.tool === 'highlight') {
      setDraftItem((current) => current && ({
        ...current,
        x: Math.min(pointer.start.x, point.x),
        y: Math.min(pointer.start.y, point.y),
        width: Math.abs(point.x - pointer.start.x),
        height: Math.abs(point.y - pointer.start.y)
      }));
      return;
    }
    setDraftItem((current) => current && ({ ...current, points: [...pointer.points] }));
  };

  const onPointerUp = (event) => {
    const pointer = pointerStateRef.current;
    if (!pointer) return;
    const point = pointFromPointer(event) || pointer.current;
    pointerStateRef.current = null;
    setDragPreview(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (pointer.type === 'move') {
      const dx = point.x - pointer.start.x;
      const dy = point.y - pointer.start.y;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        pushCommand({ type: 'move-item', itemId: pointer.itemId, dx, dy });
      }
      return;
    }

    const current = pointer.current || point;
    let item;
    if (pointer.tool === 'draw') {
      if (pointer.points.length < 2) pointer.points.push(current);
      item = { type: 'draw', points: pointer.points };
    } else if (pointer.tool === 'line') {
      item = { type: 'line', x1: pointer.start.x, y1: pointer.start.y, x2: current.x, y2: current.y };
    } else {
      const width = Math.abs(current.x - pointer.start.x);
      const height = Math.abs(current.y - pointer.start.y);
      if (width < 2 || height < 2) {
        setDraftItem(null);
        return;
      }
      item = {
        type: pointer.tool,
        x: Math.min(pointer.start.x, current.x),
        y: Math.min(pointer.start.y, current.y),
        width,
        height
      };
    }

    pushCommand({
      type: 'add',
      item: {
        ...item,
        id: `edit-${itemId.current += 1}`,
        pageId: currentPageId,
        color: pointer.tool === 'highlight' ? '#facc15' : color,
        strokeWidth
      }
    });
    setDraftItem(null);
    setActiveTool('select');
    setStatus('Edit added to the page preview. Save PDF to create the edited copy.');
  };

  const onCanvasKeyDown = (event) => {
    if (isSaving || isLoading) return;
    if (event.key === 'Escape') {
      if (textPosition) {
        setTextPosition(null);
        setTextValue('');
        event.preventDefault();
      } else if (pendingImage) {
        setPendingImage(null);
        setActiveTool('select');
        setKeyboardPoint(null);
        event.preventDefault();
      }
      return;
    }

    const directions = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, 1],
      ArrowDown: [0, -1]
    };
    const direction = directions[event.key];
    if (direction && activeTool === 'select' && selectedItem) {
      event.preventDefault();
      const step = event.shiftKey ? 10 : 2;
      pushCommand({
        type: 'move-item',
        itemId: selectedItem.id,
        dx: direction[0] * step,
        dy: direction[1] * step
      });
      return;
    }

    if (direction && (activeTool === 'text' || (activeTool === 'image' && pendingImage))) {
      event.preventDefault();
      const info = renderInfoRef.current;
      const viewportCenter = info
        ? info.viewport.convertToPdfPoint(info.width * info.pixelRatio / 2, info.height * info.pixelRatio / 2)
        : null;
      const center = pageDimensions
        ? { x: pageDimensions.width / 2, y: pageDimensions.height / 2 }
        : viewportCenter
          ? { x: viewportCenter[0], y: viewportCenter[1] }
          : { x: 0, y: 0 };
      const start = keyboardPoint || center;
      const step = event.shiftKey ? 50 : 10;
      setKeyboardPoint({
        x: Math.max(0, Math.min(pageDimensions?.width || Infinity, start.x + direction[0] * step)),
        y: Math.max(0, Math.min(pageDimensions?.height || Infinity, start.y + direction[1] * step))
      });
      return;
    }

    if (event.key === 'Enter' && keyboardPoint && activeTool === 'text') {
      setTextPosition(keyboardPoint);
      event.preventDefault();
      return;
    }
    if (event.key === 'Enter' && keyboardPoint && activeTool === 'image' && pendingImage) {
      placePendingImage(keyboardPoint);
      event.preventDefault();
    }
  };

  const commitImageWidth = () => {
    if (selectedItem?.type !== 'image') return;
    const width = Number(imageWidthDraft);
    if (!Number.isFinite(width) || width < 8 || width > 1440) {
      setError('Image width must be between 8 and 1440 points.');
      return;
    }
    const height = width / (selectedItem.width / selectedItem.height);
    pushCommand({ type: 'resize-image', itemId: selectedItem.id, width, height });
    setError('');
    setStatus('Image size updated in the page preview.');
  };

  const deleteCurrentPage = () => {
    if (visiblePageIds.length <= 1) {
      setError('At least one page must remain in the edited PDF.');
      return;
    }
    const currentIndex = visiblePageIds.indexOf(currentPageId);
    const nextPageId = visiblePageIds[currentIndex + 1] ?? visiblePageIds[currentIndex - 1];
    pushCommand({ type: 'delete-page', pageId: currentPageId });
    setSelectedItemId(null);
    setTextPosition(null);
    setCurrentPageId(nextPageId);
    setDeletePageConfirmation(false);
    setStatus(`Page ${currentPageId + 1} marked for deletion. Undo can restore it.`);
  };

  const undo = () => {
    setHistory((current) => {
      if (!current.done.length) return current;
      return {
        done: current.done.slice(0, -1),
        undone: [current.done[current.done.length - 1], ...current.undone]
      };
    });
    setOutput(null);
    setStatus('Last edit undone.');
  };

  const redo = () => {
    setHistory((current) => {
      if (!current.undone.length) return current;
      return {
        done: [...current.done, current.undone[0]],
        undone: current.undone.slice(1)
      };
    });
    setOutput(null);
    setStatus('Edit restored.');
  };

  const savePdf = async () => {
    if (!file || !sourceBytes || !visiblePageIds.length) {
      setError('Load a PDF with at least one page before saving.');
      return;
    }
    setIsSaving(true);
    setError('');
    setStatus('');
    setOutput(null);
    try {
      const document = await PDFDocument.load(sourceBytes.slice(), {
        ignoreEncryption: false,
        updateMetadata: false
      });
      if (document.isEncrypted) throw new Error('Password-protected PDFs are not supported.');
      const font = await document.embedFont(StandardFonts.Helvetica);
      const embeddedImages = new Map();
      for (const item of editorState.items) {
        if (editorState.deletedPageIds.has(item.pageId)) continue;
        const page = document.getPage(item.pageId);
        if (item.type === 'text') {
          try {
            font.encodeText(item.text);
          } catch {
            throw new Error('Added text contains characters not supported by the built-in font. Use Latin or Western European characters.');
          }
          page.drawText(item.text, { x: item.x, y: item.y, size: item.size, font, color: hexToRgb(item.color) });
        } else if (item.type === 'image') {
          let embedded = embeddedImages.get(item.id);
          if (!embedded) {
            embedded = item.mimeType === 'image/png'
              ? await document.embedPng(item.bytes)
              : await document.embedJpg(item.bytes);
            embeddedImages.set(item.id, embedded);
          }
          page.drawImage(embedded, { x: item.x, y: item.y, width: item.width, height: item.height });
        } else if (item.type === 'highlight') {
          page.drawRectangle({
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
            color: hexToRgb(item.color),
            opacity: 0.35
          });
        } else if (item.type === 'rectangle') {
          page.drawRectangle({
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
            borderColor: hexToRgb(item.color),
            borderWidth: item.strokeWidth
          });
        } else if (item.type === 'line') {
          page.drawLine({
            start: { x: item.x1, y: item.y1 },
            end: { x: item.x2, y: item.y2 },
            thickness: item.strokeWidth,
            color: hexToRgb(item.color)
          });
        } else if (item.type === 'draw') {
          for (let index = 1; index < item.points.length; index += 1) {
            page.drawLine({
              start: item.points[index - 1],
              end: item.points[index],
              thickness: item.strokeWidth,
              color: hexToRgb(item.color),
              lineCap: 1
            });
          }
        }
      }

      [...editorState.deletedPageIds].sort((a, b) => b - a).forEach((pageId) => document.removePage(pageId));
      const bytes = await document.save({ useObjectStreams: true });
      const verified = await PDFDocument.load(bytes, { updateMetadata: false });
      if (verified.getPageCount() !== visiblePageIds.length) {
        throw new Error('The saved PDF did not contain the expected number of pages.');
      }
      if (verified.isEncrypted) throw new Error('The saved PDF should not be password-protected.');
      setOutput(new Blob([bytes], { type: 'application/pdf' }));
      setStatus(`Edited PDF is ready. Verified ${verified.getPageCount()} ${verified.getPageCount() === 1 ? 'page' : 'pages'}.`);
    } catch (saveError) {
      console.error('Unable to save edited PDF:', saveError);
      setError(saveError?.message || 'The edited PDF could not be generated or validated.');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPdf = () => {
    if (!output || !file) return;
    const url = URL.createObjectURL(output);
    const anchor = window.document.createElement('a');
    anchor.href = url;
    anchor.download = `${file.name.replace(/\.pdf$/i, '')}_edited.pdf`;
    anchor.style.display = 'none';
    window.document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const displayItems = pageItems.map((item) => (
    dragPreview && item.id === selectedItemId ? moveItem(item, dragPreview.dx, dragPreview.dy) : item
  ));
  const draftOverlayItem = draftItem ? {
    ...draftItem,
    color: draftItem.type === 'highlight' ? '#facc15' : draftItem.color || color,
    strokeWidth: draftItem.strokeWidth || strokeWidth
  } : null;

  return (
    <div className="pdf-editor-shell">
      <input {...getInputProps()} aria-label="Choose a PDF to edit" />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        aria-label="Choose a PNG or JPEG image to place"
        onChange={onImageSelected}
      />

      <div
        {...getRootProps({
          role: 'group',
          'aria-label': file ? `Selected PDF ${file.name}` : 'PDF upload area'
        })}
        className={`pdf-editor-upload-zone merge-pdf-upload-zone edit-sign-upload-zone ${isDragActive ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`}
      >
        {file ? (
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <AttachedFileIcon />
            <div className="min-w-0">
              <p className="truncate font-semibold pdf-editor-text">{file.name}</p>
              <p className="text-sm pdf-editor-secondary">{formatBytes(file.size)} · {pageCount} {pageCount === 1 ? 'page' : 'pages'} · {visiblePageIds.length} remaining</p>
            </div>
          </div>
        ) : (
          <div className="merge-pdf-upload-content">
            <div className="pdf-upload-icon shrink-0" aria-hidden="true">
              {isLoading
                ? <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                : <Upload className="h-6 w-6 text-blue-600" />}
            </div>
            <div className="merge-pdf-upload-copy">
              <h3>{isLoading ? 'Loading and validating PDF…' : isDragActive ? 'Drop the PDF to open it' : 'Choose or drop a PDF to edit'}</h3>
              <p>Add text, images, drawings, highlights, and shapes to a PDF copy.</p>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                open();
              }}
              disabled={isLoading || isSaving}
              className="pdf-editor-primary-button merge-pdf-upload-button"
            >
              Choose PDF
            </button>
          </div>
        )}
        {file && (
          <AttachedFileActions
            fileName={file.name}
            onReplace={open}
            onRemove={clearWorkspace}
            disabled={isLoading || isSaving}
          />
        )}
      </div>

      {isLoading && file && <p className="pdf-editor-secondary text-sm" role="status">Validating replacement. Your current document and edits are preserved until the new PDF loads.</p>}
      {error && <p className="pdf-editor-message is-error" role="alert">{error}</p>}
      {status && <p className="pdf-editor-message" role="status">{status}</p>}

      {file && (
        <>
          <section aria-label="PDF editing controls" className="pdf-editor-toolbar">
            <div className="pdf-editor-tool-group" role="toolbar" aria-label="Editing tools">
              {TOOL_OPTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-label={label}
                  aria-pressed={activeTool === id}
                  title={label}
                  onClick={() => selectTool(id)}
                  disabled={isSaving || isLoading}
                  className="pdf-editor-tool-button"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="pdf-editor-options">
              {activeTool !== 'select' && activeTool !== 'image' && (
                <label className="pdf-editor-option">
                  <span>Colour</span>
                  <input aria-label="Edit colour" type="color" value={color} onChange={(event) => setColor(event.target.value)} />
                </label>
              )}
              {(activeTool === 'text' || activeTool === 'draw' || activeTool === 'rectangle' || activeTool === 'line') && (
                <label className="pdf-editor-option">
                  <span>{activeTool === 'text' ? 'Text size' : 'Line width'}</span>
                  <input
                    aria-label={activeTool === 'text' ? 'Text size in points' : 'Line width in points'}
                    type="number"
                    min={activeTool === 'text' ? 4 : 1}
                    max={activeTool === 'text' ? 144 : 24}
                    value={activeTool === 'text' ? fontSize : strokeWidth}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      if (activeTool === 'text') setFontSize(value);
                      else setStrokeWidth(value);
                    }}
                    className="pdf-editor-number-input"
                  />
                </label>
              )}
              {activeTool === 'image' && (
                <label className="pdf-editor-option">
                  <span>Image width (pt)</span>
                  <input
                    aria-label="Image width in points"
                    type="number"
                    min="8"
                    max="1440"
                    value={selectedItem?.type === 'image' ? imageWidthDraft : imageWidth}
                    onChange={(event) => {
                      const value = event.target.value;
                      setImageWidthDraft(value);
                      setImageWidth(value === '' ? '' : Number(value));
                    }}
                    className="pdf-editor-number-input"
                  />
                </label>
              )}
              {pageItems.length > 0 && (
                <label className="pdf-editor-option">
                  <span>Page marks</span>
                  <select
                    aria-label="Select a mark to edit"
                    value={selectedItemId || ''}
                    onChange={(event) => {
                      setSelectedItemId(event.target.value || null);
                      setActiveTool('select');
                    }}
                  >
                    <option value="">Choose a mark</option>
                    {pageItems.map((item, index) => (
                      <option key={item.id} value={item.id}>{index + 1}. {item.type}</option>
                    ))}
                  </select>
                </label>
              )}
              {selectedItem?.type === 'image' && activeTool === 'select' && (
                <div className="flex items-end gap-2">
                  <label className="pdf-editor-option">
                    <span>Image width (pt)</span>
                    <input
                      aria-label="Selected image width in points"
                      type="number"
                      min="8"
                      max="1440"
                      value={imageWidthDraft}
                      onChange={(event) => setImageWidthDraft(event.target.value)}
                      className="pdf-editor-number-input"
                    />
                  </label>
                  <button type="button" onClick={commitImageWidth} className="pdf-editor-action-button">Apply size</button>
                </div>
              )}
              <div className="flex items-center gap-1">
                <button type="button" onClick={undo} disabled={!history.done.length || isSaving} aria-label="Undo edit" title="Undo" className="pdf-editor-icon-button">
                  <Undo2 className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" onClick={redo} disabled={!history.undone.length || isSaving} aria-label="Redo edit" title="Redo" className="pdf-editor-icon-button">
                  <Redo2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              {selectedItem && (
                <button
                  type="button"
                  onClick={() => {
                    pushCommand({ type: 'remove-item', itemId: selectedItem.id });
                    setSelectedItemId(null);
                  }}
                  className="pdf-editor-action-button is-danger"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete selected mark
                </button>
              )}
            </div>

            {activeTool === 'image' && pendingImage && (
              <p className="pdf-editor-secondary text-sm" role="status">
                <FileImage className="mr-1 inline h-4 w-4" aria-hidden="true" />
                {pendingImage.name}: click the page to place it. Select and drag the image to move it; use Image width to resize.
              </p>
            )}
          </section>

          {textPosition && (
            <form
              className="pdf-editor-text-entry"
              onSubmit={(event) => {
                event.preventDefault();
                addText();
              }}
            >
              <label htmlFor="edit-pdf-text" className="pdf-editor-text font-semibold">Text for page {currentPageId + 1}</label>
              <input
                ref={textInputRef}
                id="edit-pdf-text"
                value={textValue}
                maxLength={500}
                onChange={(event) => setTextValue(event.target.value)}
                placeholder="Type the text to add"
                className="pdf-editor-text-input"
              />
              <button type="submit" className="pdf-editor-primary-button"><Check className="h-4 w-4" aria-hidden="true" /> Add text</button>
              <button type="button" onClick={() => setTextPosition(null)} className="pdf-editor-action-button">Cancel</button>
            </form>
          )}

          <div className="pdf-editor-workspace">
            <aside className="pdf-editor-pages" aria-label="PDF pages">
              <p className="pdf-editor-secondary mb-2 text-xs font-bold uppercase tracking-wide">Pages</p>
              {visiblePageIds.map((pageId, index) => (
                <button
                  key={pageId}
                  type="button"
                  aria-current={pageId === currentPageId ? 'page' : undefined}
                  onClick={() => selectedPage(pageId)}
                  className="pdf-editor-page-button"
                >
                  <span className="pdf-editor-page-number">{index + 1}</span>
                  <span>Page {pageId + 1}</span>
                </button>
              ))}
            </aside>

            <section className="pdf-editor-canvas-area" ref={canvasAreaRef} aria-label="Page preview and editor">
              <div className="pdf-editor-canvas-controls">
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setZoom((value) => Math.max(0.5, Math.round((value - 0.1) * 10) / 10))} disabled={zoom <= 0.5} aria-label="Zoom out" className="pdf-editor-icon-button">−</button>
                  <span className="pdf-editor-secondary min-w-12 text-center text-sm">{Math.round(zoom * 100)}%</span>
                  <button type="button" onClick={() => setZoom((value) => Math.min(2, Math.round((value + 0.1) * 10) / 10))} disabled={zoom >= 2} aria-label="Zoom in" className="pdf-editor-icon-button">+</button>
                </div>
                <p className="pdf-editor-text text-sm font-semibold">
                  Page {currentPageIndex + 1} of {visiblePageIds.length}
                </p>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => currentPageIndex > 0 && selectedPage(visiblePageIds[currentPageIndex - 1])} disabled={currentPageIndex <= 0} aria-label="Previous page" className="pdf-editor-icon-button">
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => currentPageIndex < visiblePageIds.length - 1 && selectedPage(visiblePageIds[currentPageIndex + 1])} disabled={currentPageIndex >= visiblePageIds.length - 1} aria-label="Next page" className="pdf-editor-icon-button">
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="pdf-editor-preview">
                {isRendering && <p className="pdf-editor-rendering" role="status"><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Rendering page…</p>}
                <div className="pdf-editor-page-stage" style={renderInfo ? { width: renderInfo.width, height: renderInfo.height } : undefined}>
                  <canvas
                    ref={canvasRef}
                    role="img"
                    aria-label={`Preview of page ${currentPageId + 1}`}
                    aria-describedby="edit-pdf-page-description"
                  />
                  <p id="edit-pdf-page-description" className="sr-only">
                    {pageTextSummary || 'This is a visual preview of the PDF page; extracted text is not available yet.'}
                  </p>
                  {renderInfo && (
                    <svg
                      ref={svgRef}
                      className={`pdf-editor-overlay ${activeTool !== 'select' ? 'is-drawing' : ''}`}
                      viewBox={`0 0 ${renderInfo.width} ${renderInfo.height}`}
                      width={renderInfo.width}
                      height={renderInfo.height}
                      role="group"
                      tabIndex={0}
                      aria-label={`Page ${currentPageId + 1} editor. Use arrow keys to position new text or images, then Enter. Select a mark and use arrow keys to move it.`}
                      aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Enter"
                      onPointerDown={onPointerDown}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      onPointerCancel={onPointerUp}
                      onKeyDown={onCanvasKeyDown}
                      style={{ touchAction: 'none' }}
                    >
                      <g transform={renderInfo.svgTransform}>
                        {displayItems.map((item) => (
                          <EditorItem
                            key={item.id}
                            item={item}
                            selected={item.id === selectedItemId}
                          />
                        ))}
                        {draftOverlayItem && <EditorItem item={draftOverlayItem} selected={false} />}
                        {keyboardPoint && (
                          <circle cx={keyboardPoint.x} cy={keyboardPoint.y} r="6" fill="#7c3aed" stroke="#ffffff" strokeWidth="2" />
                        )}
                        {textPosition && (
                          <circle cx={textPosition.x} cy={textPosition.y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                        )}
                      </g>
                    </svg>
                  )}
                </div>
              </div>

              <div className="pdf-editor-page-footer">
                <p className="pdf-editor-secondary text-xs">
                  {activeTool === 'text' && 'Click to place text, or focus the preview, use the arrow keys to position, and press Enter.'}
                  {activeTool === 'image' && (pendingImage ? 'Click to place the image, or focus the preview, use the arrow keys, and press Enter.' : 'Choose a PNG or JPEG image first.')}
                  {activeTool === 'draw' && 'Drag on the page to draw freehand.'}
                  {activeTool === 'highlight' && 'Drag over an area to add a translucent highlight.'}
                  {activeTool === 'rectangle' && 'Drag to draw a rectangle outline.'}
                  {activeTool === 'line' && 'Drag to draw a straight line.'}
                  {activeTool === 'select' && 'Select a mark to move, resize images, or delete it; use Page marks and arrow keys for keyboard editing.'}
                </p>
                {deletePageConfirmation ? (
                  <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Confirm page deletion">
                    <span className="pdf-editor-secondary text-sm">Delete page {currentPageId + 1}?</span>
                    <button type="button" onClick={deleteCurrentPage} className="pdf-editor-action-button is-danger">Confirm delete</button>
                    <button type="button" onClick={() => setDeletePageConfirmation(false)} className="pdf-editor-action-button">Cancel</button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeletePageConfirmation(true)}
                    disabled={visiblePageIds.length <= 1 || isSaving}
                    className="pdf-editor-action-button is-danger"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete current page
                  </button>
                )}
              </div>
            </section>
          </div>

          <div className="pdf-editor-save-row">
            <p className={`text-sm font-medium ${hasChanges && !output ? 'pdf-editor-unsaved' : 'pdf-editor-secondary'}`}>
              {output ? 'Saved edits — ready to download' : hasChanges ? 'Unsaved edits' : 'No unsaved edits'}
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={clearWorkspace} disabled={isSaving || isLoading} className="pdf-editor-action-button">
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> Discard and start over
              </button>
              <button type="button" onClick={savePdf} disabled={isSaving || isLoading || !hasChanges || Boolean(output) || !visiblePageIds.length} className="pdf-editor-primary-button">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
                {isSaving ? 'Validating edited PDF…' : 'Save PDF'}
              </button>
              {output && (
                <button type="button" onClick={downloadPdf} className="pdf-editor-download-button">
                  <Download className="h-4 w-4" aria-hidden="true" /> Download edited PDF
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {isLoading && !file && <p className="pdf-editor-secondary text-sm" role="status">Loading and validating the selected PDF…</p>}
    </div>
  );
};

export default EditPdf;
