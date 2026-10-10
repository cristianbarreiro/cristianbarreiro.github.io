import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { readCookie, safeLocalStorageGet, safeLocalStorageSet, writeCookie } from './utils/storage';

import es from '../public/locales/es.json';
import en from '../public/locales/en.json';

const SUPPORTED_LANGUAGES = ['es', 'en'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: ['translation'],
    defaultNS: 'translation',

    resources: {
      es: { translation: es },
      en: { translation: en },
    },

    fallbackLng: 'es',
    supportedLngs: SUPPORTED_LANGUAGES,
    load: 'languageOnly',

    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'lang',
      lookupCookie: 'lang',
      cookieMinutes: 60 * 24 * 365,
      cookieOptions: { path: '/', sameSite: 'lax' },
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

const normalizeLanguage = (lng) => {
  if (!lng) return 'es';
  const base = lng.split('-')[0].toLowerCase();
  return SUPPORTED_LANGUAGES.includes(base) ? base : 'es';
};

const applyLanguageMetadataAndStorage = (lng) => {
  const resolved = normalizeLanguage(lng);

  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = resolved;
  }

  const ls = safeLocalStorageGet('lang');
  if (ls !== resolved) safeLocalStorageSet('lang', resolved);

  const ck = readCookie('lang');
  if (ck !== resolved) writeCookie('lang', resolved, { maxAgeDays: 365 });
};

// Sincroniza metadatos del documento y persistencia doble (localStorage + cookie)
applyLanguageMetadataAndStorage(i18n.resolvedLanguage || i18n.language);

i18n.on('initialized', () => {
  applyLanguageMetadataAndStorage(i18n.resolvedLanguage || i18n.language);
});

i18n.on('languageChanged', (lng) => {
  applyLanguageMetadataAndStorage(lng);
});

export default i18n;
export { SUPPORTED_LANGUAGES };
