import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './components/pages/LandingPage';
import { LayoutDashboard } from 'lucide-react';
import SignInPage from './components/pages/SignInPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { SignUpPage } from './components/pages/SignUpPage';
import { useAuthStore } from './stores/authStore';
import { supabase } from './Supabase/Client';
import ProfilePage from './components/pages/ProfilePage';
import UsersManagementPage from './components/pages/UsersManagementPage';

const DashboardPage = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-3">
      <LayoutDashboard className="h-8 w-8 text-primary" />
      Panel Principal
    </h1>
    <p className="text-stone-600 dark:text-stone-300">
      Aquí la información de obras y tareas de la empresa.
    </p>
  </div>
);

export default function App() {
  const { checkSession } = useAuthStore();

  useEffect(() => {
    // Supabase lanza un evento INITIAL_SESSION al cargar, así que con el listener nos basta
    // para no duplicar peticiones a la base de datos (evitamos race conditions).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkSession();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkSession]);

  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/registro" element={<SignUpPage />} />

        {/* RUTAS PRIVADAS (Cualquier usuario logueado) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<MainLayout />}>
            <Route path="panel" element={<DashboardPage />} />
            <Route path="perfil" element={<ProfilePage />} />

            {/* RUTAS DE ADMINISTRADOR (Solo rol: admin) */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="usuarios" element={<UsersManagementPage />} />
            </Route>

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}