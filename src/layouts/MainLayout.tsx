import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useTheme } from '../components/theme-provider';
import { MainSidebar } from './MainSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export default function MainLayout() {
    const { theme, setTheme } = useTheme();
    const { session, perfil } = useAuthStore();

    return (
        // Hacemos el menu lateral un poco mas estrecho
        <SidebarProvider style={{ "--sidebar-width": "14rem" } as React.CSSProperties}>
            <MainSidebar />

            <div className="flex flex-col h-screen w-full bg-background text-foreground">

                {/* CABECERA: Altura aumentada a h-24 (96px) para un logo gigante */}
                <header className="h-24 border-b border-border flex items-center justify-between px-6 shrink-0 bg-card">

                    {/* Lado Izquierdo: Boton del menu y Logo */}
                    <div className="flex items-center gap-4">
                        <SidebarTrigger />

                        <Link to="/" className="flex items-center">
                            {/* Logo mas grande: h-16 en movil, h-20 en PC */}
                            <img
                                src="/logo.png"
                                alt="Logo Voltio"
                                className="h-16 md:h-20 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Lado Derecho: Cambio de tema y Datos del usuario */}
                    <div className="flex items-center gap-3 md:gap-6">

                        {/* Boton de Tema mas grande (h-6 w-6) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-stone-800 dark:text-stone-200"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            {theme === 'dark' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                        </Button>

                        {/* Verificamos si la persona ha iniciado sesion */}
                        {session ? (
                            // SI ESTA DENTRO: Perfil del usuario adaptado al nuevo tamaño
                            <div className="flex items-center gap-3">
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
                            </div>
                        ) : (
                            // SI NO ESTA DENTRO: Solo boton de Login, en tamaño grande
                            <div className="flex items-center">
                                <Button
                                    variant="default"
                                    size="lg"
                                    className="bg-primary text-primary-foreground font-bold text-base px-6 py-6"
                                    asChild
                                >
                                    <Link to="/login">Iniciar sesion</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </header>

                {/* AREA CENTRAL: Aqui React dibuja la pantalla actual */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    );
}