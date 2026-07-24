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

// Garantiza persistencia doble (localStorage + cookie) desde el arranque.
// Nota: el detector cachea en cambios de idioma, pero no siempre crea cookie en el primer load.
i18n.on('initialized', () => {
  const resolved = (i18n.resolvedLanguage || i18n.language || 'es').split('-')[0];

  const ls = safeLocalStorageGet('lang');
  if (ls !== resolved) safeLocalStorageSet('lang', resolved);

  const ck = readCookie('lang');
  if (ck !== resolved) writeCookie('lang', resolved, { maxAgeDays: 365 });
});

export default i18n;
export { SUPPORTED_LANGUAGES };
