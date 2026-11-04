export const fullPageCrop = Object.freeze({ x: 0, y: 0, width: 1, height: 1 });

export const hasOrganizeChanges = (pages, sourcePageCount) => (
  pages.length !== sourcePageCount
  || pages.some((page, index) => (
    page.sourceIndex !== index
    || page.rotation !== 0
    || (page.crop && (
      page.crop.x !== fullPageCrop.x
      || page.crop.y !== fullPageCrop.y
      || page.crop.width !== fullPageCrop.width
      || page.crop.height !== fullPageCrop.height
    ))
  ))
);

export const clampOrganizeCrop = (crop, minimumSize = 0.02) => {
  const width = Math.min(1, Math.max(minimumSize, crop.width));
  const height = Math.min(1, Math.max(minimumSize, crop.height));
  const round = (value) => Math.round(value * 1e6) / 1e6;
  return {
    x: round(Math.min(1 - width, Math.max(0, crop.x))),
    y: round(Math.min(1 - height, Math.max(0, crop.y))),
    width: round(width),
    height: round(height)
  };
};

export const adjustOrganizeCrop = (initialCrop, handle, dx, dy, minimumSize = 0.02) => {
  const crop = { ...initialCrop };
  if (handle.includes('w')) {
    const right = initialCrop.x + initialCrop.width;
    crop.x = Math.min(right - minimumSize, Math.max(0, initialCrop.x + dx));
    crop.width = right - crop.x;
  } else if (handle.includes('e')) {
    crop.width = Math.min(1 - initialCrop.x, Math.max(minimumSize, initialCrop.width + dx));
  }
  if (handle.includes('n')) {
    const bottom = initialCrop.y + initialCrop.height;
    crop.y = Math.min(bottom - minimumSize, Math.max(0, initialCrop.y + dy));
    crop.height = bottom - crop.y;
  } else if (handle.includes('s')) {
    crop.height = Math.min(1 - initialCrop.y, Math.max(minimumSize, initialCrop.height + dy));
  }
  return clampOrganizeCrop(crop, minimumSize);
};

export const rotateOrganizeCropClockwise = (crop) => clampOrganizeCrop({
  x: 1 - crop.y - crop.height,
  y: crop.x,
  width: crop.height,
  height: crop.width
});

export const selectionToPdfRectangle = (viewport, pdfPage, selection) => {
  if (
    !viewport?.width || !viewport?.height
    || ![selection?.x, selection?.y, selection?.width, selection?.height].every(Number.isFinite)
    || selection.x < 0 || selection.y < 0
    || selection.width <= 0 || selection.height <= 0
    || selection.x + selection.width > 1 || selection.y + selection.height > 1
  ) {
    throw new Error('The page crop selection is invalid.');
  }

  const mediaBox = pdfPage.getMediaBox();
  const cropBox = pdfPage.getCropBox();
  const bounds = {
    left: Math.max(mediaBox.x, cropBox.x),
    bottom: Math.max(mediaBox.y, cropBox.y),
    right: Math.min(mediaBox.x + mediaBox.width, cropBox.x + cropBox.width),
    top: Math.min(mediaBox.y + mediaBox.height, cropBox.y + cropBox.height)
  };
  const points = [
    viewport.convertToPdfPoint(selection.x * viewport.width, selection.y * viewport.height),
    viewport.convertToPdfPoint(
      (selection.x + selection.width) * viewport.width,
      (selection.y + selection.height) * viewport.height
    )
  ];
  const left = Math.max(bounds.left, Math.min(...points.map(([x]) => x)));
  const right = Math.min(bounds.right, Math.max(...points.map(([x]) => x)));
  const bottom = Math.max(bounds.bottom, Math.min(...points.map(([, y]) => y)));
  const top = Math.min(bounds.top, Math.max(...points.map(([, y]) => y)));
  if (right <= left || top <= bottom) {
    throw new Error('The page crop selection does not overlap the PDF page.');
  }
  const round = (value) => Math.round(value * 1e6) / 1e6;
  return {
    x: round(left),
    y: round(bottom),
    width: round(right - left),
    height: round(top - bottom)
  };
};
