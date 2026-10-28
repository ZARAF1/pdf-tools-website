import React from 'react';
import { TOOL_CATEGORIES, TOOL_REGISTRY } from './toolRegistry';
import ToolCard from './ToolCard';

const RelatedToolsCarousel = ({ currentToolId }) => {
  const currentTool = TOOL_REGISTRY.find((tool) => tool.id === currentToolId);
  if (!currentTool) return null;

  const category = TOOL_CATEGORIES.find((item) => item.id === currentTool.category);
  const tools = TOOL_REGISTRY.filter((tool) => (
    tool.category === currentTool.category && tool.id !== currentToolId
  ));
  if (!category || !tools.length) return null;

  return (
    <section aria-labelledby="related-tools-heading">
      <h2 id="related-tools-heading" className="mb-5 text-2xl font-bold text-slate-800">
        {{
          organize: 'Other organizing tools',
          convert: 'Other Conversion tools',
          'edit-sign': 'Other Edit & Sign tools',
          'protect-repair': 'Other Protect & Repair tools',
          'extract-analyze': 'Other Extract & Analyze tools'
        }[category.id]}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
      </div>
    </section>
  );
};

export default RelatedToolsCarousel;
