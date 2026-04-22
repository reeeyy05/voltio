import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';

export function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-stone-100 dark:bg-card border-t border-stone-200 dark:border-border relative z-10 pt-16 pb-8 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-6 opacity-90">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Zap className="h-8 w-8 text-primary fill-primary/20" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                                Voltio
                            </span>
                        </div>
                        <p className="text-stone-600 dark:text-stone-400 max-w-sm leading-relaxed">
                            {t('footer.description')}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-6 uppercase tracking-wider text-sm">{t('footer.platform')}</h4>
                        <ul className="space-y-4 text-stone-600 dark:text-stone-400">
                            <li><Link to="#" className="hover:text-primary transition-colors">{t('footer.features')}</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">{t('footer.security')}</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">{t('footer.docs')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-6 uppercase tracking-wider text-sm">{t('footer.legal')}</h4>
                        <ul className="space-y-4 text-stone-600 dark:text-stone-400">
                            <li><Link to="#" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">{t('footer.terms')}</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">{t('footer.contact')}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-stone-200 dark:border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                        © {new Date().getFullYear()} {t('footer.rights')}
                    </p>
                    <div className="text-sm text-stone-500 dark:text-stone-400 font-medium">
                        {t('footer.system')}
                    </div>
                </div>
            </div>
        </footer>
    );
}