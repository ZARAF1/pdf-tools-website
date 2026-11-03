import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createDownloadStateTracker,
  createToolExitStateTracker
} from '../src/lib/toolExitDownloadState.mjs';

test('a generated output stays pending until its matching download is started', () => {
  const tracker = createDownloadStateTracker();
  const output = { bytes: new Uint8Array([1, 2, 3]), name: 'edited.pdf' };

  tracker.update(output);
  assert.equal(tracker.getPendingCount(), 1);

  tracker.markDownloaded();
  assert.equal(tracker.getPendingCount(), 0);
});

test('multiple outputs remain pending independently after downloading one', () => {
  const tracker = createDownloadStateTracker();
  const first = { id: 'first', outputBytes: new Uint8Array([1]) };
  const second = { id: 'second', outputBytes: new Uint8Array([2]) };

  tracker.update([first, second]);
  tracker.markDownloaded('first');
  assert.equal(tracker.getPendingCount(), 1);

  tracker.markDownloaded('second');
  assert.equal(tracker.getPendingCount(), 0);
});

test('downloaded outputs stay acknowledged when another output becomes ready', () => {
  const tracker = createDownloadStateTracker();
  const first = { id: 'first', outputBytes: new Uint8Array([1]) };
  const second = { id: 'second', outputBytes: new Uint8Array([2]) };

  tracker.update([first]);
  tracker.markDownloaded('first');
  tracker.update([first, second]);

  assert.equal(tracker.getPendingCount(), 1);
});

test('regenerating the same output id makes the new file pending again', () => {
  const tracker = createDownloadStateTracker();
  tracker.update({ id: 'result', bytes: new Uint8Array([1]) });
  tracker.markDownloaded('result');
  tracker.update({ id: 'result', bytes: new Uint8Array([2]) });

  assert.equal(tracker.getPendingCount(), 1);
});

test('independent mounted workflows retain attachment and download state', () => {
  const tracker = createToolExitStateTracker();
  const imageOutput = { name: 'result.zip', bytes: new Uint8Array([1]) };
  const pdfOutput = { name: 'result.zip', bytes: new Uint8Array([2]) };

  tracker.update(1, true, imageOutput);
  tracker.update(2, false, pdfOutput);
  assert.equal(tracker.hasAttachedFiles(), true);
  assert.equal(tracker.getPendingCount(), 2);

  tracker.markDownloaded(1, 'result.zip');
  assert.equal(tracker.getPendingCount(), 1);

  tracker.update(2, false, null);
  assert.equal(tracker.getPendingCount(), 0);
  assert.equal(tracker.hasAttachedFiles(), true);

  tracker.update(1, false, null);
  assert.equal(tracker.hasAttachedFiles(), false);
});
