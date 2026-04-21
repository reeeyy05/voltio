import { Link } from 'react-router-dom';
import { useTheme } from '../components/theme-provider';
import { Button } from '@/components/ui/button';
import { Moon, Sun, ChevronDown, Users, ClipboardCheck, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">

            {/* 1. CABECERA PÚBLICA (Fija arriba) */}
            <header className="h-24 border-b border-border flex items-center justify-between px-8 bg-card shrink-0 relative z-20">
                <Link to="/" className="flex items-center">
                    <img
                        src="/logo.png"
                        alt="Logo Voltio"
                        className="h-16 md:h-20 w-auto object-contain"
                    />
                </Link>

                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-stone-800 dark:text-stone-200"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        {theme === 'dark' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                    </Button>

                    <Button
                        variant="default"
                        size="lg"
                        className="bg-primary text-primary-foreground font-bold text-base px-6 py-6"
                        asChild
                    >
                        <Link to="/login">Iniciar sesión</Link>
                    </Button>
                </div>
            </header>

            {/* 2. PRIMER IMPACTO (Hero Section) */}
            <section className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ minHeight: 'calc(100vh - 6rem)' }}>

                {/* --- ELEMENTOS DE DISEÑO DE FONDO --- */}
                {/* Cuadrícula técnica en AMARILLO con opacidad controlada para ambos modos */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab308_1px,transparent_1px),linear-gradient(to_bottom,#eab308_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 dark:opacity-20"></div>

                {/* Resplandor corporativo difuminado */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10"></div>
                {/* ----------------------------------- */}

                <div className="relative max-w-4xl space-y-8 pb-20 z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
                        Gestión inteligente para <br className="hidden md:block" />
                        <span className="text-primary">obras eléctricas</span>
                    </h1>

                    <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto font-medium">
                        La plataforma centralizada para el control total de tus operarios, asignaciones y progreso en campo.
                    </p>
                </div>

                {/* Flecha animada indicando scroll */}
                <div className="absolute bottom-10 flex flex-col items-center animate-bounce text-stone-400 dark:text-stone-500 z-10">
                    <span className="text-sm font-semibold tracking-widest uppercase mb-2">Descubre más</span>
                    <ChevronDown className="h-8 w-8" />
                </div>
            </section>

            {/* 3. SECCIÓN DE TARJETAS (Debajo del scroll) */}
            <section className="py-24 px-6 md:px-12 bg-stone-50 dark:bg-stone-950 border-t border-border relative z-10">
                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">
                            Todo el control en un solo lugar
                        </h2>
                        <p className="mt-4 text-xl text-stone-600 dark:text-stone-400">
                            Diseñado específicamente para optimizar el rendimiento de tus equipos de campo.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3">
                                Control de Asignaciones
                            </h3>
                            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                                Gestiona y asigna operarios a obras específicas según su disponibilidad, manteniendo tu plantilla organizada al milímetro.
                            </p>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <ClipboardCheck className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3">
                                Supervisión de Tareas
                            </h3>
                            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                                Realiza un seguimiento del estado y progreso de cada intervención en tiempo real, desde el inicio hasta la finalización.
                            </p>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3">
                                Panel Seguro
                            </h3>
                            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                                Accede a toda la información operativa desde una interfaz centralizada, con roles de seguridad estrictos y protección de datos.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* FOOTER SIMPLE */}
            <footer className="py-8 text-center text-stone-500 dark:text-stone-400 border-t border-border bg-card relative z-10">
                <p className="text-sm">© 2026 Voltio. Todos los derechos reservados.</p>
            </footer>

        </div>
    );
}