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

// NUEVO: Importamos el Dashboard profesional que acabamos de crear
import DashboardPage from './components/pages/DashboardPage';
import { HardHat } from 'lucide-react';

// Componente temporal para la página de Obras
const ObrasPage = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-3">
      <HardHat className="h-8 w-8 text-primary" />
      Gestión de Obras
    </h1>
    <p className="text-stone-600 dark:text-stone-300">
      Aquí verás el listado de proyectos.
    </p>
  </div>
);

export default function App() {
  const { checkSession } = useAuthStore();

  useEffect(() => {
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
            {/* Redirigir /app a /app/panel por defecto */}
            <Route index element={<Navigate to="/app/panel" replace />} />

            <Route path="panel" element={<DashboardPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="obras" element={<ObrasPage />} />

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="usuarios" element={<UsersManagementPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}