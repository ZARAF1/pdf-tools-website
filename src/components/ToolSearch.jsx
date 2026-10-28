import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { TOOL_CATEGORIES, TOOL_REGISTRY } from './toolRegistry';

const ToolSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suppressFocusOpen = useRef(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];
    return TOOL_REGISTRY.filter((tool) => {
      const category = TOOL_CATEGORIES.find((item) => item.id === tool.category);
      return `${tool.name} ${tool.description} ${tool.keywords} ${category?.name || ''}`
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [query]);

  const openTool = (tool) => {
    navigate(tool.path);
    setQuery('');
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
      if (event.target !== inputRef.current) {
        suppressFocusOpen.current = true;
        inputRef.current?.focus();
      }
      return;
    }

    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      setIsOpen(true);
      if (event.target === inputRef.current) {
        setActiveIndex((index) => (index + 1) % results.length);
      } else {
        const index = Number(event.target.dataset.resultIndex);
        const nextIndex = Number.isInteger(index) ? Math.min(index + 1, results.length - 1) : 0;
        setActiveIndex(nextIndex);
        containerRef.current?.querySelector(`[data-result-index="${nextIndex}"]`)?.focus();
      }
    } else if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault();
      setIsOpen(true);
      if (event.target === inputRef.current) {
        setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
      } else {
        const index = Number(event.target.dataset.resultIndex);
        if (!Number.isInteger(index)) {
          setActiveIndex(results.length - 1);
          containerRef.current?.querySelector(`[data-result-index="${results.length - 1}"]`)?.focus();
        } else if (index <= 0) {
          setActiveIndex(-1);
          inputRef.current?.focus();
        } else {
          setActiveIndex(index - 1);
          containerRef.current?.querySelector(`[data-result-index="${index - 1}"]`)?.focus();
        }
      }
    } else if (event.key === 'Enter' && event.target === inputRef.current && results.length) {
      event.preventDefault();
      openTool(results[activeIndex < 0 ? 0 : activeIndex]);
    }
  };

  const handleContainerBlur = (event) => {
    if (!containerRef.current?.contains(event.relatedTarget)) {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div
      ref={containerRef}
      onBlur={handleContainerBlur}
      onKeyDown={handleKeyDown}
      className="relative w-full max-w-xl"
    >
      <label htmlFor="tool-search" className="sr-only">Search PDF tools</label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          ref={inputRef}
          id="tool-search"
          type="text"
          role="searchbox"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            if (suppressFocusOpen.current) {
              suppressFocusOpen.current = false;
              return;
            }
            if (query.trim()) setIsOpen(true);
          }}
          placeholder="Search PDF tools..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            className="tool-search-clear absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {isOpen && query.trim() && (
        <div
          id="tool-search-results"
          className="tool-search-panel absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border p-2 shadow-xl"
        >
          {results.length ? (
            <ul aria-label="Matching PDF tools" className="space-y-1">
              {results.map((tool, index) => {
                const Icon = tool.icon;
                const categoryName = TOOL_CATEGORIES.find((item) => item.id === tool.category)?.name;
                return (
                  <li key={tool.id}>
                    <button
                      data-result-index={index}
                      type="button"
                      onFocus={() => setActiveIndex(index)}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => openTool(tool)}
                      className={`tool-search-option flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${
                        index === activeIndex ? 'is-active' : ''
                      }`}
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tool.color} text-white`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-slate-800">{tool.name}</span>
                        <span className="block truncate text-xs text-slate-500">{tool.description}</span>
                        {categoryName && <span className="block text-xs text-slate-400">{categoryName}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="p-4 text-sm text-slate-500" role="status">No tools match “{query}”. Try another search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolSearch;
