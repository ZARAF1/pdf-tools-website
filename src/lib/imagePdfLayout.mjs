const MILLIMETERS_TO_POINTS = 72 / 25.4;

export const getRotatedImageDimensions = (width, height, rotation) => (
  Math.abs(rotation % 180) === 90 ? [height, width] : [width, height]
);

export const getHexColorComponents = (color) => {
  if (!/^#[\da-f]{6}$/i.test(color)) {
    throw new TypeError('Background color must be a six-digit hexadecimal color.');
  }

  return [1, 3, 5].map((offset) => parseInt(color.slice(offset, offset + 2), 16) / 255);
};

export const getCustomPageDimensions = (widthMm, heightMm) => {
  if (!Number.isFinite(widthMm) || !Number.isFinite(heightMm) || widthMm <= 0 || heightMm <= 0) {
    throw new RangeError('Custom page width and height must be positive values in millimeters.');
  }

  return [widthMm * MILLIMETERS_TO_POINTS, heightMm * MILLIMETERS_TO_POINTS];
};

export const getOrientedPageDimensions = (width, height, {
  autoOrient = false,
  orientation = 'portrait',
  imageWidth,
  imageHeight
}) => {
  const shouldBeLandscape = autoOrient
    ? imageWidth > imageHeight
    : orientation === 'landscape';
  const isLandscape = width > height;

  return shouldBeLandscape === isLandscape ? [width, height] : [height, width];
};

export const calculateImagePlacement = ({
  imageWidth,
  imageHeight,
  pageWidth,
  pageHeight,
  margin,
  fitMode,
  horizontalAlignment = 'center',
  verticalAlignment = 'middle'
}) => {
  const availableWidth = Math.max(1, pageWidth - margin * 2);
  const availableHeight = Math.max(1, pageHeight - margin * 2);
  const scaleX = availableWidth / imageWidth;
  const scaleY = availableHeight / imageHeight;
  const scale = fitMode === 'fill' ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  const horizontalFactor = { left: 0, center: 0.5, right: 1 }[horizontalAlignment] ?? 0.5;
  const verticalFactor = { bottom: 0, middle: 0.5, top: 1 }[verticalAlignment] ?? 0.5;

  return {
    x: margin + (availableWidth - width) * horizontalFactor,
    y: margin + (availableHeight - height) * verticalFactor,
    width,
    height
  };
};

export const calculateImagePageLayout = ({
  imageWidth,
  imageHeight,
  rotation = 0,
  settings,
  pageSizes
}) => {
  const [rotatedSourceWidth, rotatedSourceHeight] = getRotatedImageDimensions(
    imageWidth,
    imageHeight,
    rotation
  );
  let outputWidth;
  let outputHeight;
  if (settings.maintainAspect) {
    const scale = Math.min(
      1,
      settings.scalePercent / 100,
      settings.maxWidth / rotatedSourceWidth,
      settings.maxHeight / rotatedSourceHeight
    );
    outputWidth = Math.max(1, Math.round(rotatedSourceWidth * scale));
    outputHeight = Math.max(1, Math.round(rotatedSourceHeight * scale));
  } else {
    outputWidth = Math.max(1, Math.round(Math.min(rotatedSourceWidth, settings.maxWidth) * settings.scalePercent / 100));
    outputHeight = Math.max(1, Math.round(Math.min(rotatedSourceHeight, settings.maxHeight) * settings.scalePercent / 100));
  }

  let [pageWidth, pageHeight] = settings.pageSize === 'A4'
    ? pageSizes.A4
    : settings.pageSize === 'Letter'
      ? pageSizes.Letter
      : settings.pageSize === 'custom'
        ? getCustomPageDimensions(settings.customWidthMm, settings.customHeightMm)
        : [outputWidth * 0.75 + settings.margin * 2, outputHeight * 0.75 + settings.margin * 2];
  if (settings.pageSize !== 'fit') {
    [pageWidth, pageHeight] = getOrientedPageDimensions(pageWidth, pageHeight, {
      autoOrient: settings.autoOrient,
      orientation: settings.orientation,
      imageWidth: outputWidth,
      imageHeight: outputHeight
    });
  }

  const placement = calculateImagePlacement({
    imageWidth: outputWidth,
    imageHeight: outputHeight,
    pageWidth,
    pageHeight,
    margin: settings.margin,
    fitMode: settings.pageSize === 'fit' ? 'contain' : settings.fitMode,
    horizontalAlignment: settings.horizontalAlignment,
    verticalAlignment: settings.verticalAlignment
  });

  return { outputWidth, outputHeight, pageWidth, pageHeight, placement };
};
