import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const app = await readFile(
  fileURLToPath(new URL('../src/App.jsx', import.meta.url)),
  'utf8'
);

const toolComponents = [
  'PdfMerger',
  'PdfSplitter',
  'PdfRotator',
  'PdfProtector',
  'ImageToPdf',
  'PdfToImages',
  'UnlockPdf',
  'PdfToWord',
  'PdfPowerPoint',
  'OcrPdf',
  'PdfCompressor',
  'PdfWatermarker',
  'RemovePdfPages',
  'OrganizePdf',
  'CropPdf',
  'RedactPdf',
  'SignPdf',
  'EditPdf'
];

test('PDF tool components load on demand behind a route suspense boundary', () => {
  for (const component of toolComponents) {
    assert.match(
      app,
      new RegExp(`const ${component} = lazy\\(\\(\\) => import\\('./components/${component}'\\)\\)`),
      `${component} should be dynamically imported`
    );
    assert.doesNotMatch(
      app,
      new RegExp(`import ${component} from './components/${component}'`),
      `${component} should not be statically imported`
    );
  }
  assert.match(app, /<Suspense fallback=/);
});

test('lazy route failures render a localized recovery action instead of breaking the app shell', () => {
  assert.match(app, /class RouteErrorBoundary extends React\.Component/);
  assert.match(app, /componentDidCatch\(error/);
  assert.match(app, /const RouteErrorBoundaryWithLocation = \(\{ children, fallback \}\) =>/);
  assert.match(app, /<RouteErrorBoundary key=\{pathname\} fallback=\{fallback\}>/);
  assert.match(app, /<RouteErrorBoundaryWithLocation fallback=\{<RouteErrorFallback \/>}>/);
  assert.match(app, /translate\('routeLoadFailed'\)/);
  assert.match(app, /translate\('reloadPage'\)/);
  assert.match(app, /window\.location\.reload\(\)/);
});

test('route focus waits for lazy page headings before moving focus', () => {
  const focusManager = app.match(/const RouteFocusManager = \(\) => \{([\s\S]*?)\n\};/);
  assert.ok(focusManager, 'The route focus manager must exist');
  assert.match(focusManager[1], /new MutationObserver/);
  assert.match(focusManager[1], /observer\.observe\(mainContent,\s*\{\s*childList:\s*true,\s*subtree:\s*true\s*\}\)/);
  assert.match(focusManager[1], /return \(\) => observer\.disconnect\(\)/);
});
