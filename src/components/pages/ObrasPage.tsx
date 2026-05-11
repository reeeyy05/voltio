import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HardHat, Loader2, MoreVertical, Plus, Calendar, CheckCircle2, Trash2, Clock } from 'lucide-react';
import { useObrasStore } from '@/stores/obraStore';

export default function ObrasPage() {
    const { obras, isLoading, fetchObras, createObra, updateEstadoObra, deleteObra } = useObrasStore();
    const navigate = useNavigate();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [nuevaObra, setNuevaObra] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchObras();
    }, [fetchObras]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevaObra.trim()) return;

        setIsCreating(true);
        try {
            await createObra(nuevaObra, descripcion);
            setIsCreateOpen(false);
            setNuevaObra('');
            setDescripcion('');
        } catch (error) {
            alert("Error al crear la obra");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-3">
                        <HardHat className="h-8 w-8 text-primary" />
                        Obras y Proyectos
                    </h1>
                    <p className="text-stone-600 dark:text-stone-400 mt-1">
                        Gestión colaborativa de proyectos de la empresa.
                    </p>
                </div>

                {/* BOTÓN DISPONIBLE PARA TODOS */}
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
                            <DialogDescription>Añade los detalles principales de la nueva obra.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombreObra">Nombre de la Obra</Label>
                                <Input id="nombreObra" placeholder="Ej: Instalación Edificio Norte" value={nuevaObra} onChange={e => setNuevaObra(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="desc">Descripción / Ubicación</Label>
                                <Textarea id="desc" placeholder="Detalles, dirección o contacto..." value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full" disabled={isCreating}>
                                {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Crear Obra'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading && obras.length === 0 ? (
                <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : obras.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-xl border border-dashed border-stone-300 dark:border-stone-800">
                    <HardHat className="h-12 w-12 mx-auto text-stone-300 dark:text-stone-700 mb-4" />
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">No hay obras registradas</h3>
                    <p className="text-stone-500 mt-1">Cualquier miembro del equipo puede registrar una obra nueva.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {obras.map((obra) => (
                        <Card key={obra.id} className="border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 bg-stone-50/50 dark:bg-stone-900/20">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg font-bold line-clamp-1">{obra.nombre}</CardTitle>
                                    <div className="flex items-center text-xs text-stone-500 pt-1">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(obra.creado_en).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* MENÚ DISPONIBLE PARA TODOS */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="h-4 w-4 text-stone-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Gestión</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => updateEstadoObra(obra.id, obra.estado === 'En curso' ? 'Finalizada' : 'En curso')}>
                                            {obra.estado === 'En curso' ? <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> : <Clock className="mr-2 h-4 w-4 text-amber-500" />}
                                            {obra.estado === 'En curso' ? 'Finalizar' : 'Reabrir'}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => deleteObra(obra.id)} className="text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="pt-4 flex-1">
                                {obra.descripcion && (
                                    <p className="text-xs text-stone-500 mb-4 line-clamp-2 italic">{obra.descripcion}</p>
                                )}
                                <Badge variant={obra.estado === 'En curso' ? 'secondary' : 'default'} className={obra.estado === 'En curso' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}>
                                    {obra.estado}
                                </Badge>
                            </CardContent>
                            <CardFooter className="pt-4 border-t border-stone-100 dark:border-stone-800">
                                <Button variant="outline" className="w-full text-xs" onClick={() => navigate(`/app/obras/${obra.id}`)}>
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