export const limitImageFiles = (currentCount, pendingCount, candidateFiles, maximum) => {
  const files = Array.from(candidateFiles);
  const availableSlots = Math.max(0, maximum - currentCount - pendingCount);
  const acceptedCount = Math.min(availableSlots, files.length);

  return {
    files: files.slice(0, acceptedCount),
    overflowCount: files.length - acceptedCount
  };
};
