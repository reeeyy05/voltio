import { useEffect, useState } from 'react';

import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HardHat, Loader2, MoreVertical, Plus, Calendar, CheckCircle2, Trash2, Clock } from 'lucide-react';
import { useObrasStore } from '@/stores/obraStore';

export default function ObrasPage() {
    const { obras, isLoading, fetchObras, createObra, updateEstadoObra, deleteObra } = useObrasStore();
    const { rol } = useAuthStore();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [nuevaObra, setNuevaObra] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchObras();
    }, [fetchObras]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevaObra.trim()) return;

        setIsCreating(true);
        try {
            await createObra(nuevaObra);
            setIsCreateOpen(false);
            setNuevaObra('');
        } catch (error) {
            alert("Error al crear la obra");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* CABECERA */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-3">
                        <HardHat className="h-8 w-8 text-primary" />
                        Obras y Proyectos
                    </h1>
                    <p className="text-stone-600 dark:text-stone-400 mt-1">
                        Gestiona los proyectos eléctricos activos y su estado.
                    </p>
                </div>

                {/* BOTÓN CREAR (Solo Admin) */}
                {rol === 'admin' && (
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Nueva Obra
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Dar de alta un nuevo proyecto</DialogTitle>
                                <DialogDescription>
                                    Introduce el nombre o referencia de la nueva obra. Su estado inicial será "En curso".
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombreObra">Nombre de la Obra</Label>
                                    <Input
                                        id="nombreObra"
                                        required
                                        placeholder="Ej: Instalación Eléctrica Edificio Sur"
                                        value={nuevaObra}
                                        onChange={e => setNuevaObra(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isCreating}>
                                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Crear Obra'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* GRILLA DE OBRAS */}
            {isLoading && obras.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : obras.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-xl border border-dashed border-stone-300 dark:border-stone-800">
                    <HardHat className="h-12 w-12 mx-auto text-stone-300 dark:text-stone-700 mb-4" />
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">No hay obras registradas</h3>
                    <p className="text-stone-500 mt-1">Las obras asignadas aparecerán aquí.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {obras.map((obra) => (
                        <Card key={obra.id} className="border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 bg-stone-50/50 dark:bg-stone-900/20">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg font-bold line-clamp-2 leading-tight">
                                        {obra.nombre}
                                    </CardTitle>
                                    <div className="flex items-center text-xs text-stone-500 pt-1">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(obra.creado_en).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>

                                {/* MENÚ DE ACCIONES (Solo Admin) */}
                                {rol === 'admin' && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="sr-only">Abrir menú</span>
                                                <MoreVertical className="h-4 w-4 text-stone-500" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones de obra</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {obra.estado === 'En curso' ? (
                                                <DropdownMenuItem onClick={() => updateEstadoObra(obra.id, 'Finalizada')}>
                                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Marcar como Finalizada
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem onClick={() => updateEstadoObra(obra.id, 'En curso')}>
                                                    <Clock className="mr-2 h-4 w-4 text-amber-500" /> Reabrir Obra
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => deleteObra(obra.id)} className="text-red-600 focus:bg-red-50 dark:focus:bg-red-950">
                                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar Obra
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </CardHeader>
                            <CardContent className="pt-4 flex-1">
                                {obra.estado === 'En curso' ? (
                                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200">
                                        <Clock className="h-3 w-3 mr-1" /> En curso
                                    </Badge>
                                ) : (
                                    <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200">
                                        <CheckCircle2 className="h-3 w-3 mr-1" /> Finalizada
                                    </Badge>
                                )}
                            </CardContent>
                            <CardFooter className="pt-4 border-t border-stone-100 dark:border-stone-800">
                                <Button variant="outline" className="w-full text-xs" onClick={() => alert("Próximamente: Detalle de la obra")}>
                                    Ver Detalles y Tareas
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}