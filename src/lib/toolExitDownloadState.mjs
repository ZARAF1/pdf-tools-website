const normalizeOutputs = (outputs) => {
  const values = Array.isArray(outputs) ? outputs : outputs ? [outputs] : [];
  return values.map((output, index) => {
    if (typeof output === 'object' && output !== null) {
      return {
        id: String(output.id ?? output.name ?? `output-${index}`),
        token: output.token ?? output.outputBytes ?? output.bytes ?? output.blob ?? output
      };
    }

    return { id: `output-${index}`, token: output };
  });
};

export const createDownloadStateTracker = () => {
  let outputs = [];
  let downloadedIds = new Set();

  const update = (nextOutputs) => {
    const next = normalizeOutputs(nextOutputs);
    const nextDownloadedIds = new Set(
      next
        .filter((entry) => (
          downloadedIds.has(entry.id)
          && outputs.some((previous) => previous.id === entry.id && previous.token === entry.token)
        ))
        .map(({ id }) => id)
    );

    outputs = next;
    downloadedIds = nextDownloadedIds;
  };

  const markDownloaded = (id) => {
    const targetId = id === undefined && outputs.length === 1
      ? outputs[0].id
      : String(id);
    if (outputs.some((entry) => entry.id === targetId)) {
      downloadedIds.add(targetId);
    }
  };

  return {
    update,
    markDownloaded,
    getPendingCount: () => outputs.filter(({ id }) => !downloadedIds.has(id)).length
  };
};

export const createToolExitStateTracker = () => {
  const downloadTracker = createDownloadStateTracker();
  const toolStates = new Map();

  const update = (toolId, attached, outputs) => {
    const normalizedOutputs = normalizeOutputs(outputs);
    if (!attached && normalizedOutputs.length === 0) {
      toolStates.delete(toolId);
    } else {
      toolStates.set(toolId, { attached: Boolean(attached), outputs: normalizedOutputs });
    }

    downloadTracker.update(
      [...toolStates.entries()].flatMap(([id, state]) => (
        state.outputs.map((output) => ({
          id: `${String(id)}:${output.id}`,
          token: output.token
        }))
      ))
    );
  };

  const markDownloaded = (toolId, outputId) => {
    const outputs = toolStates.get(toolId)?.outputs || [];
    const targetId = outputId === undefined && outputs.length === 1
      ? outputs[0].id
      : String(outputId);
    downloadTracker.markDownloaded(`${String(toolId)}:${targetId}`);
  };

  return {
    update,
    markDownloaded,
    hasAttachedFiles: () => [...toolStates.values()].some(({ attached }) => attached),
    getPendingCount: downloadTracker.getPendingCount
  };
};
