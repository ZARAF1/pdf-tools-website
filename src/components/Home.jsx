import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, FileText, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdSlot from './AdSlot';
import ToolCard from './ToolCard';
import { TOOL_CATEGORIES, TOOL_REGISTRY } from './toolRegistry';

const Home = () => {
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
            PDF tools, made simple
          </p>
          <h1 className="home-hero-title">
            Powerful <span>PDF Tools</span>
          </h1>
          <p className="home-hero-tagline">All in one place.</p>
          <p className="home-hero-description">
            Browser-based tools for everyday PDF tasks. Processing details and limitations are explained on each tool page.
          </p>
          <a className="home-hero-link" href="#toolbox">
            Explore PDF tools
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <nav
          ref={heroArtRef}
          className={`home-hero-art${activeCategoryId ? ' is-expanded' : ''}`}
          aria-label="Browse tool categories"
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
                        aria-label={`${isExpanded ? 'Hide' : 'Show'} ${category.name} tools`}
                        title={`${isExpanded ? 'Hide' : 'Show'} ${category.name} tools`}
                        tabIndex={activeCategoryId && !isExpanded ? -1 : 0}
                        onClick={() => {
                          setFanReadyCategoryId(null);
                          setActiveCategoryId(isExpanded ? null : category.id);
                        }}
                      >
                        <span className="home-hero-category-text">{category.name}</span>
                        <X className="home-hero-category-close" aria-hidden="true" />
                      </button>
                      <div
                        id={fanId}
                        className={`home-hero-tool-fan${isExpanded ? ' is-open' : ''}${isFanReady ? ' is-ready' : ''}`}
                        role="group"
                        aria-label={`${category.name} tools`}
                        aria-hidden={!isExpanded}
                      >
                        <span className="home-hero-tool-fan-ring" aria-hidden="true" />
                        {tools.map((tool, toolIndex) => {
                          const ToolIcon = tool.icon;
                          const toolAngle = -90 + (toolIndex * 360) / tools.length;
                          return (
                            <Link
                              key={tool.id}
                              to={tool.path}
                              className={`home-hero-tool-link ${tool.color}`}
                              style={{
                                '--tool-angle': `${toolAngle}deg`,
                                '--tool-delay': `${toolIndex * 55}ms`
                              }}
                              aria-label={`${tool.name}: ${tool.description}`}
                              aria-hidden={!isExpanded}
                              tabIndex={isExpanded ? 0 : -1}
                              title={tool.name}
                            >
                              <ToolIcon className="home-hero-tool-icon" aria-hidden="true" />
                              <span className="home-hero-tool-tooltip" aria-hidden="true" role="tooltip">
                                {tool.name}
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
            <h2 className="text-2xl font-bold text-slate-800">Our Toolbox</h2>
            <p className="text-slate-500">Select a tool to get started</p>
          </div>
        </div>
        
        <div className="space-y-7">
          {TOOL_CATEGORIES.map((category) => {
            const tools = TOOL_REGISTRY.filter((tool) => tool.category === category.id);
            if (!tools.length) return null;
            return (
              <section id={`category-${category.id}`} key={category.id} aria-labelledby={`category-heading-${category.id}`} className="border-t border-slate-200 pt-7 first:border-t-0 first:pt-0">
                <h3 id={`category-heading-${category.id}`} className="mb-4 text-lg font-bold text-slate-800">
                  <Link className="category-section-link" to={category.path}>{category.name}</Link>
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
