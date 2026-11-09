import React from 'react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { TOOL_CATEGORIES, TOOL_REGISTRY } from '../toolRegistry';
import { getLocalizedTool } from '../../i18n/toolTranslations.mjs';
import { useLanguage } from '../../i18n/useLanguage';

const CATEGORY_AREAS = {
  organize: 'v6-category-organize',
  convert: 'v6-category-convert',
  'edit-sign': 'v6-category-edit',
  'protect-repair': 'v6-category-protect',
  'extract-analyze': 'v6-category-extract',
};

const EditorialLightToolLink = ({ tool }) => {
  const Icon = tool.icon;

  return (
    <a className="v6-tool-link" href={tool.path}>
      <span className="v6-tool-icon"><Icon aria-hidden="true" /></span>
      <span className="v6-tool-copy">
        <strong>{tool.name}</strong>
        <span>{tool.description}</span>
      </span>
      <ArrowUpRight className="v6-tool-arrow" aria-hidden="true" />
    </a>
  );
};

const EditorialLightBento = () => {
  const { language, translate } = useLanguage();

  return (
    <section id="v6-tools" className="v6-bento-section" aria-labelledby="v6-tools-title">
      <div className="v6-section-heading">
        <div>
          <p className="v6-eyebrow">Five thoughtful collections</p>
          <h2 id="v6-tools-title">Start wherever you are.</h2>
        </div>
        <p>Pick a collection, find the action, and keep moving at your own pace.</p>
      </div>

      <div className="v6-bento">
        {TOOL_CATEGORIES.map((category, index) => {
          const tools = TOOL_REGISTRY.filter((tool) => tool.category === category.id);
          const CategoryIcon = tools[0]?.icon;
          const area = CATEGORY_AREAS[category.id];
          const categoryName = translate(`category.${category.id}`);
          if (!area) {
            throw new Error(`Missing V6 Bento placement for category: ${category.id}`);
          }

          return (
            <section
              key={category.id}
              className={`v6-category ${area}`}
              aria-labelledby={`v6-category-title-${category.id}`}
            >
              <div className="v6-category-heading">
                <span className="v6-category-icon"><CategoryIcon aria-hidden="true" /></span>
                <div>
                  <span className="v6-category-index">Collection 0{index + 1}</span>
                  <h3 id={`v6-category-title-${category.id}`}>{categoryName}</h3>
                </div>
                <span className="v6-category-count">{tools.length}</span>
              </div>
              <ul className={`v6-tool-list v6-tool-list-${category.id}`}>
                {tools.map((tool) => (
                  <li key={tool.id}>
                    <EditorialLightToolLink tool={getLocalizedTool(language, tool)} />
                  </li>
                ))}
              </ul>
              <a
                className="v6-category-link"
                href={category.path}
                aria-label={`View all ${categoryName} tools`}
              >
                View collection <ArrowUpRight aria-hidden="true" />
              </a>
            </section>
          );
        })}

        <aside className="v6-trust-tile" aria-labelledby="v6-trust-title">
          <span className="v6-trust-icon"><ShieldCheck aria-hidden="true" /></span>
          <div>
            <p className="v6-trust-kicker">A little peace of mind</p>
            <h3 id="v6-trust-title">Your files stay yours.</h3>
            <p>Work with PDF tools in your browser. Review each workflow's guidance before you begin.</p>
          </div>
          <span className="v6-trust-decoration" aria-hidden="true" />
        </aside>
      </div>
    </section>
  );
};

export default EditorialLightBento;
