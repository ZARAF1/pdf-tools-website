import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const rendererSource = await readFile(
  fileURLToPath(new URL('../node_modules/pptx-browser/src/render.js', import.meta.url)),
  'utf8'
);

test('PPTX text renderer initializes paragraph defaults before reading them', () => {
  const paragraphRenderer = rendererSource.match(/for \(const para of paragraphs\) \{([\s\S]*?)\n    \}/)?.[1];
  assert.ok(paragraphRenderer, 'The PPTX text renderer should contain its paragraph loop');
  const declarationIndex = paragraphRenderer.indexOf("const defRPr = g1(pPr, 'defRPr')");
  const usageIndex = paragraphRenderer.indexOf('parseBullet(pPr, defRPr');
  assert.ok(declarationIndex >= 0 && usageIndex >= 0 && declarationIndex < usageIndex);
});
