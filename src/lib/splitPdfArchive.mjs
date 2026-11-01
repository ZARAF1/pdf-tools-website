import { createZipBlob } from './imageArchive.mjs';

export const createSplitPdfArchive = async (outputs, sourceName, archiveSuffix = 'split_pages') => {
  if (outputs.length <= 3) return null;

  const blob = await createZipBlob(outputs);
  const baseName = sourceName.replace(/\.pdf$/i, '').trim() || 'document';
  return {
    blob,
    name: `${baseName}_${archiveSuffix}.zip`
  };
};
