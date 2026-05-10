import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { MainSidebar } from './MainSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '../components/common/Header';
// NUEVO: Importamos el TooltipProvider que nos pide el error
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
        // NUEVO: Envolvemos TODO el layout en el TooltipProvider
        <TooltipProvider>
            <SidebarProvider style={{ "--sidebar-width": "15rem" } as React.CSSProperties}>
                <MainSidebar />

                <div className="flex flex-1 flex-col min-h-screen bg-stone-50/30 dark:bg-background overflow-hidden w-full">
                    {/* HEADER PARA LA APP */}
                    <Header
                        userName={nombreCompleto}
                        role={rol || undefined}
                        avatarUrl={perfil?.avatar}
                        onLogout={handleLogout}
                        showSidebarTrigger={true}
                        showLogo={false}
                    />

                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </main>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    );
}