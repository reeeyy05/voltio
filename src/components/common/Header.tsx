import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../theme-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Moon, Sun, Globe } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface HeaderProps {
    showSidebarTrigger?: boolean;
}

export function Header({ showSidebarTrigger = false }: HeaderProps) {
    const { theme, setTheme } = useTheme();
    const { session, perfil } = useAuthStore();
    const { t, i18n } = useTranslation();
    const location = useLocation();

    // Comprobamos si la ruta actual es la de login
    const isLoginPage = location.pathname === '/login';

    const toggleLanguage = () => {
        const newLang = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(newLang);
    };

    return (
        <header className="h-24 border-b border-stone-200 dark:border-border flex items-center justify-between px-6 md:px-8 bg-card shrink-0 relative z-20">
            <div className="flex items-center gap-4">
                {showSidebarTrigger && <SidebarTrigger />}

                <Link to="/" className="flex items-center">
                    <img
                        src="/logo.png"
                        alt="Logo Voltio"
                        className="h-16 md:h-20 w-auto object-contain"
                    />
                </Link>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                        onClick={toggleLanguage}
                    >
                        <Globe className="h-7 w-7" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        {theme === 'dark' ? <Moon className="h-7 w-7" /> : <Sun className="h-7 w-7" />}
                    </Button>
                </div>

                {session ? (
                    <div className="flex items-center gap-3 pl-2">
                        <div className="hidden md:flex flex-col text-right text-sm">
                            <span className="font-bold text-stone-800 dark:text-stone-100">{perfil?.nombre}</span>
                            <span className="text-stone-500 dark:text-stone-300 capitalize">{perfil?.rol}</span>
                        </div>
                        <Avatar className="h-12 w-12 border border-stone-200 dark:border-border shadow-sm">
                            <AvatarImage src={perfil?.avatar || ''} />
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                                {perfil?.nombre?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                ) : (
                    // Renderizamos el botón solo si NO estamos en la página de login
                    !isLoginPage && (
                        <Button
                            variant="default"
                            size="lg"
                            className="bg-primary text-primary-foreground font-bold text-base px-6 py-6 shadow-md hover:shadow-lg dark:shadow-none transition-shadow ml-2"
                            asChild
                        >
                            <Link to="/login">{t('header.login')}</Link>
                        </Button>
                    )
                )}
            </div>
        </header>
    );
}