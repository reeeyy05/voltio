import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './components/pages/LandingPage';
import SignInPage from './components/pages/SignInPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { SignUpPage } from './components/pages/SignUpPage';
import { useAuthStore } from './stores/authStore';
import { supabase } from './Supabase/Client';
import ProfilePage from './components/pages/ProfilePage';
import UsersManagementPage from './components/pages/UsersManagementPage';
import DashboardPage from './components/pages/DashboardPage';
import ObrasPage from './components/pages/ObrasPage';
import ObraDetailPage from './components/pages/ObraDetailPage';
import { Package } from 'lucide-react'; // NUEVO IMPORT PARA EL ICONO

// NUEVO: Componente temporal para el inventario
const InventarioPage = () => (
  <div className="p-6 max-w-6xl mx-auto space-y-6">
    <div className="flex items-center gap-3 mb-8">
      <Package className="h-8 w-8 text-primary" />
      <div>
        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Inventario y Materiales</h1>
        <p className="text-stone-600 dark:text-stone-400 mt-1">
          Próximamente: Control de stock y consumo de recursos.
        </p>
      </div>
    </div>
  </div>
);

export default function App() {
  const { checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkSession();
    });

    return () => subscription.unsubscribe();
  }, [checkSession]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/registro" element={<SignUpPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<Navigate to="/app/panel" replace />} />

            <Route path="panel" element={<DashboardPage />} />
            <Route path="perfil" element={<ProfilePage />} />

            <Route path="obras" element={<ObrasPage />} />
            <Route path="obras/:id" element={<ObraDetailPage />} />

            {/* NUEVA RUTA DE INVENTARIO */}
            <Route path="inventario" element={<InventarioPage />} />

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="usuarios" element={<UsersManagementPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}