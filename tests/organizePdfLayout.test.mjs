import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const organizePdf = await readFile(new URL('../src/components/OrganizePdf.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Organize PDF shows the selected attachment above its page previews', () => {
  assert.match(organizePdf, /className="pdf-tool-workflow organize-pdf-workflow space-y-6"/);

  const attachmentOrder = styles.match(/\.organize-pdf-workflow\s+\.pdf-workflow-selected\s*\{([^}]*)\}/)?.[1];
  const previewsOrder = styles.match(/\.organize-pdf-workflow\s+\.pdf-workflow-controls\s*\{([^}]*)\}/)?.[1];

  assert.ok(attachmentOrder, 'Organize selected-file order is scoped to its workflow');
  assert.ok(previewsOrder, 'Organize page-preview order is scoped to its workflow');
  assert.match(attachmentOrder, /order:\s*1\s*;/);
  assert.match(previewsOrder, /order:\s*2\s*;/);
});

test('Organize PDF presents concise, prominent page-reordering instructions', () => {
  assert.match(organizePdf, /className="pdf-preview-instructions">Drag page cards to reorder, or use the controls on each page\.<\/p>/);
  assert.doesNotMatch(organizePdf, /At least one page must remain\. Screen readers can hear extracted page text where available\./);

  const instructionStyles = styles.match(/\.pdf-preview-instructions\s*\{([^}]*)\}/)?.[1];
  assert.ok(instructionStyles, 'Organize instructions use shared preview guidance styling');
  assert.match(instructionStyles, /font-size:\s*1rem\s*;/);
  assert.match(instructionStyles, /font-weight:\s*600\s*;/);
  assert.match(instructionStyles, /border-left:\s*4px solid/);
});
