const WHITE_THRESHOLD = 250;
const CROP_PADDING = 1;

export const findContentBounds = (imageData) => {
  const { width, height, data } = imageData || {};
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1
    || !ArrayBuffer.isView(data) || data.length !== width * height * 4) {
    throw new Error('The rendered page image data is invalid.');
  }

  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const visible = data[offset + 3] > 0
        && (data[offset] < WHITE_THRESHOLD
          || data[offset + 1] < WHITE_THRESHOLD
          || data[offset + 2] < WHITE_THRESHOLD);
      if (!visible) continue;

      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }

  if (right < 0) return null;

  const cropLeft = Math.max(0, left - CROP_PADDING);
  const cropTop = Math.max(0, top - CROP_PADDING);
  const cropRight = Math.min(width, right + CROP_PADDING + 1);
  const cropBottom = Math.min(height, bottom + CROP_PADDING + 1);
  return {
    left: cropLeft,
    top: cropTop,
    width: cropRight - cropLeft,
    height: cropBottom - cropTop
  };
};
