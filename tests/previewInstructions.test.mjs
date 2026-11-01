import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const instructionTools = [
  'CropPdf',
  'EditPdf',
  'ImageToPdf',
  'OrganizePdf',
  'PageSelectionTool',
  'PdfMerger',
  'PdfRotator',
  'PdfSplitter',
  'RedactPdf'
];

const toolSources = await Promise.all(instructionTools.map(async (tool) => [
  tool,
  await readFile(new URL(`../src/components/${tool}.jsx`, import.meta.url), 'utf8')
]));
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('PDF preview-use instructions share the prominent blue-accent callout style', () => {
  const instructionStyles = styles.match(/(?:\.organize-pdf-instructions,\s*)?\.pdf-preview-instructions\s*\{([^}]*)\}/)?.[1];

  assert.ok(instructionStyles, 'preview instructions have a shared style rule');
  assert.match(instructionStyles, /font-size:\s*1rem\s*;/);
  assert.match(instructionStyles, /font-weight:\s*600\s*;/);
  assert.match(instructionStyles, /border-left:\s*4px solid\s+#3b82f6\s*;/);

  for (const [tool, source] of toolSources) {
    assert.match(source, /pdf-preview-instructions/, `${tool} marks its preview-use guidance for consistent styling`);
  }
});

test('Merge PDF empty-state guidance keeps its blue accent beside the empty-state border', () => {
  const emptyStateStyles = styles.match(/\.merge-live-output-empty\.pdf-preview-instructions\s*\{([^}]*)\}/)?.[1];

  assert.ok(emptyStateStyles, 'Merge empty-state guidance preserves the shared blue accent');
  assert.match(emptyStateStyles, /border-left:\s*4px solid\s+#3b82f6\s*;/);
});
