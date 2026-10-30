import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateImagePlacement,
  getCustomPageDimensions,
  getHexColorComponents,
  getRotatedImageDimensions,
  getOrientedPageDimensions
} from '../src/lib/imagePdfLayout.mjs';

test('converts custom page dimensions from millimeters to PDF points', () => {
  const [width, height] = getCustomPageDimensions(210, 297);
  assert.ok(Math.abs(width - (210 * 72 / 25.4)) < 1e-10);
  assert.ok(Math.abs(height - (297 * 72 / 25.4)) < 1e-10);
});

test('rejects invalid custom page dimensions', () => {
  assert.throws(() => getCustomPageDimensions(0, 297), /positive values/);
});

test('auto orientation matches each image aspect ratio', () => {
  assert.deepEqual(getOrientedPageDimensions(600, 800, {
    autoOrient: true,
    imageWidth: 1600,
    imageHeight: 900
  }), [800, 600]);
  assert.deepEqual(getOrientedPageDimensions(600, 800, {
    autoOrient: true,
    imageWidth: 900,
    imageHeight: 1600
  }), [600, 800]);
});

test('places images according to horizontal and vertical alignment', () => {
  assert.deepEqual(calculateImagePlacement({
    imageWidth: 100,
    imageHeight: 50,
    pageWidth: 300,
    pageHeight: 200,
    margin: 10,
    fitMode: 'contain',
    horizontalAlignment: 'right',
    verticalAlignment: 'top'
  }), {
    x: 10,
    y: 50,
    width: 280,
    height: 140
  });
});

test('anchors a Fill image to the selected edge while allowing crop', () => {
  assert.deepEqual(calculateImagePlacement({
    imageWidth: 50,
    imageHeight: 200,
    pageWidth: 200,
    pageHeight: 200,
    margin: 10,
    fitMode: 'fill',
    horizontalAlignment: 'center',
    verticalAlignment: 'top'
  }), {
    x: 10,
    y: -530,
    width: 180,
    height: 720
  });
});

test('swaps image dimensions for quarter-turn rotations', () => {
  assert.deepEqual(getRotatedImageDimensions(1200, 800, 90), [800, 1200]);
  assert.deepEqual(getRotatedImageDimensions(1200, 800, 180), [1200, 800]);
});

test('converts a six-digit hex color into normalized PDF color components', () => {
  assert.deepEqual(getHexColorComponents('#3366cc'), [51 / 255, 102 / 255, 204 / 255]);
});
