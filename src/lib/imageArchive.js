const ZIP_LIMIT = 0xffffffff;

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < table.length; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

export const encodeBmp = ({ width, height, data }) => {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1
    || data.length !== width * height * 4) {
    throw new Error('The rendered page image could not be encoded as BMP.');
  }

  const rowLength = width * 3;
  const rowStride = (rowLength + 3) & ~3;
  const pixelBytes = rowStride * height;
  const fileBytes = 54 + pixelBytes;
  if (fileBytes > ZIP_LIMIT) {
    throw new Error('This page is too large to encode as a BMP image.');
  }

  const bytes = new Uint8Array(fileBytes);
  const view = new DataView(bytes.buffer);
  bytes[0] = 0x42;
  bytes[1] = 0x4d;
  view.setUint32(2, fileBytes, true);
  view.setUint32(10, 54, true);
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(34, pixelBytes, true);
  view.setInt32(38, 3780, true);
  view.setInt32(42, 3780, true);

  for (let sourceY = 0; sourceY < height; sourceY += 1) {
    const targetY = height - sourceY - 1;
    const sourceRow = sourceY * width * 4;
    const targetRow = 54 + targetY * rowStride;
    for (let x = 0; x < width; x += 1) {
      const sourceIndex = sourceRow + x * 4;
      const targetIndex = targetRow + x * 3;
      bytes[targetIndex] = data[sourceIndex + 2];
      bytes[targetIndex + 1] = data[sourceIndex + 1];
      bytes[targetIndex + 2] = data[sourceIndex];
    }
  }

  return bytes;
};

const crc32 = async (bytes, isCancelled) => {
  let value = 0xffffffff;
  const yieldAfter = 1024 * 1024;
  for (let start = 0; start < bytes.length; start += yieldAfter) {
    if (isCancelled()) throw new Error('ZIP creation was cancelled.');
    const end = Math.min(start + yieldAfter, bytes.length);
    for (let index = start; index < end; index += 1) {
      value = crcTable[(value ^ bytes[index]) & 0xff] ^ (value >>> 8);
    }
    if (end < bytes.length) await new Promise((resolve) => globalThis.setTimeout(resolve, 0));
  }
  return (value ^ 0xffffffff) >>> 0;
};

const createHeader = (length, signature) => {
  const bytes = new Uint8Array(length);
  new DataView(bytes.buffer).setUint32(0, signature, true);
  return bytes;
};

export const createZipBlob = async (files, onProgress = () => {}, isCancelled = () => false) => {
  if (!files.length || files.length > 50) {
    throw new Error('The ZIP archive must contain between 1 and 50 images.');
  }

  const localParts = [];
  const directoryParts = [];
  let localOffset = 0;
  let directorySize = 0;

  for (let index = 0; index < files.length; index += 1) {
    if (isCancelled()) throw new Error('ZIP creation was cancelled.');
    const file = files[index];
    const nameBytes = new TextEncoder().encode(file.name);
    const bytes = file.bytes;
    if (!nameBytes.length || nameBytes.length > 0xffff || !(bytes instanceof Uint8Array)) {
      throw new Error('An image could not be added to the ZIP archive.');
    }
    if (bytes.length > ZIP_LIMIT) {
      throw new Error('An image is too large to include in a ZIP archive.');
    }

    const checksum = await crc32(bytes, isCancelled);
    const localHeader = createHeader(30, 0x04034b50);
    const localView = new DataView(localHeader.buffer);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0x0800, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, 0, true);
    localView.setUint16(12, 0x21, true);
    localView.setUint32(14, checksum, true);
    localView.setUint32(18, bytes.length, true);
    localView.setUint32(22, bytes.length, true);
    localView.setUint16(26, nameBytes.length, true);
    localParts.push(localHeader, nameBytes, bytes);

    const directoryHeader = createHeader(46, 0x02014b50);
    const directoryView = new DataView(directoryHeader.buffer);
    directoryView.setUint16(4, 20, true);
    directoryView.setUint16(6, 20, true);
    directoryView.setUint16(8, 0x0800, true);
    directoryView.setUint16(10, 0, true);
    directoryView.setUint16(12, 0, true);
    directoryView.setUint16(14, 0x21, true);
    directoryView.setUint32(16, checksum, true);
    directoryView.setUint32(20, bytes.length, true);
    directoryView.setUint32(24, bytes.length, true);
    directoryView.setUint16(28, nameBytes.length, true);
    directoryView.setUint32(42, localOffset, true);
    directoryParts.push(directoryHeader, nameBytes);
    directorySize += directoryHeader.length + nameBytes.length;
    localOffset += localHeader.length + nameBytes.length + bytes.length;

    if (localOffset > ZIP_LIMIT || directorySize > ZIP_LIMIT) {
      throw new Error('The generated images are too large for a browser ZIP archive. Choose a lower quality or JPG format.');
    }
    onProgress(index + 1, files.length);
    if (index + 1 < files.length) {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 0));
    }
  }

  if (isCancelled()) throw new Error('ZIP creation was cancelled.');
  const endRecord = createHeader(22, 0x06054b50);
  const endView = new DataView(endRecord.buffer);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, directorySize, true);
  endView.setUint32(16, localOffset, true);

  return new Blob([...localParts, ...directoryParts, endRecord], { type: 'application/zip' });
};
