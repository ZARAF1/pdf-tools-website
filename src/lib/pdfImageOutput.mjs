import { createZipBlob } from './imageArchive.mjs';
import { normalizeOutputFileName } from './outputFileName.mjs';

export const createPdfImageDownload = async ({
  images,
  format,
  outputBaseName,
  fallbackBaseName,
  onProgress = () => {},
  isCancelled = () => false
}) => {
  if (!Array.isArray(images) || images.length === 0) {
    throw new Error('At least one image is required to create an output file.');
  }
  if (!format || typeof format.mimeType !== 'string' || typeof format.extension !== 'string') {
    throw new Error('The selected image format is invalid.');
  }
  if (images.some(({ bytes }) => !(bytes instanceof Uint8Array))) {
    throw new Error('A rendered page image is invalid.');
  }

  const isSingleImage = images.length === 1;
  const extension = isSingleImage ? format.extension : 'zip';
  const blob = isSingleImage
    ? new Blob([images[0].bytes], { type: format.mimeType })
    : await createZipBlob(images, onProgress, isCancelled);

  return {
    blob,
    fileName: normalizeOutputFileName(
      outputBaseName,
      `${fallbackBaseName || 'images'}.${extension}`
    ),
    downloadLabel: isSingleImage ? 'Download Image' : 'Download ZIP'
  };
};
