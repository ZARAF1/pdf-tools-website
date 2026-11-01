import test from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import {
  buildMarkdownFromPages,
  createPdfFromMarkdown,
  parseMarkdownPageSelection
} from '../src/lib/markdownConversion.mjs';

test('PDF page selections accept ordered one-based ranges', () => {
  assert.deepEqual(parseMarkdownPageSelection('1, 3-4', 4), [0, 2, 3]);
  assert.throws(() => parseMarkdownPageSelection('2-1', 4), /between 1 and 4/);
});

test('extracted PDF page text can retain or omit Markdown page separators', () => {
  assert.equal(
    buildMarkdownFromPages(['First page', 'Second page'], { includePageBreaks: true }),
    'First page\n\n---\n\nSecond page'
  );
  assert.equal(
    buildMarkdownFromPages(['First page', 'Second page'], { includePageBreaks: false }),
    'First page\n\nSecond page'
  );
});

test('Markdown headings and paragraphs produce a valid, sized PDF', async () => {
  const bytes = await createPdfFromMarkdown('# Report\n\nHello from Markdown.', {
    pageSize: 'letter',
    fontSize: 'large'
  });
  const pdf = await PDFDocument.load(bytes);
  assert.equal(pdf.getPageCount(), 1);
  assert.deepEqual(
    [pdf.getPage(0).getWidth(), pdf.getPage(0).getHeight()],
    [612, 792]
  );
});

test('empty Markdown and unsupported PDF options are rejected', async () => {
  await assert.rejects(() => createPdfFromMarkdown('  '), /content/i);
  await assert.rejects(
    () => createPdfFromMarkdown('Text', { pageSize: 'tabloid' }),
    /page size/i
  );
});
