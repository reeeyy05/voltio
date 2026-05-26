import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { MainSidebar } from './MainSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function MainLayout() {
    const { perfil, rol, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const nombreCompleto = perfil ? `${perfil.nombre} ${perfil.apellidos || ''}`.trim() : undefined;

    return (
        <TooltipProvider>
            <SidebarProvider style={{ "--sidebar-width": "15rem" } as React.CSSProperties}>
                <MainSidebar />

                {/* Contenedor estricto a 100vh (h-screen) sin desbordamientos ocultos */}
                <div className="flex flex-1 flex-col h-screen bg-stone-50/30 dark:bg-background overflow-hidden w-full">

                    <Header
                        userName={nombreCompleto}
                        role={rol || undefined}
                        avatarUrl={perfil?.avatar}
                        onLogout={handleLogout}
                        showSidebarTrigger={true}
                        showLogo={false}
                    />

                    {/* Área con scroll interno que contiene las vistas y el footer */}
                    <main className="flex-1 overflow-y-auto flex flex-col w-full">

                        <div className="p-4 sm:p-8 lg:p-12 pb-20 sm:pb-32 flex-1">
                            <Outlet />
                        </div>

                        <div className="shrink-0 w-full mt-auto pt-12">
                            <Footer />
                        </div>

                    </main>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    );
}