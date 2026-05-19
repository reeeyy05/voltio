import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, type RolUsuario } from '../../stores/authStore';

interface ProtectedRouteProps {
    allowedRoles?: RolUsuario[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { session, rol, isInitialized } = useAuthStore();

    // FIX: Ahora esperamos a que Supabase termine de inicializar, no miramos isLoading
    if (!isInitialized) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-stone-50 dark:bg-background">
                <div className="text-lg font-semibold text-stone-600 dark:text-stone-400 animate-pulse">
                    Abriendo Voltio...
                </div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && rol && !allowedRoles.includes(rol)) {
        return <Navigate to="/app/panel" replace />;
    }

    return <Outlet />;
}