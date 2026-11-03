import test from 'node:test';
import assert from 'node:assert/strict';
import { findContentBounds } from '../src/lib/pdfImageCrop.mjs';

const createImageData = (width, height, fill = 255) => {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let offset = 0; offset < data.length; offset += 4) {
    data[offset] = fill;
    data[offset + 1] = fill;
    data[offset + 2] = fill;
    data[offset + 3] = 255;
  }
  return { width, height, data };
};

test('finds visible page content and keeps a small crop margin', () => {
  const image = createImageData(12, 10);
  for (let y = 2; y <= 6; y += 1) {
    for (let x = 3; x <= 7; x += 1) {
      const offset = (y * image.width + x) * 4;
      image.data[offset] = 0;
      image.data[offset + 1] = 0;
      image.data[offset + 2] = 0;
    }
  }

  assert.deepEqual(findContentBounds(image), { left: 2, top: 1, width: 7, height: 7 });
});

test('preserves a completely blank page instead of producing an empty image', () => {
  assert.equal(findContentBounds(createImageData(8, 6)), null);
});

test('rejects malformed pixel data rather than guessing crop bounds', () => {
  assert.throws(
    () => findContentBounds({ width: 2, height: 2, data: new Uint8ClampedArray(4) }),
    /page image data is invalid/i
  );
});
