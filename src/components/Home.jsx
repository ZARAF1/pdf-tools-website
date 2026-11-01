import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, FileText, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdSlot from './AdSlot';
import ToolCard from './ToolCard';
import { TOOL_CATEGORIES, TOOL_REGISTRY } from './toolRegistry';
import { useLanguage } from '../i18n/useLanguage';
import { getLocalizedTool } from '../i18n/toolTranslations.mjs';

const Home = () => {
  const { language, translate } = useLanguage();
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [fanReadyCategoryId, setFanReadyCategoryId] = useState(null);
  const heroArtRef = useRef(null);
  const categoryTriggerRefs = useRef(new Map());

  useEffect(() => {
    const previousTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.content;
    document.title = 'Free Online PDF Tools | PDF Merge Pro';
    if (metaDescription) {
      metaDescription.content = 'Organize, convert, optimize, redact, sign, and protect PDFs with browser-based tools.';
    }

    return () => {
      document.title = previousTitle;
      if (metaDescription && previousDescription !== undefined) {
        metaDescription.content = previousDescription;
      }
    };
  }, []);

  useEffect(() => {
    if (!activeCategoryId) return undefined;

    const handlePointerDown = (event) => {
      if (!heroArtRef.current?.contains(event.target)) {
        setFanReadyCategoryId(null);
        setActiveCategoryId(null);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setFanReadyCategoryId(null);
      setActiveCategoryId(null);
      categoryTriggerRefs.current.get(activeCategoryId)?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeCategoryId]);

  return (
    <div className="space-y-16">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-hero-eyebrow">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {translate('homeEyebrow')}
          </p>
          <h1 className="home-hero-title">
            {translate('homeTitle')}
          </h1>
          <p className="home-hero-tagline">{translate('homeTagline')}</p>
          <p className="home-hero-description">
            {translate('homeDescription')}
          </p>
          <a className="home-hero-link" href="#toolbox">
            {translate('homeExplore')}
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <nav
          ref={heroArtRef}
          className={`home-hero-art${activeCategoryId ? ' is-expanded' : ''}`}
          aria-label={translate('browseToolCategories')}
        >
          <div className="home-hero-orbit home-hero-orbit-outer" aria-hidden="true" />
          <div className="home-hero-orbit home-hero-orbit-inner" aria-hidden="true" />
          <div className="home-hero-paper home-hero-paper-back" aria-hidden="true" />
          <div className="home-hero-paper home-hero-paper-middle" aria-hidden="true" />
          <div className="home-hero-document" aria-hidden="true">
            <div className="home-hero-document-heading">
              <span className="home-hero-document-icon"><FileText className="h-7 w-7" /></span>
              <span className="home-hero-document-label">PDF</span>
            </div>
            <span className="home-hero-document-line home-hero-document-line-long" />
            <span className="home-hero-document-line" />
            <span className="home-hero-document-line home-hero-document-line-short" />
            <span className="home-hero-document-block" />
          </div>
          <div className={`home-hero-category-orbit${activeCategoryId ? ' is-expanded' : ''}`}>
            {TOOL_CATEGORIES.map((category, index) => {
              const tools = TOOL_REGISTRY.filter((tool) => tool.category === category.id);
              const isExpanded = category.id === activeCategoryId;
              const isFanReady = category.id === fanReadyCategoryId;
              const fanId = `hero-tools-${category.id}`;

              return (
                <div
                  key={category.id}
                  className={`home-hero-category-badge${isExpanded ? ' is-expanded' : ''}`}
                  aria-hidden={Boolean(activeCategoryId && !isExpanded)}
                  style={{ '--badge-angle': `${index * 72}deg` }}
                  onTransitionEnd={(event) => {
                    if (
                      event.target === event.currentTarget
                      && event.propertyName === 'transform'
                      && isExpanded
                    ) {
                      setFanReadyCategoryId(category.id);
                    }
                  }}
                >
                  <span className="home-hero-category-counter">
                    <span className="home-hero-category-label">
                      <button
                        ref={(element) => {
                          if (element) categoryTriggerRefs.current.set(category.id, element);
                          else categoryTriggerRefs.current.delete(category.id);
                        }}
                        type="button"
                        className="home-hero-category-chip"
                        aria-expanded={isExpanded}
                        aria-controls={fanId}
                        aria-label={`${translate(isExpanded ? 'hide' : 'show')} ${translate(`category.${category.id}`)}`}
                        title={`${translate(isExpanded ? 'hide' : 'show')} ${translate(`category.${category.id}`)}`}
                        tabIndex={activeCategoryId && !isExpanded ? -1 : 0}
                        onClick={() => {
                          setFanReadyCategoryId(null);
                          setActiveCategoryId(isExpanded ? null : category.id);
                        }}
                      >
                        <span className="home-hero-category-text">{translate(`category.${category.id}`)}</span>
                        <X className="home-hero-category-close" aria-hidden="true" />
                      </button>
                      <div
                        id={fanId}
                        className={`home-hero-tool-fan${isExpanded ? ' is-open' : ''}${isFanReady ? ' is-ready' : ''}`}
                        role="group"
                        aria-label={translate(`category.${category.id}`)}
                        aria-hidden={!isExpanded}
                      >
                        <span className="home-hero-tool-fan-ring" aria-hidden="true" />
                        {tools.map((tool, toolIndex) => {
                          const localizedTool = getLocalizedTool(language, tool);
                          const ToolIcon = localizedTool.icon;
                          const toolAngle = -90 + (toolIndex * 360) / tools.length;
                          return (
                            <Link
                              key={localizedTool.id}
                              to={localizedTool.path}
                              className={`home-hero-tool-link ${localizedTool.color}`}
                              style={{
                                '--tool-angle': `${toolAngle}deg`,
                                '--tool-delay': `${toolIndex * 55}ms`
                              }}
                              aria-label={`${localizedTool.name}: ${localizedTool.description}`}
                              aria-hidden={!isExpanded}
                              tabIndex={isExpanded ? 0 : -1}
                              title={localizedTool.name}
                            >
                              <ToolIcon
                                className={`home-hero-tool-icon${localizedTool.id === 'merge' ? ' home-hero-tool-icon--merge' : ''}`}
                                aria-hidden="true"
                              />
                              <span className="home-hero-tool-tooltip" aria-hidden="true" role="tooltip">
                                {localizedTool.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </nav>
      </section>

      <section id="toolbox" className="scroll-mt-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{translate('toolbox')}</h2>
            <p className="text-slate-500">{translate('selectToolToGetStarted')}</p>
          </div>
        </div>
        
        <div className="space-y-7">
          {TOOL_CATEGORIES.map((category) => {
            const tools = TOOL_REGISTRY.filter((tool) => tool.category === category.id);
            const categoryName = translate(`category.${category.id}`);
            if (!tools.length) return null;
            return (
              <section id={`category-${category.id}`} key={category.id} aria-labelledby={`category-heading-${category.id}`} className="border-t border-slate-200 pt-7 first:border-t-0 first:pt-0">
                <h3 id={`category-heading-${category.id}`} className="mb-4 text-lg font-bold text-slate-800">
                  <Link className="category-section-link" to={category.path}>{categoryName}</Link>
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
                </div>
              </section>
            );
          })}
        </div>
        <AdSlot placement="homeBelowTools" />
      </section>
    </div>
  );
};

export default Home;
