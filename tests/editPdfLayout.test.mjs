import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const stylesheet = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Edit PDF attachment content has no extra top padding', () => {
  assert.match(
    stylesheet,
    /\.tool-attachment-content:has\(> \.pdf-editor-shell\)\s*\{\s*padding-top:\s*0;?\s*\}/
  );
});
