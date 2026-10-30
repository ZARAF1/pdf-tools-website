import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLocalizedTool } from '../i18n/toolTranslations.mjs';
import { useLanguage } from '../i18n/useLanguage';

const ToolCard = ({ tool }) => {
  const { language } = useLanguage();
  const localizedTool = getLocalizedTool(language, tool);
  const Icon = localizedTool.icon;

  return (
    <Link to={localizedTool.path} className="tool-card group">
      <span className="tool-card-icon" aria-hidden="true">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-5">{localizedTool.name}</span>
        <span className="mt-1 block line-clamp-2 text-sm leading-5 text-slate-500">{localizedTool.description}</span>
      </span>
      <ArrowRight className="tool-card-arrow h-4 w-4 shrink-0" aria-hidden="true" />
    </Link>
  );
};

export default ToolCard;
