import React from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Download,
  MonitorSmartphone,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { TOOL_CATEGORIES, TOOL_REGISTRY } from '../toolRegistry';
import { getLocalizedTool } from '../../i18n/toolTranslations.mjs';
import { useLanguage } from '../../i18n/useLanguage';
import { getLanguageDirection } from '../../i18n/languageCatalog.mjs';

const CATEGORY_COLUMNS = [
  ['organize', 'protect-repair'],
  ['convert', 'edit-sign', 'extract-analyze'],
];

const trustStepsStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '3px',
  margin: '16px 0 0',
};
const trustStepStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '12px',
  minHeight: '0',
  padding: '10px 12px',
  border: '1px solid #e8d9ca',
  borderRadius: '16px',
  color: '#2f473d',
  background: '#fbf8f3',
  fontSize: '16px',
  fontWeight: 700,
  lineHeight: 1.35,
};
const trustStepIconStyle = {
  display: 'grid',
  width: '48px',
  height: '48px',
  flex: '0 0 48px',
  placeItems: 'center',
  border: '1px solid #eadfd1',
  borderRadius: '14px',
  color: '#315746',
  background: '#fffdf9',
};
const trustStepArrowStyle = {
  display: 'flex',
  height: '32px',
  minHeight: '0',
  flex: '0 0 32px',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '4px 0',
  padding: '0',
  border: '0',
  background: 'transparent',
  lineHeight: 0,
};

const categoryOrder = TOOL_CATEGORIES.map((category) => category.id);

const CategoryArtwork = ({ categoryId, isRtl }) => {
  const artwork = {
    organize: (
      <>
        <path d="M79 38h54a8 8 0 0 1 8 8v42a8 8 0 0 1-8 8H79a8 8 0 0 1-8-8V46a8 8 0 0 1 8-8z" />
        <path d="M85 54h39M85 66h31M85 78h36" />
        <path d="M91 48h48a8 8 0 0 1 8 8v42a8 8 0 0 1-8 8H91" />
      </>
    ),
    convert: (
      <>
        <path d="M70 52c18-16 36-16 54 0s36 16 54 0" />
        <path d="M70 72c18-16 36-16 54 0s36 16 54 0" />
        <path d="M70 92c18-16 36-16 54 0s36 16 54 0" />
      </>
    ),
    'edit-sign': (
      <>
        <path d="M74 91c15-28 25-28 34-10 8 16 16 12 27-5 8-12 17-22 29-24" />
        <path d="M81 105h72" />
        <path d="M82 42h24M94 30v24" />
      </>
    ),
    'protect-repair': (
      <>
        <path d="M112 30 148 44v27c0 23-15 39-36 51-21-12-36-28-36-51V44z" />
        <path d="m96 72 11 11 22-24" />
      </>
    ),
    'extract-analyze': (
      <>
        <path d="M72 42h88v66H72zM72 64h88M72 86h88M101 42v66M131 42v66" />
        <path d="M82 98V76h9v22M111 98V70h9v28M141 98V56h9v42" />
      </>
    ),
  }[categoryId];

  return (
    <svg
      className="v6-category-art"
      viewBox="0 0 180 140"
      aria-hidden="true"
      focusable="false"
      style={{ right: isRtl ? 'auto' : 0, left: isRtl ? 0 : 'auto' }}
    >
      {artwork}
    </svg>
  );
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
  const isRtl = getLanguageDirection(language) === 'rtl';

  return (
    <section id="v6-tools" className="v6-bento-section" aria-labelledby="v6-tools-title">
      <div className="v6-section-heading">
        <div>
          <p className="v6-eyebrow">{translate('v6CollectionsEyebrow')}</p>
          <h2 id="v6-tools-title">{translate('v6CollectionsTitle')}</h2>
        </div>
      </div>

      <div className="v6-bento">
        {CATEGORY_COLUMNS.map((column, columnIndex) => (
          <div className="v6-bento-column" key={columnIndex}>
            {column.map((categoryId) => {
              const category = TOOL_CATEGORIES.find((item) => item.id === categoryId);
              if (!category) {
                throw new Error(`Missing V6 Bento category: ${categoryId}`);
              }

              const tools = TOOL_REGISTRY.filter((tool) => tool.category === category.id);
              const CategoryIcon = tools[0]?.icon;
              const categoryName = translate(`category.${category.id}`);
              const translatedCategoryLinkLabel = `${translate('viewCategory')}: ${categoryName}`;
              const viewAllToolsLabel = `View all ${categoryName} tools`;
              const toolsCountLabel = translate('toolsCount').replace(
                '{{count}}',
                new Intl.NumberFormat(language).format(tools.length),
              );

              return (
                <section
                  key={category.id}
                  className={`v6-category v6-category-${category.id}`}
                  aria-labelledby={`v6-category-title-${category.id}`}
                >
                  <div className="v6-category-heading">
                    <span className="v6-category-icon"><CategoryIcon aria-hidden="true" /></span>
                    <div>
                      <h3 id={`v6-category-title-${category.id}`}>{categoryName}</h3>
                    </div>
                    <span
                      className="v6-category-count"
                      style={{
                        height: 'auto',
                        minHeight: '32px',
                        minWidth: 0,
                        maxWidth: '45%',
                        padding: '4px 8px',
                        borderRadius: '9999px',
                        flex: '0 1 auto',
                        overflowWrap: 'anywhere',
                        textAlign: 'center',
                      }}
                    >
                      {toolsCountLabel}
                    </span>
                  </div>
                  <ul className={`v6-tool-list v6-tool-list-${category.id}`}>
                    {tools.map((tool) => (
                      <li key={tool.id}>
                        <EditorialLightToolLink tool={getLocalizedTool(language, tool)} />
                      </li>
                    ))}
                  </ul>
                  <span
                    className="v6-visually-hidden"
                    aria-label={`View all ${categoryName} tools`}
                  />
                  <span
                    className="v6-visually-hidden"
                    aria-label={`${translate('viewCategory')}: ${categoryName}`}
                  />
                  <a
                    className="v6-category-link"
                    href={category.path}
                    data-category-label={translatedCategoryLinkLabel}
                    aria-label={viewAllToolsLabel}
                  >
                    {translate('viewCategory')} <ArrowUpRight aria-hidden="true" />
                  </a>
                  <CategoryArtwork
                    categoryId={category.id}
                    isRtl={isRtl}
                  />
                </section>
              );
            })}
            {columnIndex === 0 && (
              <aside className="v6-trust-tile" aria-labelledby="v6-trust-title">
                <div className="v6-trust-content">
                  <div className="v6-trust-heading">
                    <span className="v6-trust-icon"><ShieldCheck aria-hidden="true" /></span>
                    <div>
                      <p className="v6-trust-kicker">{translate('v6TrustEyebrow')}</p>
                      <h3 id="v6-trust-title">{translate('v6TrustTitle')}</h3>
                    </div>
                  </div>
                  <p className="v6-trust-description">{translate('v6TrustDescription')}</p>
                  <ol
                    className="v6-trust-steps"
                    style={trustStepsStyle}
                  >
                    <li style={trustStepStyle}>
                      <span className="v6-trust-step-icon" style={trustStepIconStyle}>
                        <Upload aria-hidden="true" style={{ width: '24px', height: '24px' }} />
                      </span>
                      <strong>{translate('uploadToTool')}</strong>
                    </li>
                    <li
                      className="v6-trust-step-arrow"
                      aria-hidden="true"
                      style={trustStepArrowStyle}
                    >
                      <ArrowDown
                        aria-hidden="true"
                        style={{ width: '24px', height: '24px', color: '#a35d45', strokeWidth: 2.5 }}
                      />
                    </li>
                    <li style={trustStepStyle}>
                      <span className="v6-trust-step-icon" style={trustStepIconStyle}>
                        <MonitorSmartphone aria-hidden="true" style={{ width: '24px', height: '24px' }} />
                      </span>
                      <strong>{translate('processDocumentInBrowser')}</strong>
                    </li>
                    <li
                      className="v6-trust-step-arrow"
                      aria-hidden="true"
                      style={trustStepArrowStyle}
                    >
                      <ArrowDown
                        aria-hidden="true"
                        style={{ width: '24px', height: '24px', color: '#a35d45', strokeWidth: 2.5 }}
                      />
                    </li>
                    <li style={trustStepStyle}>
                      <span className="v6-trust-step-icon" style={trustStepIconStyle}>
                        <Download aria-hidden="true" style={{ width: '24px', height: '24px' }} />
                      </span>
                      <strong>{translate('download')}</strong>
                    </li>
                  </ol>
                </div>
              </aside>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default EditorialLightBento;
