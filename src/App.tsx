import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

const LandingPage = () => <div className="p-20 text-center text-3xl font-bold text-slate-800">🏠 Bienvenido a Voltio (Página Pública)</div>;
const DashboardPage = () => <h1 className="text-2xl font-bold text-slate-800">📊 Resumen del Panel</h1>;
const WorksPage = () => <h1 className="text-2xl font-bold text-slate-800">🚧 Listado de Obras Eléctricas</h1>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Si entran a la dirección principal ("/"), les enseñamos la portada libre */}
        <Route path="/" element={<LandingPage />} />

        {/* --- EL INTERIOR DE LA EMPRESA (Privado) --- */}
        <Route path="/app" element={<MainLayout />}>
          <Route path="panel" element={<DashboardPage />} />
          <Route path="obras" element={<WorksPage />} />
        </Route>

        {/* Si alguien escribe una ruta inventada (ej: /patata), lo mandamos de vuelta al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}