import test from 'node:test';
import assert from 'node:assert/strict';
import * as imagePdfSettings from '../src/lib/imagePdfSettings.mjs';
import { updateImagePdfSettingsForScope } from '../src/lib/imagePdfSettings.mjs';

test('Selected Images updates only selected image settings', () => {
  const images = [
    { id: 'one', settings: { margin: 12, fitMode: 'contain' } },
    { id: 'two', settings: { margin: 24, fitMode: 'fill' } }
  ];

  const updated = updateImagePdfSettingsForScope(images, {
    scope: 'select',
    selectedImageIds: ['one'],
    settingKey: 'margin',
    value: 40
  });

  assert.deepEqual(updated, [
    { id: 'one', settings: { margin: 40, fitMode: 'contain' } },
    { id: 'two', settings: { margin: 24, fitMode: 'fill' } }
  ]);
});

test('resetting image settings preserves each attached image and removes its overrides', () => {
  const images = [
    { id: 'one', name: 'one.png', rotation: 90, settings: { margin: 12 } },
    { id: 'two', name: 'two.jpg', rotation: 0, settings: { fitMode: 'fill' } }
  ];

  assert.equal(typeof imagePdfSettings.resetImagePdfSettings, 'function');
  assert.deepEqual(imagePdfSettings.resetImagePdfSettings(images), [
    { id: 'one', name: 'one.png', rotation: 90 },
    { id: 'two', name: 'two.jpg', rotation: 0 }
  ]);
});
