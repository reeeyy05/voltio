import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';
// Importamos las marcas comerciales desde FontAwesome (a través de react-icons)
import { FaXTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa6';

export function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-stone-100 dark:bg-card border-t border-stone-200 dark:border-border relative z-10 pt-16 pb-8 px-6 md:px-12 mt-auto">
            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">

                    <div className="max-w-md">
                        <div className="flex items-center gap-2 mb-6 opacity-90">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Zap className="h-8 w-8 text-primary fill-primary/20" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                                Voltio
                            </span>
                        </div>
                        <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
                            {t('footer.description')}
                        </p>

                        {/* Redes Sociales usando react-icons */}
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2.5 bg-stone-200 dark:bg-stone-900 rounded-full text-stone-500 hover:text-primary hover:bg-primary/10 transition-colors shadow-sm">
                                <FaXTwitter className="h-4 w-4" />
                            </a>
                            <a href="#" className="p-2.5 bg-stone-200 dark:bg-stone-900 rounded-full text-stone-500 hover:text-primary hover:bg-primary/10 transition-colors shadow-sm">
                                <FaLinkedinIn className="h-4 w-4" />
                            </a>
                            <a href="https://github.com/reeeyy05/Voltio" className="p-2.5 bg-stone-200 dark:bg-stone-900 rounded-full text-stone-500 hover:text-primary hover:bg-primary/10 transition-colors shadow-sm">
                                <FaGithub className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div className="flex gap-16 sm:gap-24">
                        <div>
                            <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-6 uppercase tracking-wider text-sm">
                                {t('footer.platform')}
                            </h4>
                            <ul className="space-y-4 text-sm text-stone-600 dark:text-stone-400 font-medium">
                                <li><Link to="#" className="hover:text-primary transition-colors">{t('footer.features')}</Link></li>
                                <li><Link to="#" className="hover:text-primary transition-colors">{t('footer.security')}</Link></li>
                                <li><Link to="#" className="hover:text-primary transition-colors">{t('footer.docs')}</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-6 uppercase tracking-wider text-sm">
                                {t('footer.legal')}
                            </h4>
                            <ul className="space-y-4 text-sm text-stone-600 dark:text-stone-400 font-medium">
                                <li><Link to="#" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link></li>
                                <li><Link to="#" className="hover:text-primary transition-colors">{t('footer.terms')}</Link></li>
                                <li><Link to="#" className="hover:text-primary transition-colors">{t('footer.contact')}</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-stone-200 dark:border-border/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                        © {new Date().getFullYear()} {t('footer.rights')}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 font-medium bg-stone-200/50 dark:bg-stone-900/50 px-3 py-1.5 rounded-full">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Sistemas operativos"></div>
                        {t('footer.system')}
                    </div>
                </div>
            </div>
        </footer>
    );
}