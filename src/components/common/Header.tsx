import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../theme-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Moon, Sun, Globe, LogOut } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface HeaderProps {
    showSidebarTrigger?: boolean;
}

export function Header({ showSidebarTrigger = false }: HeaderProps) {
    const { theme, setTheme } = useTheme();
    const { session, perfil, logout } = useAuthStore();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const isLoginPage = location.pathname === '/login';
    const isRegisterPage = location.pathname === '/registro';

    const toggleLanguage = () => {
        const newLang = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(newLang);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <header className="h-20 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-4 md:px-6 bg-card shrink-0 relative z-20">
            <div className="flex items-center gap-4">
                {showSidebarTrigger && <SidebarTrigger />}

                <Link to="/" className="flex items-center">
                    <img
                        src="/logo.png"
                        alt="Logo Voltio"
                        className="h-10 md:h-12 w-auto object-contain"
                    />
                </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {/* 1. BOTÓN DE IDIOMA (SIEMPRE VISIBLE) */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleLanguage}
                    title="Cambiar idioma"
                    className="text-stone-600 dark:text-stone-300"
                >
                    <Globe className="h-5 w-5" />
                </Button>

                {/* 2. BOTÓN DE TEMA (SIEMPRE VISIBLE) */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    title="Cambiar tema"
                    className="text-stone-600 dark:text-stone-300"
                >
                    {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>

                {/* DIVISOR VISUAL */}
                <div className="w-px h-6 bg-stone-200 dark:bg-stone-700 mx-1 hidden sm:block"></div>

                {session ? (
                    /* 3. ZONA DE USUARIO LOGUEADO */
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex flex-col text-right text-sm">
                            <span className="font-bold text-stone-800 dark:text-stone-100">{perfil?.nombre || 'Usuario'}</span>
                            <span className="text-stone-500 dark:text-stone-400 capitalize text-xs">{perfil?.rol || 'Rol'}</span>
                        </div>

                        <Avatar className="h-10 w-10 border border-stone-200 dark:border-stone-700">
                            <AvatarImage src={perfil?.avatar || ''} />
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                {perfil?.nombre?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>

                        {/* 4. BOTÓN DE CERRAR SESIÓN (SOLO LOGUEADOS) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            title="Cerrar sesión"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 ml-1"
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                ) : (
                    /* 5. ZONA DE VISITANTES (NO LOGUEADOS) */
                    <div className="flex items-center gap-2">
                        {/* Se oculta el botón de login si ya estás en la página de login */}
                        {!isLoginPage && (
                            <Button variant="ghost" asChild className="font-bold">
                                <Link to="/login">{t('header.login') || 'Iniciar Sesión'}</Link>
                            </Button>
                        )}
                        {/* Se oculta el botón de registro si ya estás en la página de registro */}
                        {!isRegisterPage && (
                            <Button variant="default" asChild className="bg-primary text-primary-foreground font-bold">
                                <Link to="/registro">Registrarse</Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}