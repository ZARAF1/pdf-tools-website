export const getEffectiveImagePdfSettings = (image, defaults) => ({
  ...defaults,
  ...image.settings
});

export const updateImagePdfSettingsForScope = (images, {
  scope,
  selectedImageIds = [],
  settingKey,
  value
}) => {
  if (scope !== 'all' && scope !== 'select') {
    throw new TypeError('Image settings scope must be "all" or "select".');
  }
  if (scope === 'select' && selectedImageIds.length === 0) return images;

  const selectedIds = scope === 'select' ? new Set(selectedImageIds) : null;
  return images.map((image) => (
    selectedIds && !selectedIds.has(image.id)
      ? image
      : {
        ...image,
        settings: { ...image.settings, [settingKey]: value }
      }
  ));
};
