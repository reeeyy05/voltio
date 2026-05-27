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
import { useObrasStore, type EstadoObra } from '@/stores/obraStore';

export default function ObrasPage() {
    const { obras, isLoading, fetchObras, createObra, createObrasBulk, updateEstadoObra, deleteObra, deleteObrasBulk } = useObrasStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [nuevaObra, setNuevaObra] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [selectedObras, setSelectedObras] = useState<string[]>([]);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [obraToDelete, setObraToDelete] = useState<string | null>(null);

    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                            estado: 'En curso' as EstadoObra // Forzamos el tipo válido 'En curso'
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

    const handleUpdateEstado = async (id: string, estadoActual: EstadoObra) => {
        const nuevoEstado: EstadoObra = estadoActual === 'En curso' ? 'Finalizada' : 'En curso';
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
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center">
                    {selectedObras.length > 0 && (
                        <Button variant="destructive" onClick={() => setBulkDeleteOpen(true)} className="w-full sm:w-auto">
                            <Trash2 className="mr-2 h-4 w-4" /> Borrar {selectedObras.length}
                        </Button>
                    )}

                    <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto">
                                <Upload className="mr-2 h-4 w-4" /> Carga Masiva
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                                <DialogTitle>Carga Masiva de Obras</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <Input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} disabled={isUploading} />
                                {isUploading && <Loader2 className="animate-spin" />}
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> {t('obras.new_work')}
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentObras.map((obra) => (
                        <Card key={obra.id} className={selectedObras.includes(obra.id) ? 'ring-2 ring-primary' : ''}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold">{obra.nombre}</CardTitle>
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 cursor-pointer"
                                    checked={selectedObras.includes(obra.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) setSelectedObras(prev => [...prev, obra.id]);
                                        else setSelectedObras(prev => prev.filter(id => id !== obra.id));
                                    }}
                                />
                            </CardHeader>
                            <CardContent>
                                <Badge variant={obra.estado === 'En curso' ? 'default' : 'secondary'}>
                                    {obra.estado}
                                </Badge>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full" onClick={() => handleUpdateEstado(obra.id, obra.estado)}>
                                    Cambiar a {obra.estado === 'En curso' ? 'Finalizada' : 'En curso'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}