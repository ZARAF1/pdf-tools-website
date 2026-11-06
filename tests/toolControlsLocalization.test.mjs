import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languageCatalog.mjs';

const localizationFileExists = await readFile(
  new URL('../src/i18n/toolUiLocalization.mjs', import.meta.url)
).then(() => true).catch((error) => {
  if (error.code === 'ENOENT') return false;
  throw error;
});
const imageToolSource = await readFile(
  new URL('../src/components/ImageToPdf.jsx', import.meta.url),
  'utf8'
);
const attachedControlsSource = await readFile(
  new URL('../src/components/AttachedFileControls.jsx', import.meta.url),
  'utf8'
);

const imageControlKeys = [
  'uploadLabel', 'uploadPrompt', 'dropPrompt', 'uploadDescription', 'chooseImages',
  'moveUp', 'moveDown', 'rotateClockwise', 'pageSize',
  'fitImageDimensions', 'customDimensions', 'orientation', 'portrait', 'landscape',
  'autoOrient', 'customWidth', 'customHeight', 'imageFit', 'contain', 'fill',
  'margin', 'horizontalAlignment', 'left', 'center', 'right', 'verticalAlignment',
  'top', 'middle', 'bottom', 'maximumWidth', 'maximumHeight', 'scale',
  'pageBackgroundColor', 'jpegQuality', 'maintainAspectRatio', 'encodingNote',
  'reset', 'addMoreImages', 'createPdfAction', 'createPdfsAction', 'creatingPdf',
  'downloadPdf'
];
const imageWorkflowControlKeys = [
  'imageCount', 'attachedImages', 'settingsTitle', 'settingsDescription', 'scopeToggleLabel',
  'allImages', 'selectedImages', 'selectImagesHint',
  'previewTitle', 'previewDescription', 'chooseImagesDescription', 'selectImage', 'viewLargerPreview',
  'closePreview', 'previewInvalid', 'outputMode', 'singlePdf', 'separatePdf'
];
const pdfToImagesControlKeys = [
  'previewSelectionDescription', 'selectedPageCount', 'selectedPagesCount',
  'selectPageForExport', 'removePageFromExport', 'selectPagesBeforeExport',
  'exportAllSingleImage', 'exportAllImageArchive',
  'exportSelectedSingleImage', 'exportSelectedImageArchive',
  'includeAllImages', 'includeSelectedImages'
];
const pdfToImagesToolSource = await readFile(
  new URL('../src/components/PdfToImages.jsx', import.meta.url),
  'utf8'
);
const powerpointControlKeys = [
  'directionPdfToPptx', 'directionPptxToPdf', 'choosePdf', 'choosePptx',
  'uploadPdfPrompt', 'uploadPptxPrompt', 'dropPdfPrompt', 'dropPptxPrompt',
  'pageSelection', 'pageSelectionHint', 'outputFilename', 'imageQuality',
  'standardQuality', 'highQuality', 'slideSize', 'wideSlides', 'matchPdfPages',
  'pdfPageSize', 'matchSlides', 'a4', 'letter', 'imageBasedWarning',
  'fontNetworkWarning', 'fontNameDisclosure', 'countPages', 'countSlides', 'convert',
  'convertToPowerPoint', 'convertToPdf', 'converting', 'renderingPage', 'renderingSlide'
];
const powerpointToolSource = await readFile(
  new URL('../src/components/PdfPowerPoint.jsx', import.meta.url),
  'utf8'
).catch((error) => {
  if (error.code === 'ENOENT') return '';
  throw error;
});

test('every bundled language has localized image attachment and control labels', async () => {
  assert.ok(localizationFileExists, 'The bundled tool UI localization module must exist');
  const { getLocalizedToolUi, TOOL_UI_TRANSLATIONS } = await import('../src/i18n/toolUiLocalization.mjs');
  for (const { code } of SUPPORTED_LANGUAGES) {
    const localized = getLocalizedToolUi(code);
    assert.ok(localized.fileActions.replace, `${code} is missing the replace label`);
    assert.ok(localized.fileActions.remove, `${code} is missing the remove label`);
    for (const key of imageControlKeys) {
      assert.ok(localized.imageToPdf[key], `${code} is missing imageToPdf.${key}`);
    }
    assert.ok(localized.imageToPdf.ready, `${code} is missing imageToPdf.ready`);
    if (code === 'en') {
      assert.equal(localized.imageToPdf.scopeToggleLabel,
        'Apply settings to all or selected images (select images in preview to enable settings)');
      assert.equal(localized.imageToPdf.chooseImagesDescription.split(/\s+/).length, 9);
      assert.equal(localized.imageToPdf.allImages, 'All images');
      assert.equal(localized.imageToPdf.selectedImages, 'Selected images');
      assert.equal(localized.imageToPdf.singlePdf, 'Create Single PDF');
      assert.equal(localized.imageToPdf.separatePdf, 'Create Seperate PDFs');
      assert.equal(localized.imageToPdf.createPdfAction, 'Create PDF');
      assert.equal(localized.imageToPdf.createPdfsAction, 'Create PDFs');
    }

    if (code !== 'en') {
      for (const key of ['uploadPrompt', 'pageSize', 'createPdfAction', 'createPdfsAction', 'reset', 'downloadPdf']) {
        assert.notEqual(
          localized.imageToPdf[key],
          TOOL_UI_TRANSLATIONS.en.imageToPdf[key],
          `${code} leaves imageToPdf.${key} in English`
        );
      }
      for (const key of ['scopeToggleLabel', 'allImages', 'selectedImages', 'selectImagesHint', 'chooseImagesDescription']) {
        assert.notEqual(
          localized.imageToPdf[key],
          TOOL_UI_TRANSLATIONS.en.imageToPdf[key],
          `${code} leaves imageToPdf.${key} in English`
        );
      }
      assert.notEqual(localized.fileActions.replace, TOOL_UI_TRANSLATIONS.en.fileActions.replace, `${code} leaves replace in English`);
      assert.notEqual(localized.fileActions.remove, TOOL_UI_TRANSLATIONS.en.fileActions.remove, `${code} leaves remove in English`);
    }
  }
});

test('every bundled language has localized PDF-to-Images selection and export labels', async () => {
  const { getLocalizedToolUi, TOOL_UI_TRANSLATIONS } = await import('../src/i18n/toolUiLocalization.mjs');
  assert.match(pdfToImagesToolSource, /getLocalizedToolUi\(language\)/);
  for (const { code } of SUPPORTED_LANGUAGES) {
    const localized = getLocalizedToolUi(code).pdfToImages;
    assert.ok(localized, `${code} is missing the PDF-to-Images controls`);
    for (const key of pdfToImagesControlKeys) {
      assert.ok(localized[key], `${code} is missing pdfToImages.${key}`);
    }

    if (code === 'en') {
      assert.equal(localized.previewSelectionDescription,
        'Select pages in the preview to export only those pages, or export all pages.');
      assert.equal(localized.exportAllImageArchive, 'Export all pages as {format} images (ZIP)');
      assert.equal(localized.exportSelectedImageArchive, 'Export selected pages as {format} images (ZIP)');
      assert.equal(localized.includeAllImages, 'Include All Images');
      assert.equal(localized.includeSelectedImages, 'Include Selected Images');
    } else {
      for (const key of [
        'previewSelectionDescription', 'exportAllImageArchive', 'exportSelectedImageArchive',
        'includeAllImages', 'includeSelectedImages'
      ]) {
        assert.notEqual(
          localized[key],
          TOOL_UI_TRANSLATIONS.en.pdfToImages[key],
          `${code} leaves pdfToImages.${key} in English`
        );
      }
    }
  }
});

test('every bundled language has localized PowerPoint conversion controls', async () => {
  const { getLocalizedToolUi, TOOL_UI_TRANSLATIONS } = await import('../src/i18n/toolUiLocalization.mjs');
  for (const { code } of SUPPORTED_LANGUAGES) {
    const localized = getLocalizedToolUi(code).powerpoint;
    assert.ok(localized, `${code} is missing the PowerPoint controls`);
    for (const key of powerpointControlKeys) {
      assert.ok(localized[key], `${code} is missing powerpoint.${key}`);
    }

    if (code !== 'en') {
      for (const key of ['choosePdf', 'pageSelection', 'imageQuality', 'convert', 'convertToPowerPoint', 'convertToPdf']) {
        assert.notEqual(
          localized[key],
          TOOL_UI_TRANSLATIONS.en.powerpoint[key],
          `${code} leaves powerpoint.${key} in English`
        );
      }
    }
  }
});

test('PowerPoint conversion controls render through the selected language', async () => {
  const { TOOL_UI_TRANSLATIONS } = await import('../src/i18n/toolUiLocalization.mjs');
  assert.match(powerpointToolSource, /getLocalizedToolUi\(language\)/);
  for (const key of powerpointControlKeys) {
    assert.match(powerpointToolSource, new RegExp(`powerpointUi\\.${key}\\b`), `PowerPoint conversion does not render ${key}`);
  }
  assert.equal(TOOL_UI_TRANSLATIONS.en.powerpoint.convertToPowerPoint, 'Convert to PowerPoint');
  assert.equal(TOOL_UI_TRANSLATIONS.en.powerpoint.convertToPdf, 'Convert to PDF');
});

test('image attachment prompts and settings render through the selected language', () => {
  assert.match(imageToolSource, /getLocalizedToolUi\(language\)/);
  assert.match(imageToolSource, /imageUi\.uploadPrompt/);
  assert.match(imageToolSource, /imageUi\.pageSize/);
  assert.match(imageToolSource, /imageUi\.createPdfAction/);
  assert.match(imageToolSource, /imageUi\.createPdfsAction/);
  for (const key of imageControlKeys) {
    assert.match(imageToolSource, new RegExp(`imageUi\\.${key}\\b`), `Image to PDF does not render ${key}`);
  }
  assert.match(attachedControlsSource, /getLocalizedToolUi\(language\)/);
  assert.match(attachedControlsSource, /fileActions\.replace/);
  assert.match(attachedControlsSource, /fileActions\.remove/);
});

test('image preview workflow controls have bundled translations in every language', async () => {
  const { getLocalizedToolUi } = await import('../src/i18n/toolUiLocalization.mjs');
  for (const { code } of SUPPORTED_LANGUAGES) {
    const localized = getLocalizedToolUi(code).imageToPdf;
    for (const key of imageWorkflowControlKeys) {
      assert.ok(localized[key], `${code} is missing imageToPdf.${key}`);
    }
  }
  for (const key of imageWorkflowControlKeys) {
    assert.match(imageToolSource, new RegExp(`imageUi\\.${key}\\b`), `Image to PDF does not render ${key}`);
  }
});
