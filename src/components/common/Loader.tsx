import React from 'react';
import { useTranslation } from 'react-i18next';

interface LoaderProps {
    fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ fullScreen = false }) => {
    const { t } = useTranslation();

    const containerClasses = fullScreen
        ? "fixed inset-0 flex items-center justify-center bg-stone-100/80 dark:bg-stone-900/80 z-50"
        : "flex items-center justify-center p-4";

    return (
        <div className={containerClasses} role="status">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="sr-only">{t('common.loading')}</span>
        </div>
    );
};