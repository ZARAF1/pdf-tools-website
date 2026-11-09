import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { searchTools } from './searchTools.mjs';
import { getLocalizedTool } from '../../i18n/toolTranslations.mjs';
import { useLanguage } from '../../i18n/useLanguage';

const EditorialLightSearch = () => {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const results = useMemo(
    () => (query.trim() ? searchTools(query) : []),
    [query],
  );

  useEffect(() => {
    const closeOnOutsidePointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, []);

  const openFirstResult = () => {
    if (results.length) window.location.assign(results[0].path);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      inputRef.current?.focus();
    } else if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      rootRef.current?.querySelector('[data-v6-search-result]')?.focus();
    } else if (event.key === 'Enter' && event.target === inputRef.current) {
      event.preventDefault();
      openFirstResult();
    }
  };

  const resultCount = results.length === 1
    ? '1 matching tool'
    : `${results.length} matching tools`;

  return (
    <div
      ref={rootRef}
      className="v6-search"
      role="search"
      aria-label="Search PDF tools"
      onKeyDown={handleKeyDown}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <label className="v6-visually-hidden" htmlFor="v6-tool-search">
        Search PDF tools by name, description, or keyword
      </label>
      <div className="v6-search-field">
        <Search className="v6-search-icon" aria-hidden="true" />
        <input
          ref={inputRef}
          id="v6-tool-search"
          type="search"
          autoComplete="off"
          placeholder="What would you like to do?"
          value={query}
          aria-controls="v6-search-results"
          aria-expanded={Boolean(isOpen && query.trim())}
          aria-describedby="v6-search-status"
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
        />
        {query && (
          <button
            type="button"
            className="v6-search-clear"
            aria-label="Clear search"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
          >
            <X aria-hidden="true" />
          </button>
        )}
      </div>
      <p id="v6-search-status" className="v6-visually-hidden" role="status">
        {query.trim() ? resultCount : 'Search by tool name, description, or keyword.'}
      </p>
      <div
        id="v6-search-results"
        className="v6-search-results"
        hidden={!(isOpen && query.trim())}
      >
        <p className="v6-search-count">{resultCount}</p>
        {results.length ? (
          <ul aria-label="Matching PDF tools">
            {results.map((tool) => {
              const localizedTool = getLocalizedTool(language, tool);
              const Icon = localizedTool.icon;
              return (
                <li key={localizedTool.id}>
                  <a
                    data-v6-search-result
                    href={localizedTool.path}
                    className="v6-search-result"
                  >
                    <span className="v6-search-result-icon"><Icon aria-hidden="true" /></span>
                    <span className="v6-search-result-copy">
                      <strong>{localizedTool.name}</strong>
                      <span>{localizedTool.description}</span>
                    </span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="v6-search-empty">No tools found. Try a different name or keyword.</p>
        )}
      </div>
    </div>
  );
};

export default EditorialLightSearch;
