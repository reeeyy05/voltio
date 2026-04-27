import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { useTheme } from '../components/theme-provider';
import { MainSidebar } from './MainSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Globe, LogOut } from 'lucide-react';

export default function MainLayout() {
    const { theme, setTheme } = useTheme();
    // Extraemos la función logout del store
    const { session, perfil, logout } = useAuthStore();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    // Función para alternar el idioma
    const toggleLanguage = () => {
        const newLang = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(newLang);
    };

    // Función para cerrar sesión y volver a la pantalla de inicio
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        // Hacemos el menu lateral un poco mas estrecho[cite: 9]
        <SidebarProvider style={{ "--sidebar-width": "14rem" } as React.CSSProperties}>
            <MainSidebar />

            <div className="flex flex-col h-screen w-full bg-background text-foreground">

                {/* CABECERA: Altura aumentada a h-24 (96px) para un logo gigante[cite: 9] */}
                <header className="h-24 border-b border-border flex items-center justify-between px-6 shrink-0 bg-card">

                    {/* Lado Izquierdo: Boton del menu y Logo[cite: 9] */}
                    <div className="flex items-center gap-4">
                        <SidebarTrigger />

                        <Link to="/" className="flex items-center">
                            {/* Logo mas grande: h-16 en movil, h-20 en PC[cite: 9] */}
                            <img
                                src="/logo.png"
                                alt="Logo Voltio"
                                className="h-16 md:h-20 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Lado Derecho: Controles y Datos del usuario */}
                    <div className="flex items-center gap-3 md:gap-6">

                        {/* Controles: Idioma y Tema (Siempre visibles) */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                                onClick={toggleLanguage}
                                title="Cambiar idioma"
                            >
                                <Globe className="h-6 w-6" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                title="Cambiar tema"
                            >
                                {theme === 'dark' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                            </Button>
                        </div>

                        {/* Verificamos si la persona ha iniciado sesion[cite: 9] */}
                        {session ? (
                            // SI ESTA DENTRO: Perfil del usuario y botón de Logout[cite: 9]
                            <div className="flex items-center gap-3 pl-2 border-l border-border">
                                <div className="hidden md:flex flex-col text-right text-sm">
                                    <span className="font-bold text-stone-800 dark:text-stone-100">{perfil?.nombre}</span>
                                    <span className="text-stone-500 dark:text-stone-300 capitalize">{perfil?.rol}</span>
                                </div>
                                <Avatar className="h-12 w-12 border border-border">
                                    <AvatarImage src={perfil?.avatar || ''} />
                                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                                        {perfil?.nombre?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                {/* NUEVO: Botón de Cerrar Sesión */}
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={handleLogout}
                                    className="ml-2 h-10 w-10"
                                    title="Cerrar sesión"
                                >
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        ) : (
                            // SI NO ESTA DENTRO: Solo boton de Login[cite: 9]
                            <div className="flex items-center">
                                <Button
                                    variant="default"
                                    size="lg"
                                    className="bg-primary text-primary-foreground font-bold text-base px-6 py-6"
                                    asChild
                                >
                                    <Link to="/login">{t('header.login')}</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </header>

                {/* AREA CENTRAL: Aqui React dibuja la pantalla actual[cite: 9] */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    );
}