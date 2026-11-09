import { TOOL_CATEGORIES, TOOL_REGISTRY } from '../toolRegistry';

export const searchTools = (query) => {
  const normalizedQuery = query.trim().toLowerCase();
  const matches = TOOL_REGISTRY.filter((tool) => {
    if (!normalizedQuery) return true;
    const category = TOOL_CATEGORIES.find((item) => item.id === tool.category);
    return `${tool.name} ${tool.description} ${tool.keywords} ${category?.name || ''}`
      .toLowerCase()
      .includes(normalizedQuery);
  });

  if (!normalizedQuery) return matches;

  const score = (tool) => {
    const normalizedName = tool.name.toLowerCase();
    if (normalizedName === normalizedQuery) return 0;
    if (normalizedName.startsWith(normalizedQuery)) return 1;
    if (normalizedName.includes(normalizedQuery)) return 2;
    return 3;
  };

  return matches.sort((first, second) => score(first) - score(second));
};
