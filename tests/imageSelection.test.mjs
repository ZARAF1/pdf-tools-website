import test from 'node:test';
import assert from 'node:assert/strict';
import { limitImageFiles } from '../src/lib/imageSelection.mjs';

test('limits a selection to the remaining image slots', () => {
  const files = ['eleven.png', 'twelve.png', 'thirteen.png'];

  assert.deepEqual(limitImageFiles(8, 0, files, 10), {
    files: ['eleven.png', 'twelve.png'],
    overflowCount: 1
  });
});

test('counts in-progress image additions against the limit', () => {
  assert.deepEqual(limitImageFiles(7, 2, ['ten.png', 'eleven.png'], 10), {
    files: ['ten.png'],
    overflowCount: 1
  });
});

test('accepts no additional images once the limit is reached', () => {
  assert.deepEqual(limitImageFiles(10, 0, ['eleven.png'], 10), {
    files: [],
    overflowCount: 1
  });
});
