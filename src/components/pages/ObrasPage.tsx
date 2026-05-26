import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HardHat, Loader2, MoreVertical, Plus, Calendar, CheckCircle2, Trash2, Clock, AlertCircle, Upload, Info, FileText, FileUp } from 'lucide-react';
import { useObrasStore } from '@/stores/obraStore';

export default function ObrasPage() {
    const { obras, isLoading, fetchObras, createObra, createObrasBulk, updateEstadoObra, deleteObra, deleteObrasBulk } = useObrasStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [nuevaObra, setNuevaObra] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Estados para borrado
    const [selectedObras, setSelectedObras] = useState<string[]>([]);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [obraToDelete, setObraToDelete] = useState<string | null>(null);

    // NUEVO: Estados para el modal de carga masiva
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.max(1, Math.ceil(obras.length / ITEMS_PER_PAGE));
    const validCurrentPage = Math.min(currentPage, totalPages);
    const indexOfLastItem = validCurrentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentObras = obras.slice(indexOfFirstItem, indexOfLastItem);

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
            toast.success("Obra creada correctamente");
            setCurrentPage(1);
        } catch (error) {
            setErrorMsg(t('obras.error_create'));
            toast.error("No se pudo crear la obra");
        } finally {
            setIsCreating(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split('\n').filter(line => line.trim() !== '');
                if (lines.length === 0) throw new Error("Archivo vacío");

                const isHeader = lines[0].toLowerCase().includes('nombre');
                const startIndex = isHeader ? 1 : 0;

                const nuevasObras = [];
                for (let i = startIndex; i < lines.length; i++) {
                    const cols = lines[i].split(',');
                    if (cols.length >= 1 && cols[0].trim() !== '') {
                        nuevasObras.push({
                            nombre: cols[0].trim(),
                            descripcion: cols[1] ? cols[1].trim() : null,
                            estado: 'Pendiente' as const
                        });
                    }
                }

                if (nuevasObras.length > 0) {
                    await createObrasBulk(nuevasObras);
                    toast.success(`${nuevasObras.length} obras cargadas correctamente`);
                    setIsBulkModalOpen(false);
                    setCurrentPage(1);
                } else {
                    toast.warning("No se encontraron obras válidas en el archivo.");
                }
            } catch (error) {
                toast.error("Error al procesar el archivo CSV.");
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    const handleUpdateEstado = async (id: string, estadoActual: 'Pendiente' | 'Finalizada') => {
        const nuevoEstado = estadoActual === 'Pendiente' ? 'Finalizada' : 'Pendiente';
        try {
            await updateEstadoObra(id, nuevoEstado);
            toast.success(`Estado actualizado a ${nuevoEstado}`);
        } catch (error) {
            toast.error("Error al actualizar el estado");
        }
    };

    const confirmDeleteObra = async () => {
        if (!obraToDelete) return;
        try {
            await deleteObra(obraToDelete);
            toast.success("Obra eliminada permanentemente");
        } catch (error) {
            toast.error("Error al eliminar la obra");
        } finally {
            setObraToDelete(null);
        }
    };

    const confirmBulkDelete = async () => {
        try {
            await deleteObrasBulk(selectedObras);
            toast.success(`${selectedObras.length} obras eliminadas permanentemente`);
        } catch (error) {
            toast.error("Error al eliminar las obras");
        } finally {
            setSelectedObras([]);
            setBulkDeleteOpen(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-3">
                        <HardHat className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                        {t('obras.title')}
                    </h1>
                    <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mt-1">
                        {t('obras.subtitle')}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center">

                    {selectedObras.length > 0 && (
                        <Button variant="destructive" onClick={() => setBulkDeleteOpen(true)} className="w-full sm:w-auto animate-in fade-in duration-200 shadow-md">
                            <Trash2 className="mr-2 h-4 w-4" /> Borrar {selectedObras.length}
                        </Button>
                    )}

                    {/* MODAL UNIFICADO DE CARGA MASIVA DE OBRAS */}
                    <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 shadow-sm w-full sm:w-auto">
                                <Upload className="h-4 w-4" /> Carga Masiva
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                    <FileUp className="h-6 w-6 text-primary" /> Carga Masiva de Obras
                                </DialogTitle>
                                <DialogDescription>
                                    Importa múltiples proyectos eléctricos de una sola vez mediante un archivo CSV.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold flex items-center gap-2"><Info className="h-4 w-4 text-blue-500" /> Guía de formato</h4>
                                    <p className="text-xs text-stone-600 dark:text-stone-400">
                                        Sube un archivo <b>.csv</b> con 2 columnas (la descripción es opcional):
                                    </p>
                                    <div className="bg-stone-100 dark:bg-stone-900 p-3 rounded-md font-mono text-[11px] border border-stone-200 dark:border-stone-800 overflow-x-auto">
                                        Nombre Obra, Descripción
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Ejemplo de filas</h4>
                                    <div className="bg-stone-50 dark:bg-stone-900/50 p-3 rounded-md font-mono text-[11px] border border-stone-200 dark:border-stone-800 text-stone-500">
                                        Instalación LED Nave B, Cambio de luminarias a bajo consumo<br />
                                        Mantenimiento Subestación Este, <br />
                                        Reforma Cuadro Control, Sector C - Planta 1
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <Label htmlFor="csv-file-obras" className="block mb-3 text-sm font-bold text-stone-900 dark:text-stone-100">
                                        Selecciona el archivo para importar
                                    </Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            id="csv-file-obras"
                                            type="file"
                                            accept=".csv"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            disabled={isUploading}
                                            className="flex-1 cursor-pointer file:font-semibold file:text-primary"
                                        />
                                        {isUploading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isCreateOpen} onOpenChange={(open) => {
                        setIsCreateOpen(open);
                        if (!open) setErrorMsg(null);
                    }}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto flex items-center gap-2">
                                <Plus className="h-4 w-4" /> {t('obras.new_work')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{t('obras.create_title')}</DialogTitle>
                                <DialogDescription>{t('obras.create_desc')}</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 mt-4">
                                {errorMsg && (
                                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-start gap-2 text-sm">
                                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                        <span>{errorMsg}</span>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="nombreObra">{t('obras.form_name')}</Label>
                                    <Input id="nombreObra" placeholder={t('obras.form_name_ph')} value={nuevaObra} onChange={e => setNuevaObra(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="desc">{t('obras.form_desc')}</Label>
                                    <Textarea id="desc" placeholder={t('obras.form_desc_ph')} value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                                </div>
                                <Button type="submit" className="w-full" disabled={isCreating}>
                                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : t('obras.submit_create')}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {isLoading && obras.length === 0 ? (
                <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : obras.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-xl border border-dashed border-stone-300 dark:border-stone-800">
                    <HardHat className="h-12 w-12 mx-auto text-stone-300 dark:text-stone-700 mb-4" />
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{t('obras.no_works')}</h3>
                    <p className="text-stone-500 mt-1">{t('obras.no_works_desc')}</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {currentObras.map((obra) => (
                            <Card key={obra.id} className={`border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all group flex flex-col ${selectedObras.includes(obra.id) ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 bg-stone-50/50 dark:bg-stone-900/20">
                                    <div className="space-y-1 flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            className="mt-1.5 w-4 h-4 rounded border-stone-300 accent-primary cursor-pointer"
                                            checked={selectedObras.includes(obra.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedObras(prev => [...prev, obra.id]);
                                                else setSelectedObras(prev => prev.filter(id => id !== obra.id));
                                            }}
                                        />
                                        <div>
                                            <CardTitle className="text-lg font-bold line-clamp-1" title={obra.nombre}>{obra.nombre}</CardTitle>
                                            <div className="flex items-center text-xs text-stone-500 pt-1">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {new Date(obra.creado_en).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="h-4 w-4 text-stone-500" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>{t('obras.management')}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleUpdateEstado(obra.id, obra.estado)}>
                                                {obra.estado === 'Pendiente' ? <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> : <Clock className="mr-2 h-4 w-4 text-amber-500" />}
                                                {obra.estado === 'Pendiente' ? t('obras.finish') : t('obras.reopen')}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => setObraToDelete(obra.id)} className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" /> {t('obras.delete')}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent className="pt-4 flex-1">
                                    {obra.descripcion && (
                                        <p className="text-xs text-stone-500 mb-4 line-clamp-2 italic">{obra.descripcion}</p>
                                    )}
                                    <Badge variant={obra.estado === 'Pendiente' ? 'secondary' : 'default'} className={obra.estado === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}>
                                        {obra.estado === 'Pendiente' ? 'Pendiente' : t('obras.status_completed')}
                                    </Badge>
                                </CardContent>
                                <CardFooter className="pt-4 border-t border-stone-100 dark:border-stone-800">
                                    <Button variant="outline" className="w-full text-xs" onClick={() => navigate(`/app/obras/${obra.id}`)}>
                                        {t('obras.view_details')}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {obras.length > ITEMS_PER_PAGE && (
                        <div className="flex items-center justify-between px-2 pt-4 border-t border-stone-200 dark:border-stone-800 mt-6">
                            <div className="text-sm text-stone-500 font-medium">Página {validCurrentPage} de {totalPages}</div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={validCurrentPage === 1}>Anterior</Button>
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={validCurrentPage === totalPages}>Siguiente</Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* MODALES DE CONFIRMACIÓN */}
            <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar {selectedObras.length} obras?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer. Se eliminarán de forma definitiva.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmBulkDelete} className="bg-red-600 hover:bg-red-700 text-white">Borrar Definitivamente</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!obraToDelete} onOpenChange={(open) => !open && setObraToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Seguro que quieres borrar esta obra?</AlertDialogTitle>
                        <AlertDialogDescription>Se perderán todas las tareas relacionadas. Esta acción es irreversible.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteObra} className="bg-red-600 hover:bg-red-700 text-white">Borrar Obra</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}