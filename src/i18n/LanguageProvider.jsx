import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getInitialLanguage,
  getLanguageDirection,
  getMessage,
  SUPPORTED_LANGUAGES
} from './languageCatalog.mjs';
import { LanguageContext } from './languageContext';

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = getLanguageDirection(language);
    try {
      window.localStorage.setItem('pdf-tools-language', language);
    } catch (error) {
      console.warn('Could not save the selected website language.', error);
    }
  }, [language]);

  const setLanguage = useCallback((nextLanguage) => {
    if (!SUPPORTED_LANGUAGES.some(({ code }) => code === nextLanguage)) {
      throw new RangeError(`Unsupported website language: ${nextLanguage}`);
    }
    setLanguageState(nextLanguage);
  }, []);

  const translate = useCallback(
    (key) => getMessage(language, key),
    [language]
  );
  const value = useMemo(
    () => ({ language, setLanguage, translate }),
    [language, setLanguage, translate]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
