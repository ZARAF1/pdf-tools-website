import test from 'node:test';
import assert from 'node:assert/strict';
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
