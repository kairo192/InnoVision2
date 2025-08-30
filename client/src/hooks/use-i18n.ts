import { createContext, useContext, useState, useEffect, ReactNode, createElement } from 'react';
import { translations, type Language, type TranslationKey } from '../lib/translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('innovision-language') as Language;
    if (saved && translations[saved]) {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('innovision-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    if (language === 'ar') {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }
  }, [language]);

  const t = (key: TranslationKey): string => {
    const keys = key.split('.') as string[];
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  
  return createElement(
    I18nContext.Provider,
    { value: { language, setLanguage, t, dir } },
    children
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}