import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useAdminStore } from "@/stores/adminStore";
import { useTareasStore } from "@/stores/tareasStore";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, HardHat, CheckCircle2, TrendingUp, Clock, Zap, ArrowRight, Loader2, PlayCircle } from "lucide-react";

export default function DashboardPage() {
    const { perfil, rol } = useAuthStore();
    const { usuarios, fetchUsuarios } = useAdminStore();
    const { misTareas, isLoading, fetchTareasDelEmpleado, updateEstadoTarea } = useTareasStore();
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Cargar datos según el rol del usuario
    useEffect(() => {
        if (rol === 'admin') {
            fetchUsuarios();
        } else if (rol === 'empleado' && perfil?.id) {
            fetchTareasDelEmpleado(perfil.id);
        }
    }, [rol, perfil?.id, fetchUsuarios, fetchTareasDelEmpleado]);

    // Calcular métricas del empleado
    const completadas = misTareas.filter(t => t.estado === 'Finalizada').length;
    const pendientes = misTareas.filter(t => t.estado !== 'Finalizada').length;
    // Extraer IDs únicos de las obras para saber en cuántas participa
    const obrasUnicas = new Set(misTareas.map(t => t.obra_id)).size;

    // Manejador para cambiar estado rápido de una tarea
    const handleSiguienteEstado = async (id: string, estadoActual: string) => {
        let nuevoEstado: 'Pendiente' | 'En curso' | 'Finalizada' = 'En curso';
        if (estadoActual === 'En curso') nuevoEstado = 'Finalizada';

        try {
            await updateEstadoTarea(id, nuevoEstado);
            toast.success(`Tarea movida a: ${nuevoEstado}`);
        } catch (error) {
            toast.error("Error al actualizar la tarea");
        }
    };

    // PANEL DE ADMINISTRADOR 
    if (rol === 'admin') {
        return (
            <div className="p-6 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{t('dashboard.admin_title')}</h1>
                    <p className="text-stone-500 mt-1">{t('dashboard.admin_subtitle', { name: perfil?.nombre })}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{t('dashboard.registered_users')}</CardTitle>
                            <Users className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{usuarios.length}</div>
                            <p className="text-xs text-stone-500 mt-1">{t('dashboard.users_trend')}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{t('dashboard.active_works')}</CardTitle>
                            <HardHat className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-stone-500 mt-1">{t('dashboard.works_trend')}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{t('dashboard.system_load')}</CardTitle>
                            <Zap className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">98%</div>
                            <p className="text-xs text-stone-500 mt-1">{t('dashboard.load_trend')}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-stone-200 dark:border-stone-800">
                    <CardHeader>
                        <CardTitle>{t('dashboard.activity_title')}</CardTitle>
                        <CardDescription>{t('dashboard.activity_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-end gap-2 px-6">
                        {[40, 70, 55, 90, 65, 80, 45].map((height, i) => (
                            <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm" style={{ height: `${height}%` }}></div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    // PANEL DE EMPLEADO
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl">
                    <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{t('dashboard.emp_title', { name: perfil?.nombre })}</h1>
                    <p className="text-stone-500 mt-1">{t('dashboard.emp_subtitle')}</p>
                </div>
            </div>

            {/* TARJETAS DE MÉTRICAS REALES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-stone-900 text-white border-none shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CheckCircle2 className="h-16 w-16" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-stone-400 text-xs uppercase tracking-wider">{t('dashboard.completed_tasks')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{isLoading ? '-' : completadas}</div>
                    </CardContent>
                </Card>

                <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs uppercase text-stone-500">{t('dashboard.pending_tasks')}</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-stone-800 dark:text-stone-100">{isLoading ? '-' : pendientes}</div>
                    </CardContent>
                </Card>

                <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs uppercase text-stone-500">{t('dashboard.assigned_works')}</CardTitle>
                        <HardHat className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-stone-800 dark:text-stone-100">{isLoading ? '-' : obrasUnicas}</div>
                    </CardContent>
                </Card>
            </div>

            {/* LISTA DE TAREAS DEL EMPLEADO */}
            <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Tus tareas activas
                    </CardTitle>
                    <CardDescription>
                        Revisa y actualiza el progreso de tus asignaciones
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : pendientes === 0 ? (
                        <div className="text-center py-12 text-stone-500 bg-stone-50 dark:bg-stone-900/30 rounded-lg border border-dashed border-stone-200 dark:border-stone-800">
                            <CheckCircle2 className="h-10 w-10 mx-auto text-green-500 mb-2 opacity-50" />
                            <p>No tienes tareas pendientes en este momento.</p>
                            <p className="text-sm mt-1">¡Buen trabajo!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {misTareas.filter(t => t.estado !== 'Finalizada').map(tarea => (
                                <div key={tarea.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-stone-50 dark:bg-stone-900/50 rounded-lg border border-stone-100 dark:border-stone-800 gap-4 transition-colors hover:bg-stone-100 dark:hover:bg-stone-900">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">{tarea.descripcion}</h3>
                                            <Badge variant={tarea.estado === 'En curso' ? 'default' : 'secondary'} className={tarea.estado === 'En curso' ? 'bg-amber-500' : ''}>
                                                {tarea.estado}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-stone-500 flex items-center gap-1">
                                            <HardHat className="h-3 w-3" />
                                            {tarea.obras?.nombre || 'Obra desconocida'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button
                                            variant={tarea.estado === 'Pendiente' ? 'default' : 'secondary'}
                                            onClick={() => handleSiguienteEstado(tarea.id, tarea.estado)}
                                            className={tarea.estado === 'En curso' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                                        >
                                            {tarea.estado === 'Pendiente' ? (
                                                <><PlayCircle className="mr-2 h-4 w-4" /> Iniciar</>
                                            ) : (
                                                <><CheckCircle2 className="mr-2 h-4 w-4" /> Finalizar</>
                                            )}
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => navigate(`/app/obras/${tarea.obra_id}`)}>
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}