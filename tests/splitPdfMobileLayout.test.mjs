import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const splitter = await readFile(new URL('../src/components/PdfSplitter.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('selected Split PDF file and its actions remain within a narrow card', () => {
  assert.match(splitter, /className="[^"]*split-pdf-selected-file[^"]*"/);
  assert.match(splitter, /className="[^"]*split-pdf-file-details[^"]*min-w-0[^"]*"/);
  assert.match(splitter, /className="[^"]*split-pdf-file-actions[^"]*"/);
  assert.match(styles, /\.split-pdf-selected-file\s*\{[^}]*min-width:\s*0/);
  assert.match(styles, /\.split-pdf-file-details\s*\{[^}]*flex:\s*1 1 auto/);
});

test('selected-file replace and delete actions wrap on extra-narrow mobile screens', () => {
  const actionStyles = styles.match(/\.pdf-attached-file-actions\s*\{([^}]*)\}/);
  assert.ok(actionStyles);
  assert.match(actionStyles[1], /flex-wrap:\s*wrap/);

  const narrowMobileStyles = styles.match(/@media \(max-width:\s*380px\)\s*\{([\s\S]*?)\n\}/);
  assert.ok(narrowMobileStyles, 'Extra-narrow mobile layout rules must exist');
  assert.match(narrowMobileStyles[1], /\.pdf-attached-file-actions\s*\{[^}]*max-width:\s*2\.25rem/);
});

test('Split PDF attachment glow is not clipped by the attachment shell', () => {
  const attachmentRule = styles.match(/\.tool-attachment-section\s*\{([^}]*)\}/);
  assert.ok(attachmentRule);
  assert.match(attachmentRule[1], /overflow:\s*visible/);
  assert.doesNotMatch(attachmentRule[1], /overflow:\s*hidden/);
});

test('attachment section keeps its glow without a horizontal top accent', () => {
  assert.doesNotMatch(styles, /\.tool-attachment-section::before\s*\{/);
  assert.match(styles, /animation:\s*tool-attachment-border-pulse 2\.8s ease-in-out infinite/);
  assert.match(styles, /@keyframes tool-attachment-border-pulse/);
});

test('Split PDF mode buttons wrap on the narrow workspace', () => {
  assert.match(splitter, /className="flex flex-wrap gap-4 border-b border-slate-100 pb-4"/);
});

test('Split PDF results wrap filenames and downloads inside a high-contrast card', () => {
  assert.match(splitter, /className="[^"]*split-pdf-result[^"]*"/);
  assert.match(splitter, /className="[^"]*split-pdf-result-content[^"]*min-w-0[^"]*"/);
  assert.match(splitter, /className="[^"]*split-pdf-output-name[^"]*"/);
  assert.match(splitter, /className="[^"]*split-pdf-output-download[^"]*w-full[^"]*"/);
  assert.match(styles, /\.split-pdf-result-content\s*\{[^}]*min-width:\s*0/);
  assert.match(styles, /\.split-pdf-output\s*\{[^}]*background:\s*var\(--surface-background\)/);
  assert.match(styles, /\.split-pdf-output-name\s*\{[^}]*color:\s*var\(--text-primary\)/);
});
