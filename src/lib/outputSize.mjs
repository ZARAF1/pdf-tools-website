export const formatOutputSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes < 0) {
    throw new RangeError('Output size must be a non-negative number of bytes.');
  }
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
