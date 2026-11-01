import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const readSource = (path) => readFile(
  fileURLToPath(new URL(path, import.meta.url)),
  'utf8'
);

const readSourceIfPresent = async (path) => {
  try {
    return await readSource(path);
  } catch (error) {
    if (error.code === 'ENOENT') return '';
    throw error;
  }
};

const [appSource, mainSource, toolPageSource, toolExitGuardSource, toolSearchSource, stylesSource] = await Promise.all([
  readSource('../src/App.jsx'),
  readSource('../src/main.jsx'),
  readSource('../src/components/ToolPage.jsx'),
  readSourceIfPresent('../src/components/ToolExitGuard.jsx'),
  readSource('../src/components/ToolSearch.jsx'),
  readSource('../src/index.css')
]);

const attachedFileTools = [
  ['PdfMerger.jsx', /useToolExitGuard\(files\.length > 0,/],
  ['PdfSplitter.jsx', /useToolExitGuard\(Boolean\(file\),/],
  ['PdfRotator.jsx', /useToolExitGuard\(Boolean\(file\),/],
  ['PdfProtector.jsx', /useToolExitGuard\(Boolean\(file\),/],
  ['ImageToPdf.jsx', /useToolExitGuard\([\s\S]*?images\.length > 0 \|\| pendingImageCount > 0,/],
  ['PdfToImages.jsx', /useToolExitGuard\(Boolean\(file\),/],
  ['UnlockPdf.jsx', /useToolExitGuard\(Boolean\(file\),/],
  ['PdfToWord.jsx', /useToolExitGuard\(Boolean\(file\),/],
  ['OcrPdf.jsx', /useToolExitGuard\(Boolean\(file\),/],
  ['PdfCompressor.jsx', /useToolExitGuard\(files\.length > 0,/],
  ['PdfWatermarker.jsx', /useToolExitGuard\(Boolean\(file\),/],
  ['PageSelectionTool.jsx', /useToolExitGuard\(Boolean\(file\),/],
  ['OrganizePdf.jsx', /useToolExitGuard\(Boolean\(file\),/],
  ['CropPdf.jsx', /useToolExitGuard\(Boolean\(file\),/],
  ['RedactPdf.jsx', /useToolExitGuard\(Boolean\(file\),/],
  ['SignPdf.jsx', /useToolExitGuard\(Boolean\(file \|\| signatureImage\),/],
  ['EditPdf.jsx', /useToolExitGuard\(Boolean\(file\),/]
];

test('tool pages omit the dedicated Back button while retaining accessible discard confirmation', () => {
  assert.doesNotMatch(toolPageSource, /requestToolBack|tool-back-button|translate\('back'\)/);
  assert.doesNotMatch(stylesSource, /\.tool-back-button/);
  assert.doesNotMatch(stylesSource, /\.tool-detail-hero-main\s*\{[^}]*align-self:\s*start;/);
  assert.doesNotMatch(toolExitGuardSource, /requestToolBack/);
  assert.match(toolExitGuardSource, /role="alertdialog"/);
  assert.match(toolExitGuardSource, /aria-modal="true"/);
  assert.match(toolExitGuardSource, /translate\('discardAttachedFiles'\)/);
  assert.match(toolExitGuardSource, /translate\('stayOnPage'\)/);
  assert.match(toolExitGuardSource, /translate\('leavePage'\)/);
});

test('leaving a tool with attached files can be canceled without clearing the selection', () => {
  assert.match(toolExitGuardSource, /pendingNavigation/);
  assert.match(toolExitGuardSource, /setPendingNavigation\(null\)/);
  assert.match(toolExitGuardSource, /cancelNavigation/);
  assert.match(toolExitGuardSource, /confirmNavigation/);
  assert.match(toolExitGuardSource, /addEventListener\('beforeunload'/);
});

test('download warnings distinguish one pending output from multiple outputs', () => {
  assert.match(toolExitGuardSource, /undownloadedOutputCount/);
  assert.match(toolExitGuardSource, /discardReadyFileMessage/);
  assert.match(toolExitGuardSource, /discardReadyFilesMessage/);
  assert.match(toolExitGuardSource, /pendingNavigation\.undownloadedOutputCount\s*===\s*1/);
});

test('every PDF tool reports ready outputs and acknowledges initiated downloads', async () => {
  const downloadableTools = [
    ['PdfMerger.jsx', /useToolExitGuard\(files\.length > 0,\s*outputBytes\)/, /markOutputDownloaded\(\)/],
    ['PdfCompressor.jsx', /useToolExitGuard\(files\.length > 0,\s*downloadableResults\)/, /markOutputDownloaded\(item\.id\)/],
    ['PdfSplitter.jsx', /useToolExitGuard\(Boolean\(file\),\s*outputFiles\)/, /markOutputDownloaded\(output\.name\)/],
    ['PdfRotator.jsx', /useToolExitGuard\(Boolean\(file\),\s*outputBytes\)/, /markOutputDownloaded\(\)/],
    ['PdfProtector.jsx', /useToolExitGuard\(Boolean\(file\),\s*outputBytes\)/, /markOutputDownloaded\(\)/],
    ['ImageToPdf.jsx', /useToolExitGuard\([\s\S]*?outputBytes\)/, /markOutputDownloaded\(\)/],
    ['PdfToImages.jsx', /useToolExitGuard\(Boolean\(file\),\s*zipUrl\)/, /<DownloadReadyCard[\s\S]*?href=\{zipUrl\}[\s\S]*?onDownload=\{markOutputDownloaded\}/],
    ['UnlockPdf.jsx', /useToolExitGuard\(Boolean\(file\),\s*outputBytes\)/, /markOutputDownloaded\(\)/],
    ['PdfToWord.jsx', /useToolExitGuard\(Boolean\(file\),\s*outputBlob\)/, /markOutputDownloaded\(\)/],
    ['OcrPdf.jsx', /useToolExitGuard\(Boolean\(file\),\s*outputBlob\)/, /markOutputDownloaded\(\)/],
    ['PdfWatermarker.jsx', /useToolExitGuard\(Boolean\(file\),\s*outputBytes\)/, /markOutputDownloaded\(\)/],
    ['PageSelectionTool.jsx', /useToolExitGuard\(Boolean\(file\),\s*outputBytes\)/, /markOutputDownloaded\(\)/],
    ['OrganizePdf.jsx', /useToolExitGuard\(Boolean\(file\),\s*output\)/, /markOutputDownloaded\(\)/],
    ['CropPdf.jsx', /useToolExitGuard\(Boolean\(file\),\s*output\)/, /markOutputDownloaded\(\)/],
    ['RedactPdf.jsx', /useToolExitGuard\(Boolean\(file\),\s*output\)/, /markOutputDownloaded\(\)/],
    ['SignPdf.jsx', /useToolExitGuard\([\s\S]*?output\)/, /markOutputDownloaded\(\)/],
    ['EditPdf.jsx', /useToolExitGuard\(Boolean\(file\),\s*output\)/, /markOutputDownloaded\(\)/]
  ];

  for (const [fileName, outputPattern, downloadPattern] of downloadableTools) {
    const source = await readSource(`../src/components/${fileName}`);
    assert.match(source, outputPattern, `${fileName} must report generated download output`);
    assert.match(source, /const markOutputDownloaded = useToolExitGuard/, `${fileName} must receive download tracking`);
    assert.match(source, downloadPattern, `${fileName} must acknowledge its download action`);
  }
});

test('all file-based PDF tools report when a document is attached', async () => {
  for (const [fileName, statePattern] of attachedFileTools) {
    const source = await readSource(`../src/components/${fileName}`);
    assert.match(source, /useToolExitGuard/, `${fileName} must report attached files`);
    assert.match(source, statePattern, `${fileName} must report its actual file state`);
  }
});

test('the navigation guard wraps the router and intercepts in-app and browser history navigation', () => {
  assert.match(appSource, /<ToolExitGuardProvider>/);
  assert.match(appSource, /<\/ToolExitGuardProvider>/);
  assert.match(toolExitGuardSource, /addEventListener\('popstate'/);
  assert.match(toolExitGuardSource, /addEventListener\('click'/);
  assert.match(toolExitGuardSource, /window\.history\.go\(delta\)/);
  assert.match(toolSearchSource, /requestToolNavigation/);
});

test('same-route anchors do not ask users to discard attached files', () => {
  assert.match(toolExitGuardSource, /if \(target\.pathname === current\.pathname\) return;/);
});

test('the history guard is installed before the router registers its popstate handler', () => {
  const installIndex = mainSource.indexOf('installToolExitHistoryListener()');
  const renderIndex = mainSource.indexOf('ReactDOM.createRoot');
  assert.notEqual(installIndex, -1);
  assert.ok(installIndex < renderIndex);
});
