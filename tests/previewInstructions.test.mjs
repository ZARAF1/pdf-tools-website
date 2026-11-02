import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const instructionTools = [
  'CropPdf',
  'EditPdf',
  'ImageToPdf',
  'OrganizePdf',
  'PageSelectionTool',
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

test('Merge PDF empty-state prompt remains neutral inside its output box', async () => {
  const emptyStateStyles = styles.match(/\.merge-live-output-empty\s*\{([^}]*)\}/)?.[1];
  const merger = await readFile(new URL('../src/components/PdfMerger.jsx', import.meta.url), 'utf8');

  assert.ok(emptyStateStyles, 'Merge empty-state prompt retains its own layout style');
  assert.doesNotMatch(emptyStateStyles, /background\s*:/, 'the prompt has no blue or surface tint');
  assert.doesNotMatch(emptyStateStyles, /border-left\s*:/, 'the prompt has no blue accent');
  assert.doesNotMatch(styles, /\.merge-live-output-empty\.pdf-preview-instructions/);
  assert.match(merger, /<p className="merge-live-output-empty">Select a page above to start building the output\.<\/p>/);
});
