import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, type RolUsuario } from '../../stores/authStore';

// Definimos qué cargos pueden entrar a esta pantalla
interface ProtectedRouteProps {
    allowedRoles?: RolUsuario[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { session, rol, isLoading } = useAuthStore();

    // 1. Mostramos una pantalla de espera mientras buscamos los datos del usuario
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <div className="text-lg font-semibold text-slate-600 animate-pulse">
                    Abriendo Voltio...
                </div>
            </div>
        );
    }

    // 2. Si el visitante no tiene la llave (no ha iniciado sesión), lo mandamos a la portada
    if (!session) {
        return <Navigate to="/" replace />;
    }

    // 3. Si esta sección exige un cargo especial y el usuario no lo tiene, lo mandamos a su panel
    if (allowedRoles && rol && !allowedRoles.includes(rol)) {
        return <Navigate to="/app/panel" replace />;
    }

    // 4. Si todo está correcto, le dejamos entrar y mostramos la pantalla que pidió
    return <Outlet />;
}