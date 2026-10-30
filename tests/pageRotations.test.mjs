import test from 'node:test';
import assert from 'node:assert/strict';
import { applyRotationToPages, rotatePageClockwise } from '../src/lib/pageRotations.mjs';

test('applies a rotation preset only to the specified one-based pages', () => {
  const rotations = [0, 0, 0, 0];

  assert.deepEqual(applyRotationToPages(rotations, [1, 3], 90), [90, 0, 90, 0]);
  assert.deepEqual(rotations, [0, 0, 0, 0]);
});

test('rotates one page clockwise without changing other pages', () => {
  assert.deepEqual(rotatePageClockwise([0, 180, 0], 2), [0, 270, 0]);
});

test('cycles a page through a full clockwise rotation', () => {
  let rotations = [0];
  for (let turn = 0; turn < 4; turn += 1) {
    rotations = rotatePageClockwise(rotations, 1);
  }
  assert.deepEqual(rotations, [0]);
});
