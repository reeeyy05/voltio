import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, Plus, Loader2, MoreHorizontal, Minus, Trash2, ArrowUpDown, Upload, Info, FileText, FileUp } from 'lucide-react';
import { useInventarioStore, type Material } from '@/stores/inventarioStore';

export default function InventarioPage() {
    const { t } = useTranslation();
    const { materiales, isLoading, fetchMateriales, createMaterial, createMaterialesBulk, updateCantidad, deleteMaterial, deleteMaterialesBulk } = useInventarioStore();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [nuevoMaterial, setNewMaterial] = useState({ nombre: '', descripcion: '', cantidad: '', unidad: '' });

    const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);
    const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);

    // NUEVO: Estados para el modal de carga masiva
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchMateriales();
    }, [fetchMateriales]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoMaterial.nombre.trim() || !nuevoMaterial.cantidad || !nuevoMaterial.unidad.trim()) {
            toast.warning("Rellena los campos obligatorios: Nombre, Cantidad y Unidad");
            return;
        }

        setIsCreating(true);
        try {
            await createMaterial({
                nombre: nuevoMaterial.nombre,
                descripcion: nuevoMaterial.descripcion || null,
                cantidad: parseFloat(nuevoMaterial.cantidad) || 0,
                unidad: nuevoMaterial.unidad
            });
            setIsCreateOpen(false);
            setNewMaterial({ nombre: '', descripcion: '', cantidad: '', unidad: '' });
            toast.success("Material añadido al inventario");
        } catch (error) {
            toast.error("Error al registrar el material");
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

                const nuevosMateriales = [];
                for (let i = startIndex; i < lines.length; i++) {
                    const cols = lines[i].split(',');
                    if (cols.length >= 4) {
                        nuevosMateriales.push({
                            nombre: cols[0].trim(),
                            descripcion: cols[1].trim() || null,
                            cantidad: parseFloat(cols[2].trim()) || 0,
                            unidad: cols[3].trim()
                        });
                    }
                }

                if (nuevosMateriales.length > 0) {
                    await createMaterialesBulk(nuevosMateriales);
                    toast.success(`${nuevosMateriales.length} materiales cargados correctamente`);
                    setIsBulkModalOpen(false); // Cerramos el modal tras el éxito
                } else {
                    toast.warning("No se encontraron datos válidos en el archivo.");
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

    const handleModifyStock = async (id: string, variacion: number) => {
        try {
            await updateCantidad(id, variacion);
            toast.success("Stock actualizado");
        } catch (error) {
            toast.error("No se pudo actualizar el stock");
        }
    };

    const confirmDeleteMaterial = async () => {
        if (!materialToDelete) return;
        try {
            await deleteMaterial(materialToDelete);
            toast.success("Material eliminado");
        } catch (error) {
            toast.error("No se pudo eliminar el material");
        } finally {
            setMaterialToDelete(null);
        }
    };

    const confirmBulkDelete = async () => {
        try {
            await deleteMaterialesBulk(bulkDeleteIds);
            toast.success(`${bulkDeleteIds.length} materiales eliminados con éxito`);
        } catch (error) {
            toast.error("Error al eliminar los materiales");
        } finally {
            setBulkDeleteIds([]);
        }
    };

    const columns = useMemo<ColumnDef<Material>[]>(() => [
        {
            id: "select",
            header: ({ table }) => (
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-stone-300 accent-primary cursor-pointer"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-stone-300 accent-primary cursor-pointer"
                    checked={row.getIsSelected()}
                    onChange={(e) => row.toggleSelected(!!e.target.checked)}
                />
            ),
            enableSorting: false,
        },
        {
            accessorKey: "nombre",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 hover:bg-stone-200 dark:hover:bg-stone-800">
                    {t('inventario.form_name')}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <p className="font-bold text-stone-800 dark:text-stone-200">{row.original.nombre}</p>
                    <p className="text-xs text-stone-500 max-w-[150px] sm:max-w-xs truncate" title={row.original.descripcion || ''}>
                        {row.original.descripcion || 'Sin descripción'}
                    </p>
                </div>
            )
        },
        {
            accessorKey: "cantidad",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 hover:bg-stone-200 dark:hover:bg-stone-800">
                    Stock
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded font-bold">
                        {row.original.cantidad}
                    </span>
                    <span className="text-xs text-stone-500 uppercase font-bold tracking-wider">{row.original.unidad}</span>
                </div>
            )
        },
        {
            id: "quick_actions",
            header: "Modificar",
            cell: ({ row }) => {
                const material = row.original;
                return (
                    <div className="flex gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleModifyStock(material.id, -1)}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={() => handleModifyStock(material.id, 1)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                );
            }
        },
        {
            id: "actions",
            header: () => <div className="text-right">Acciones</div>,
            cell: ({ row }) => {
                const material = row.original;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setMaterialToDelete(material.id)} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" /> {t('inventario.delete')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            }
        }
    ], [t]);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-3">
                        <Package className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                        {t('inventario.title')}
                    </h1>
                    <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mt-1">
                        {t('inventario.subtitle')}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">

                    {/* MODAL UNIFICADO DE CARGA MASIVA */}
                    <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 shadow-sm">
                                <Upload className="h-4 w-4" /> Carga Masiva
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                    <FileUp className="h-6 w-6 text-primary" /> Carga Masiva de Inventario
                                </DialogTitle>
                                <DialogDescription>
                                    Sigue estas instrucciones para importar múltiples materiales desde un archivo CSV.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold flex items-center gap-2"><Info className="h-4 w-4 text-blue-500" /> Formato del archivo</h4>
                                    <p className="text-xs text-stone-600 dark:text-stone-400">
                                        El archivo debe ser un <b>.csv</b> con 4 columnas en este orden exacto:
                                    </p>
                                    <div className="bg-stone-100 dark:bg-stone-900 p-3 rounded-md font-mono text-[11px] border border-stone-200 dark:border-stone-800 overflow-x-auto">
                                        Nombre, Descripción, Cantidad, Unidad
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Ejemplo de contenido</h4>
                                    <div className="bg-stone-50 dark:bg-stone-900/50 p-3 rounded-md font-mono text-[11px] border border-stone-200 dark:border-stone-800 text-stone-500">
                                        Cable Cobre 10mm, Rollo 50m, 20, Metros<br />
                                        Cuadro Eléctrico Principal, , 5, Unidades<br />
                                        Focos LED 50W, Iluminación exterior, 12, Cajas
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <Label htmlFor="csv-file" className="block mb-3 text-sm font-bold text-stone-900 dark:text-stone-100">
                                        Paso final: Selecciona tu archivo
                                    </Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            id="csv-file"
                                            type="file"
                                            accept=".csv"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            disabled={isUploading}
                                            className="flex-1 cursor-pointer file:cursor-pointer file:font-semibold file:text-primary"
                                        />
                                        {isUploading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2 w-full sm:w-auto">
                                <Plus className="h-4 w-4" /> {t('inventario.add_material')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{t('inventario.create_title')}</DialogTitle>
                                <DialogDescription>{t('inventario.create_desc')}</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label>{t('inventario.form_name')}</Label>
                                    <Input placeholder={t('inventario.form_name_ph')} value={nuevoMaterial.nombre} onChange={e => setNewMaterial({ ...nuevoMaterial, nombre: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('inventario.form_desc')}</Label>
                                    <Textarea value={nuevoMaterial.descripcion} onChange={e => setNewMaterial({ ...nuevoMaterial, descripcion: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>{t('inventario.form_qty')}</Label>
                                        <Input type="number" min="0" value={nuevoMaterial.cantidad} onChange={e => setNewMaterial({ ...nuevoMaterial, cantidad: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t('inventario.form_unit')}</Label>
                                        <Input placeholder={t('inventario.form_unit_ph')} value={nuevoMaterial.unidad} onChange={e => setNewMaterial({ ...nuevoMaterial, unidad: e.target.value })} />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={isCreating}>
                                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : t('inventario.submit_create')}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {isLoading && materiales.length === 0 ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
                <div className="w-full overflow-x-auto pb-4">
                    <DataTable
                        columns={columns}
                        data={materiales}
                        searchPlaceholder="Buscar material, descripción, o stock..."
                        onDeleteSelected={(ids) => setBulkDeleteIds(ids)}
                    />
                </div>
            )}

            <AlertDialog open={bulkDeleteIds.length > 0} onOpenChange={(open) => !open && setBulkDeleteIds([])}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar {bulkDeleteIds.length} materiales?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Los materiales seleccionados serán borrados de forma permanente de la base de datos de Voltio.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmBulkDelete} className="bg-red-600 hover:bg-red-700 text-white">
                            Borrar Definitivamente
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!materialToDelete} onOpenChange={(open) => !open && setMaterialToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Seguro que quieres borrar este material?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Al confirmar, el material y su stock desaparecerán de la base de datos permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteMaterial} className="bg-red-600 hover:bg-red-700 text-white">
                            Borrar Material
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}