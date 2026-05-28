import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useAdminStore } from "@/stores/adminStore";
import { useTareasStore } from "@/stores/tareasStore";
import { useObrasStore } from "@/stores/obraStore";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, HardHat, CheckCircle2, TrendingUp, Clock, ArrowRight, Loader2, ClipboardList } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
    const { perfil, rol } = useAuthStore();
    const { usuarios, fetchUsuarios } = useAdminStore();
    const { misTareas, todasLasTareas, isLoading: loadingTareas, fetchTareasDelEmpleado, fetchAllTareas } = useTareasStore();
    const { obras, fetchObras } = useObrasStore();
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        if (rol === 'admin') {
            fetchUsuarios();
            fetchAllTareas();
            fetchObras();
        } else if (rol === 'empleado' && perfil?.id) {
            fetchTareasDelEmpleado(perfil.id);
        }
    }, [rol, perfil?.id, fetchUsuarios, fetchTareasDelEmpleado, fetchAllTareas, fetchObras]);

    const datosGrafico = useMemo(() => {
        if (rol !== 'admin') return [];

        const operariosMap = new Map();

        const empleados = usuarios.filter(u => u.rol === 'empleado');
        empleados.forEach(emp => {
            operariosMap.set(emp.id, {
                nombre: emp.nombre,
                Pendiente: 0,
                Finalizada: 0
            });
        });

        todasLasTareas.forEach(tarea => {
            if (tarea.empleado_id && operariosMap.has(tarea.empleado_id)) {
                const operario = operariosMap.get(tarea.empleado_id);
                const estado = tarea.estado === 'Finalizada' ? 'Finalizada' : 'Pendiente';
                operario[estado] += 1;
            }
        });

        return Array.from(operariosMap.values());
    }, [todasLasTareas, usuarios, rol]);

    // CORRECCIÓN: Usar 'En curso' en lugar de 'Pendiente'
    const obrasActivas = obras.filter(o => o.estado === 'En curso').length;

    const completadas = misTareas.filter(t => t.estado === 'Finalizada').length;
    const pendientes = misTareas.filter(t => t.estado !== 'Finalizada').length;

    const obrasMap = new Map();
    misTareas.forEach(t => {
        if (t.obra_id && t.obras) {
            const estadoActual = t.estado;
            if (!obrasMap.has(t.obra_id)) {
                obrasMap.set(t.obra_id, {
                    id: t.obra_id, nombre: t.obras.nombre,
                    pendientes: estadoActual !== 'Finalizada' ? 1 : 0,
                    completadas: estadoActual === 'Finalizada' ? 1 : 0,
                    total: 1
                });
            } else {
                const obra = obrasMap.get(t.obra_id);
                obra.total += 1;
                if (estadoActual === 'Finalizada') obra.completadas += 1;
                else obra.pendientes += 1;
            }
        }
    });
    const misObras = Array.from(obrasMap.values());
    const obrasUnicas = misObras.length;

    if (rol === 'admin') {
        return (
            <div className="p-4 sm:p-6 space-y-8 max-w-7xl mx-auto">
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100">{t('dashboard.admin_title')}</h1>
                    <p className="text-sm sm:text-base text-stone-500 mt-1">{t('dashboard.admin_subtitle', { name: perfil?.nombre })}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{t('dashboard.registered_users')}</CardTitle>
                            <Users className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{usuarios.length}</div>
                            <p className="text-xs text-stone-500 mt-1">Total en la plataforma</p>
                        </CardContent>
                    </Card>

                    <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{t('dashboard.active_works')}</CardTitle>
                            <HardHat className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{obrasActivas}</div>
                            <p className="text-xs text-stone-500 mt-1">Proyectos en ejecución</p>
                        </CardContent>
                    </Card>

                    <Card className="border-stone-200 dark:border-stone-800 shadow-sm sm:col-span-2 md:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Volumen de Tareas</CardTitle>
                            <ClipboardList className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{todasLasTareas.length}</div>
                            <p className="text-xs text-stone-500 mt-1">Asignaciones totales registradas</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Carga de Trabajo por Operario</CardTitle>
                        <CardDescription>Visualiza el estado de las tareas asignadas a cada miembro del equipo.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[400px] w-full mt-4">
                        {loadingTareas ? (
                            <div className="flex justify-center h-full items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                        ) : datosGrafico.length === 0 ? (
                            <div className="flex justify-center h-full items-center text-stone-500 text-center px-4">No hay datos suficientes para graficar.</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={datosGrafico} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                    <XAxis dataKey="nombre" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1c1917', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                                    <Bar dataKey="Pendiente" stackId="a" fill="#f59e0b" radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="Finalizada" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <div className="bg-primary/10 p-3 rounded-2xl shrink-0">
                    <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100">{t('dashboard.emp_title', { name: perfil?.nombre })}</h1>
                    <p className="text-sm sm:text-base text-stone-500 mt-1">{t('dashboard.emp_subtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <Card className="bg-stone-900 text-white border-none shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle2 className="h-16 w-16" /></div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-stone-400 text-xs uppercase tracking-wider">{t('dashboard.completed_tasks')}</CardTitle>
                    </CardHeader>
                    <CardContent><div className="text-3xl sm:text-4xl font-bold">{loadingTareas ? '-' : completadas}</div></CardContent>
                </Card>

                <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs uppercase text-stone-500">{t('dashboard.pending_tasks')}</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100">{loadingTareas ? '-' : pendientes}</div></CardContent>
                </Card>

                <Card className="border-stone-200 dark:border-stone-800 shadow-sm sm:col-span-2 md:col-span-1">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs uppercase text-stone-500">{t('dashboard.assigned_works')}</CardTitle>
                        <HardHat className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent><div className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100">{loadingTareas ? '-' : obrasUnicas}</div></CardContent>
                </Card>
            </div>

            <div className="w-full flex justify-center mt-8">
                <div className="w-full max-w-4xl">
                    <Card className="border-stone-200 dark:border-stone-800 shadow-sm flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl"><HardHat className="h-5 w-5 text-primary" /> Tus Obras Activas</CardTitle>
                            <CardDescription>Proyectos en los que tienes tareas asignadas</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {loadingTareas ? (
                                <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                            ) : misObras.length === 0 ? (
                                <div className="text-center py-12 px-4 text-stone-500 bg-stone-50 dark:bg-stone-900/30 rounded-lg border border-dashed border-stone-200 dark:border-stone-800">
                                    <CheckCircle2 className="h-10 w-10 mx-auto text-green-500 mb-2 opacity-50" />
                                    <p>No tienes tareas en ninguna obra actualmente.</p>
                                    <p className="text-sm mt-1">¡Todo al día!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {misObras.map(obra => {
                                        const porcentaje = Math.round((obra.completadas / obra.total) * 100);
                                        return (
                                            <div key={obra.id} className="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-lg border border-stone-100 dark:border-stone-800 flex flex-col gap-4 hover:border-primary/40 transition-colors">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                    <div>
                                                        <h3 className="font-bold text-stone-900 dark:text-stone-100">{obra.nombre}</h3>
                                                        <p className="text-xs text-stone-500 mt-1">
                                                            {obra.pendientes === 0 ? '¡Todas las tareas completadas!' : `Tienes ${obra.pendientes} tareas pendientes de ${obra.total}`}
                                                        </p>
                                                    </div>
                                                    <Button variant="outline" size="sm" onClick={() => navigate(`/app/obras/${obra.id}`)} className="w-full sm:w-auto text-stone-700 dark:text-stone-300">
                                                        Entrar a la obra <ArrowRight className="ml-2 h-4 w-4 text-primary" />
                                                    </Button>
                                                </div>
                                                <div className="space-y-1.5 mt-2 sm:mt-0">
                                                    <div className="flex justify-between text-xs font-medium text-stone-500">
                                                        <span>Tu progreso personal</span><span>{porcentaje}%</span>
                                                    </div>
                                                    <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-2">
                                                        <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${porcentaje}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}