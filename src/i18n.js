import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

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
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'lang',
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
export { SUPPORTED_LANGUAGES };
