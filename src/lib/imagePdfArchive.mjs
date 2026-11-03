import { createZipBlob } from './imageArchive.mjs';

const getPdfName = (imageName) => {
  const fileName = imageName.split(/[\\/]/).pop()
    .replace(/\.[^.]+$/, '')
    .replace(/[<>:"|?*\u0000-\u001f]/g, '_')
    .trim()
    .replace(/[. ]+$/g, '');
  return `${fileName || 'image'}.pdf`;
};

export const createImagePdfArchive = async (outputs) => {
  if (!Array.isArray(outputs) || outputs.length === 0) {
    throw new Error('Add at least one PDF to create an image archive.');
  }

  const usedNames = new Set();
  const files = outputs.map(({ imageName, bytes }) => {
    if (typeof imageName !== 'string' || !(bytes instanceof Uint8Array)) {
      throw new Error('Each image PDF needs a filename and PDF data.');
    }

    const baseName = getPdfName(imageName).replace(/\.pdf$/, '');
    let name = `${baseName}.pdf`;
    let suffix = 2;
    while (usedNames.has(name.toLocaleLowerCase())) {
      name = `${baseName}_${suffix}.pdf`;
      suffix += 1;
    }
    usedNames.add(name.toLocaleLowerCase());
    return { name, bytes };
  });

  return { blob: await createZipBlob(files), name: 'images_to_pdf.zip' };
};
