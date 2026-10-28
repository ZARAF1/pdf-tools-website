import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ToolCard = ({ tool }) => {
  const Icon = tool.icon;

  return (
    <Link to={tool.path} className="tool-card group">
      <span className="tool-card-icon" aria-hidden="true">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-5">{tool.name}</span>
        <span className="mt-1 block line-clamp-2 text-sm leading-5 text-slate-500">{tool.description}</span>
      </span>
      <ArrowRight className="tool-card-arrow h-4 w-4 shrink-0" aria-hidden="true" />
    </Link>
  );
};

export default ToolCard;
