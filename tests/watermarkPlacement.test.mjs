import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getWatermarkPositionOnPage,
  getWatermarkTextOrigin
} from '../src/lib/watermarkPlacement.mjs';

test('watermark preview position maps into rotated PDF page coordinates', () => {
  assert.deepEqual(getWatermarkPositionOnPage(0, 0.2, 0.3), { x: 0.2, y: 0.3 });
  assert.deepEqual(getWatermarkPositionOnPage(90, 0.2, 0.3), { x: 0.7, y: 0.2 });
  assert.deepEqual(getWatermarkPositionOnPage(180, 0.2, 0.3), { x: 0.8, y: 0.7 });
  assert.deepEqual(getWatermarkPositionOnPage(270, 0.2, 0.3), { x: 0.3, y: 0.8 });
});

test('watermark text origin follows a normalized page position', () => {
  const centered = getWatermarkTextOrigin(600, 800, 200, 48, -45, 0.5, 0.5);
  const shifted = getWatermarkTextOrigin(600, 800, 200, 48, -45, 0.25, 0.75);

  const centerX = centered.x + 100 * Math.cos((-45 * Math.PI) / 180) - 24 * Math.sin((-45 * Math.PI) / 180);
  const centerY = centered.y + 100 * Math.sin((-45 * Math.PI) / 180) + 24 * Math.cos((-45 * Math.PI) / 180);
  const shiftedCenterX = shifted.x + 100 * Math.cos((-45 * Math.PI) / 180) - 24 * Math.sin((-45 * Math.PI) / 180);
  const shiftedCenterY = shifted.y + 100 * Math.sin((-45 * Math.PI) / 180) + 24 * Math.cos((-45 * Math.PI) / 180);

  assert.ok(Math.abs(centerX - 300) < 0.001);
  assert.ok(Math.abs(centerY - 400) < 0.001);
  assert.ok(Math.abs(shiftedCenterX - 150) < 0.001);
  assert.ok(Math.abs(shiftedCenterY - 600) < 0.001);
});

test('watermark text origin rejects text larger than the rotated page bounds', () => {
  assert.throws(
    () => getWatermarkTextOrigin(100, 100, 200, 48, -45, 0.5, 0.5),
    /too large for this page/
  );
});
