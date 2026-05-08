import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 p-2 text-sm font-medium text-stone-600 bg-stone-200 rounded-md hover:bg-stone-300 transition-colors dark:text-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700"
            aria-label="Toggle language"
        >
            <Globe className="h-4 w-4" />
            {i18n.language === 'es' ? 'EN' : 'ES'}
        </button>
    );
};