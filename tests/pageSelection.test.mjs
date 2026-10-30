import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPageRanges,
  parsePageRanges,
  parsePageRangesWhileTyping
} from '../src/lib/pageSelection.mjs';

test('parses and sorts individual pages and ranges without duplicates', () => {
  assert.deepEqual(parsePageRanges('5, 1-3, 3', 8), [1, 2, 3, 5]);
});

test('formats selected pages as compact ascending ranges', () => {
  assert.equal(formatPageRanges([8, 3, 2, 1, 5, 5]), '1-3, 5, 8');
});

test('keeps completed page selections live while a range is unfinished', () => {
  assert.deepEqual(parsePageRangesWhileTyping('1, 4-', 8), [1, 4]);
});

test('rejects invalid and out-of-bounds ranges', () => {
  assert.throws(() => parsePageRanges('2-1', 8), /Invalid range/);
  assert.throws(() => parsePageRanges('9', 8), /Invalid page/);
});
