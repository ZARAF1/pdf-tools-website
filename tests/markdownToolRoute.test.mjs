import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const registry = await readFile(new URL('../src/components/toolRegistry.js', import.meta.url), 'utf8');
const page = await readFile(new URL('../src/components/ToolPage.jsx', import.meta.url), 'utf8');
const component = await readFile(new URL('../src/components/PdfMarkdown.jsx', import.meta.url), 'utf8');

test('PDF ↔ Markdown has a registered route and direction-specific controls', () => {
  assert.match(app, /<Route path="\/pdf-to-markdown"/);
  assert.match(registry, /id: 'markdown'[\s\S]*?path: '\/pdf-to-markdown'/);
  assert.match(page, /markdown: \{[\s\S]*?title: 'PDF ↔ Markdown'/);
  assert.match(component, /Markdown to PDF/);
  assert.match(component, /PDF to Markdown/);
  assert.match(component, /image-pdf-direction-switch conversion-direction-switch/);
  assert.equal((component.match(/className="markdown-file-picker pdf-workflow-upload merge-pdf-upload-zone"/g) || []).length, 2);
  assert.match(component, /id="markdown-pdf-input"/);
  assert.match(component, /id="markdown-upload-pdf"/);
  assert.doesNotMatch(component, /id="markdown-upload"/);
  assert.match(component, /textarea/);
  assert.match(component, /pageSelection/);
});
