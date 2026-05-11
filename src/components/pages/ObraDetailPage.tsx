import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/Supabase/Client';
import { useTareasStore } from '@/stores/tareasStore';
import { useAuthStore } from '@/stores/authStore';
import { useAdminStore } from '@/stores/adminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle2, Circle, HardHat, Loader2, Plus, Trash2, User, MapPin, Star } from 'lucide-react';
import type { Obra } from '@/stores/obraStore';
import { Card, CardContent } from '../ui/card';

export default function ObraDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { perfil } = useAuthStore();
    const { t } = useTranslation();

    const { tareas, isLoading: tareasLoading, fetchTareasPorObra, createTarea, updateEstadoTarea, deleteTarea } = useTareasStore();
    const { usuarios, fetchUsuarios } = useAdminStore();

    const [obra, setObra] = useState<Obra | null>(null);
    const [isLoadingObra, setIsLoadingObra] = useState(true);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [nuevaTarea, setNuevaTarea] = useState({ titulo: '', descripcion: '', asignado_a: '' });

    useEffect(() => {
        if (!id) return;

        const fetchObra = async () => {
            const { data } = await supabase.from('obras').select('*').eq('id', id).single();
            if (data) setObra(data as Obra);
            setIsLoadingObra(false);
        };

        fetchObra();
        fetchTareasPorObra(id);
        fetchUsuarios();
    }, [id, fetchTareasPorObra, fetchUsuarios]);

    const handleCreateTarea = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validación manual ya que quitamos los 'required'
        if (!id || !nuevaTarea.titulo.trim() || !nuevaTarea.asignado_a) return;

        await createTarea({
            obra_id: id,
            titulo: nuevaTarea.titulo,
            descripcion: nuevaTarea.descripcion || null,
            estado: 'Pendiente',
            asignado_a: nuevaTarea.asignado_a
        });

        setIsCreateOpen(false);
        setNuevaTarea({ titulo: '', descripcion: '', asignado_a: '' });
    };

    if (isLoadingObra) return <div className="p-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (!obra) return <div className="p-20 text-center text-red-500">{t('obra_detail.not_found')}</div>;

    const tareasOrdenadas = [...tareas].sort((a, b) => {
        const aEsMia = a.asignado_a === perfil?.id;
        const bEsMia = b.asignado_a === perfil?.id;
        if (aEsMia && !bEsMia) return -1;
        if (!aEsMia && bEsMia) return 1;
        return 0;
    });

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate('/app/obras')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100">{obra.nombre}</h1>
                            <Badge variant={obra.estado === 'En curso' ? 'secondary' : 'default'}>
                                {obra.estado === 'En curso' ? t('obras.status_in_progress') : t('obras.status_completed')}
                            </Badge>
                        </div>
                        {obra.descripcion ? (
                            <p className="text-stone-500 flex items-center gap-2 mt-1 text-sm">
                                <MapPin className="h-4 w-4" /> {obra.descripcion}
                            </p>
                        ) : (
                            <p className="text-stone-500 flex items-center gap-2 mt-1 text-sm">
                                <HardHat className="h-4 w-4" /> {t('obra_detail.active_project')}
                            </p>
                        )}
                    </div>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">{t('obra_detail.add_task')}</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('obra_detail.assign_task')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateTarea} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>{t('obra_detail.task_title')}</Label>
                                {/* SIN ATRIBUTO REQUIRED */}
                                <Input value={nuevaTarea.titulo} onChange={e => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })} placeholder={t('obra_detail.task_title_ph')} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('obra_detail.task_details')}</Label>
                                <Textarea value={nuevaTarea.descripcion} onChange={e => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('obra_detail.task_assignee')}</Label>
                                {/* SIN ATRIBUTO REQUIRED */}
                                <Select onValueChange={(v) => setNuevaTarea({ ...nuevaTarea, asignado_a: v })}>
                                    <SelectTrigger><SelectValue placeholder={t('obra_detail.task_assignee_ph')} /></SelectTrigger>
                                    <SelectContent>
                                        {usuarios.map(u => <SelectItem key={u.id} value={u.id}>{u.nombre} {u.apellidos}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full">{t('obra_detail.create_task')}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <h2 className="text-xl font-bold border-b pb-2 mb-4">{t('obra_detail.tasks_list_title')}</h2>

            {tareasLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : tareasOrdenadas.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-dashed">
                    <p className="text-stone-500">{t('obra_detail.no_tasks')}</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {tareasOrdenadas.map(tarea => {
                        const esMiTarea = tarea.asignado_a === perfil?.id;

                        const cardClasses = `transition-colors border-stone-200 dark:border-stone-800 ${tarea.estado === 'Completada' ? 'bg-stone-50/50 dark:bg-stone-900/30 opacity-75' : ''} ${esMiTarea && tarea.estado !== 'Completada' ? 'border-primary/50 shadow-sm ring-1 ring-primary/20' : ''}`;

                        return (
                            <Card key={tarea.id} className={cardClasses}>
                                <CardContent className="p-4 flex items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        <button
                                            onClick={() => updateEstadoTarea(tarea.id, tarea.estado === 'Pendiente' ? 'Completada' : 'Pendiente')}
                                            className="mt-1 flex-shrink-0 hover:scale-110 transition-transform"
                                            title={t('obra_detail.mark_task')}
                                        >
                                            {tarea.estado === 'Completada'
                                                ? <CheckCircle2 className="h-6 w-6 text-green-500" />
                                                : <Circle className={`h-6 w-6 ${esMiTarea ? 'text-primary' : 'text-stone-300'}`} />
                                            }
                                        </button>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className={`font-semibold ${tarea.estado === 'Completada' ? 'line-through text-stone-500' : 'text-stone-800 dark:text-stone-100'}`}>
                                                    {tarea.titulo}
                                                </h3>
                                                {esMiTarea && (
                                                    <Badge variant="default" className="text-[10px] h-5 py-0 px-1.5 bg-primary">
                                                        <Star className="h-3 w-3 mr-1 fill-current" /> {t('obra_detail.your_task')}
                                                    </Badge>
                                                )}
                                            </div>
                                            {tarea.descripcion && <p className="text-sm text-stone-500 mt-1">{tarea.descripcion}</p>}
                                            <Badge variant="outline" className={`text-xs mt-2 ${esMiTarea ? 'bg-primary/5 border-primary/20' : 'bg-background'}`}>
                                                <User className="h-3 w-3 mr-1" /> {tarea.perfiles?.nombre || t('obra_detail.unknown_user')}
                                            </Badge>
                                        </div>
                                    </div>

                                    <Button variant="ghost" size="icon" onClick={() => deleteTarea(tarea.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}