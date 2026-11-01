import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { getLocalizedTool } from '../src/i18n/toolTranslations.mjs';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languageCatalog.mjs';

const registrySource = await readFile(
  fileURLToPath(new URL('../src/components/toolRegistry.js', import.meta.url)),
  'utf8'
);
const pdfToWordSource = await readFile(
  fileURLToPath(new URL('../src/components/PdfToWord.jsx', import.meta.url)),
  'utf8'
);
const toolPageSource = await readFile(
  fileURLToPath(new URL('../src/components/ToolPage.jsx', import.meta.url)),
  'utf8'
);

test('conversion and Split/Extract tool labels use the requested bidirectional wording', () => {
  assert.match(registrySource, /id: 'word',\s+name: 'PDF ↔ Word'/);
  assert.match(registrySource, /id: 'split',\s+name: 'Split \/ Extract PDF'/);

  for (const { code } of SUPPORTED_LANGUAGES) {
    assert.match(getLocalizedTool(code, { id: 'word', name: 'PDF ↔ Word' }).name, /↔/);
    assert.match(getLocalizedTool(code, { id: 'split', name: 'Split / Extract PDF' }).name, /\//);
  }
});

test('PDF ↔ Word page explains both conversion directions and their limitations', () => {
  assert.match(toolPageSource, /title: 'PDF ↔ Word'/);
  assert.match(toolPageSource, /Word-to-PDF output is image-based/);
  assert.match(toolPageSource, /not searchable or selectable/);
});

test('PDF ↔ Word workspace offers PDF-to-DOCX and DOCX-to-PDF workflows', () => {
  assert.match(pdfToWordSource, /word-to-pdf/);
  assert.match(pdfToWordSource, /application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/);
  assert.match(pdfToWordSource, /createPdfFromRenderedPages/);
  assert.match(pdfToWordSource, /PDF <ArrowLeftRight[\s\S]*?\/> Word/);
  assert.match(pdfToWordSource, /Word <ArrowLeftRight[\s\S]*?\/> PDF/);
  assert.match(pdfToWordSource, /disabled=\{isProcessing\}[\s\S]*?aria-pressed=\{direction === 'pdf-to-word'\}/);
  assert.match(pdfToWordSource, /disabled=\{isProcessing\}[\s\S]*?aria-pressed=\{direction === 'word-to-pdf'\}/);
  assert.match(pdfToWordSource, /direction === 'pdf-to-word' \? 'Choose PDF' : 'Choose Word file'/);
});

test('Split / Extract descriptions explain selection, page splitting, and sections', () => {
  assert.match(registrySource, /Extract selected pages into one PDF, split every page, or divide pages into balanced sections\./);
  assert.match(toolPageSource, /title: 'Split \/ Extract PDF'/);
});
