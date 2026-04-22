import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './components/pages/LandingPage';
import { LayoutDashboard } from 'lucide-react';
import SignInPage from './components/forms/SignInPage';

// Pantalla temporal del panel interno
const DashboardPage = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-3">
      <LayoutDashboard className="h-8 w-8 text-primary" />
      Panel Principal
    </h1>
    <p className="text-stone-600 dark:text-stone-300">
      Aquí irá la información de obras y tareas de la empresa.
    </p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA: La Landing Page (Pantalla completa, sin sidebar) */}
        <Route path="/" element={<LandingPage />} />

        {/* RUTA DE AUTENTICACIÓN: Pantalla de Login (Pantalla completa) */}
        <Route path="/login" element={<SignInPage />} />

        {/* RUTAS PRIVADAS: El entorno de trabajo (Con sidebar y cabecera interna) */}
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}