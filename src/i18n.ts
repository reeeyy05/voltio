import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // <-- Importamos el plugin

import translationES from './locales/es.json';
import translationEN from './locales/en.json';

const resources = {
    es: { translation: translationES },
    en: { translation: translationEN }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'voltio_lang',
        }
    });

export default i18n;