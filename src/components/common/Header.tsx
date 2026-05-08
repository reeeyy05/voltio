import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LogOut, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTheme } from '../theme-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
    userName?: string;
    role?: string;
    avatarUrl?: string | null;
    onLogout?: () => void;
    showSidebarTrigger?: boolean;
    showLogo?: boolean; // Controla si se ve el logo (true en Landing, false en App)
}

export const Header: React.FC<HeaderProps> = ({
    userName, role, avatarUrl, onLogout, showSidebarTrigger, showLogo = true
}) => {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();

    return (
        <header className="bg-stone-100 dark:bg-card border-b border-stone-200 dark:border-border sticky top-0 z-40 w-full">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                <div className="flex items-center gap-4">
                    {/* Botón de hamburguesa */}
                    {showSidebarTrigger && <SidebarTrigger className="h-9 w-9" />}

                    {/* El logo solo se muestra si showLogo es true */}
                    {showLogo && (
                        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                            <img src="/logo.png" alt="Logo Voltio" className="h-10 w-auto object-contain drop-shadow-sm" />
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                    <div className="flex items-center gap-1">
                        <LanguageSwitcher />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="text-stone-600 dark:text-stone-300"
                            title="Cambiar tema"
                        >
                            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </Button>
                    </div>

                    {userName ? (
                        <div className="flex items-center gap-3 pl-4 border-l border-stone-300 dark:border-stone-800">
                            <div className="hidden md:flex flex-col text-right">
                                <span className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-tight">{userName}</span>
                                <span className="text-xs text-stone-500 capitalize">{role || ''}</span>
                            </div>
                            <Avatar className="h-9 w-9 border border-stone-200 dark:border-stone-700">
                                <AvatarImage src={avatarUrl || ''} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold uppercase">
                                    {userName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onLogout}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                title={t('common.logout')}
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild className="hidden sm:flex text-stone-600 dark:text-stone-300">
                                <Link to="/login">Iniciar Sesión</Link>
                            </Button>
                            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm">
                                <Link to="/registro">Registrarse</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};