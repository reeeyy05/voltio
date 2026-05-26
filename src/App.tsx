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
import InventarioPage from './components/pages/InventarioPage';
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  const { checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, _session) => {
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

            <Route path="inventario" element={<InventarioPage />} />

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="usuarios" element={<UsersManagementPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="bottom-right"
        richColors
        closeButton
        expand={false}
        duration={4000}
        visibleToasts={3}
      />
    </BrowserRouter>
  );
}