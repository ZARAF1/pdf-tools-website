export const getWatermarkPositionOnPage = (pageRotation, positionX, positionY) => {
  const rotation = ((pageRotation % 360) + 360) % 360;
  switch (rotation) {
    case 90:
      return { x: 1 - positionY, y: positionX };
    case 180:
      return { x: 1 - positionX, y: 1 - positionY };
    case 270:
      return { x: positionY, y: 1 - positionX };
    case 0:
      return { x: positionX, y: positionY };
    default:
      throw new Error(`Unsupported PDF page rotation: ${pageRotation} degrees.`);
  }
};

export const getWatermarkTextOrigin = (
  pageWidth,
  pageHeight,
  textWidth,
  textHeight,
  angle,
  positionX = 0.5,
  positionY = 0.5
) => {
  const radians = (angle * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const corners = [
    [0, 0],
    [textWidth * cosine, textWidth * sine],
    [-textHeight * sine, textHeight * cosine],
    [textWidth * cosine - textHeight * sine, textWidth * sine + textHeight * cosine]
  ];
  const xs = corners.map(([x]) => x);
  const ys = corners.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const boundsWidth = maxX - minX;
  const boundsHeight = maxY - minY;

  if (boundsWidth > pageWidth || boundsHeight > pageHeight) {
    throw new Error('The watermark text is too large for this page. Reduce its size or shorten the text.');
  }

  return {
    x: positionX * pageWidth - boundsWidth / 2 - minX,
    y: positionY * pageHeight - boundsHeight / 2 - minY
  };
};
