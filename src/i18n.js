import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { readCookie, safeLocalStorageGet, safeLocalStorageSet, writeCookie } from './utils/storage';

const SUPPORTED_LANGUAGES = ['es', 'en'];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Carga traducciones desde /public/locales/{lng}.json
    ns: ['translation'],
    defaultNS: 'translation',

    backend: {
      loadPath: '/locales/{{lng}}.json',
    },

    fallbackLng: 'es',
    supportedLngs: SUPPORTED_LANGUAGES,
    load: 'languageOnly',

    // Detector: primero localStorage, luego el idioma del navegador.
    detection: {
      // Preferimos localStorage; si falla, cookie; luego navegador.
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      // Guardamos en ambos para persistencia extra.
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'lang',
      lookupCookie: 'lang',
      // 1 año (minutos)
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
