import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Users, ClipboardCheck, ShieldCheck } from 'lucide-react';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import { useAuthStore } from '@/stores/authStore';

function FadeInSection({ children }: { children: ReactNode }) {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => setVisible(entry.isIntersecting));
            },
            { threshold: 0.15 }
        );

        const currentElement = domRef.current;
        if (currentElement) observer.observe(currentElement);

        return () => {
            if (currentElement) observer.unobserve(currentElement);
        };
    }, []);

    return (
        <div
            ref={domRef}
            className={`transition-all duration-1000 ease-out transform ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-24'
                }`}
        >
            {children}
        </div>
    );
}

export default function LandingPage() {
    const { t } = useTranslation();

    // FIX: Sacamos isInitialized en lugar de isLoading
    const { perfil, rol, logout, isInitialized } = useAuthStore();
    const nombreCompleto = perfil ? `${perfil.nombre} ${perfil.apellidos || ''}`.trim() : undefined;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">

            <Header
                userName={nombreCompleto}
                role={rol || undefined}
                avatarUrl={perfil?.avatar}
                onLogout={logout}
                showLogo={true}
                showSidebarTrigger={false}
                isLoading={!isInitialized} // FIX: Mostramos estado de carga hasta estar inicializados
            />

            <section className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ minHeight: 'calc(100vh - 5rem)' }}>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab308_1px,transparent_1px),linear-gradient(to_bottom,#eab308_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 dark:opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10"></div>

                <div className="relative max-w-4xl space-y-8 pb-20 z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
                        {t('hero.title_pt1')} <br className="hidden md:block" />
                        <span className="text-primary">{t('hero.title_highlight')}</span>
                    </h1>

                    <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto font-medium">
                        {t('hero.subtitle')}
                    </p>
                </div>

                <div className="absolute bottom-10 flex flex-col items-center animate-bounce text-stone-400 dark:text-stone-500 z-10">
                    <span className="text-sm font-semibold tracking-widest uppercase mb-2">{t('hero.scroll_more')}</span>
                    <ChevronDown className="h-8 w-8" />
                </div>
            </section>

            <section className="py-24 px-6 md:px-12 bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-border relative z-10 overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <FadeInSection>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">
                                {t('features.title')}
                            </h2>
                            <p className="mt-4 text-xl text-stone-600 dark:text-stone-400">
                                {t('features.subtitle')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-card border border-stone-200 dark:border-border rounded-xl p-8 shadow-md hover:shadow-lg dark:shadow-sm dark:hover:shadow-md transition-shadow">
                                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3">
                                    {t('features.card1_title')}
                                </h3>
                                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                                    {t('features.card1_desc')}
                                </p>
                            </div>

                            <div className="bg-card border border-stone-200 dark:border-border rounded-xl p-8 shadow-md hover:shadow-lg dark:shadow-sm dark:hover:shadow-md transition-shadow">
                                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                    <ClipboardCheck className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3">
                                    {t('features.card2_title')}
                                </h3>
                                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                                    {t('features.card2_desc')}
                                </p>
                            </div>

                            <div className="bg-card border border-stone-200 dark:border-border rounded-xl p-8 shadow-md hover:shadow-lg dark:shadow-sm dark:hover:shadow-md transition-shadow">
                                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                    <ShieldCheck className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3">
                                    {t('features.card3_title')}
                                </h3>
                                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                                    {t('features.card3_desc')}
                                </p>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            <Footer />
        </div>
    );
}