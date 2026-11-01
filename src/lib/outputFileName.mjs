const getExtension = (fileName) => {
  const extension = String(fileName).match(/\.([a-z0-9]{1,8})$/i)?.[1];
  if (!extension) {
    throw new Error('The generated file does not have a supported filename extension.');
  }
  return extension.toLowerCase();
};

const getSafeBaseName = (value) => String(value || '')
  .split(/[\\/]/)
  .pop()
  .replace(/\.[^.]*$/, '')
  .replace(/[<>:"|?*\x00-\x1f]/g, '_')
  .replace(/[. ]+$/g, '')
  .replace(/^\.+/, '')
  .trim();

export const normalizeOutputFileName = (value, defaultFileName) => {
  const extension = getExtension(defaultFileName);
  const defaultBaseName = getSafeBaseName(defaultFileName);
  let baseName = getSafeBaseName(value);
  if (!baseName || /^(con|prn|aux|nul|com\d|lpt\d)$/i.test(baseName)) {
    baseName = defaultBaseName || 'download';
  }
  return `${baseName}.${extension}`;
};
