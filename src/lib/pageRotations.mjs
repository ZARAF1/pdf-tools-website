const validRotations = new Set([0, 90, 180, 270]);

export const applyRotationToPages = (pageRotations, pageNumbers, rotation) => {
  if (!validRotations.has(rotation)) {
    throw new RangeError('Rotation must be 0, 90, 180, or 270 degrees.');
  }

  const targets = new Set(pageNumbers);
  for (const pageNumber of targets) {
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > pageRotations.length) {
      throw new RangeError(`Invalid page number: ${pageNumber}`);
    }
  }

  return pageRotations.map((currentRotation, index) => (
    targets.has(index + 1) ? rotation : currentRotation
  ));
};

export const rotatePageClockwise = (pageRotations, pageNumber) => {
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > pageRotations.length) {
    throw new RangeError(`Invalid page number: ${pageNumber}`);
  }

  return pageRotations.map((currentRotation, index) => (
    index === pageNumber - 1 ? (currentRotation + 90) % 360 : currentRotation
  ));
};
