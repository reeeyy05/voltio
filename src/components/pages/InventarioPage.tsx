import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, Plus, Loader2, MoreHorizontal, Minus, Trash2, ArrowUpDown, Upload, Info, FileText, FileUp } from 'lucide-react';
import { useInventarioStore, type Material } from '@/stores/inventarioStore';

export default function InventarioPage() {
    const { t } = useTranslation();
    const { materiales, fetchMateriales, createMaterial, createMaterialesBulk, updateCantidad, deleteMaterial, deleteMaterialesBulk } = useInventarioStore();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [nuevoMaterial, setNewMaterial] = useState({ nombre: '', descripcion: '', cantidad: '', unidad: '' });

    const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);
    const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);

    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchMateriales();
    }, [fetchMateriales]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoMaterial.nombre.trim() || !nuevoMaterial.cantidad || !nuevoMaterial.unidad.trim()) {
            toast.warning(t('inventario.error_validation'));
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
            toast.success(t('inventario.success_add'));
        } catch (error) {
            toast.error(t('inventario.error_add'));
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
                if (lines.length === 0) throw new Error();

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
                    toast.success(t('inventario.success_bulk', { count: nuevosMateriales.length }));
                    setIsBulkModalOpen(false);
                } else {
                    toast.warning(t('inventario.warn_bulk'));
                }
            } catch (error) {
                toast.error(t('inventario.error_bulk'));
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
            toast.success(t('inventario.success_stock'));
        } catch (error) {
            toast.error(t('inventario.error_stock'));
        }
    };

    const confirmDeleteMaterial = async () => {
        if (!materialToDelete) return;
        try {
            await deleteMaterial(materialToDelete);
            toast.success(t('inventario.success_delete'));
        } catch (error) {
            toast.error(t('inventario.error_delete'));
        } finally {
            setMaterialToDelete(null);
        }
    };

    const confirmBulkDelete = async () => {
        try {
            await deleteMaterialesBulk(bulkDeleteIds);
            toast.success(t('inventario.success_bulk_delete', { count: bulkDeleteIds.length }));
        } catch (error) {
            toast.error(t('inventario.error_bulk_delete'));
        } finally {
            setBulkDeleteIds([]);
        }
    };

    const columns = useMemo<ColumnDef<Material>[]>(() => [
        {
            id: "select",
            header: ({ table }) => (
                <input type="checkbox" className="w-4 h-4 rounded border-stone-300 accent-primary cursor-pointer" checked={table.getIsAllPageRowsSelected()} onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)} />
            ),
            cell: ({ row }) => (
                <input type="checkbox" className="w-4 h-4 rounded border-stone-300 accent-primary cursor-pointer" checked={row.getIsSelected()} onChange={(e) => row.toggleSelected(!!e.target.checked)} />
            ),
            enableSorting: false,
        },
        {
            accessorKey: "nombre",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 hover:bg-stone-200 dark:hover:bg-stone-800">
                    {t('inventario.form_name')} <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <p className="font-bold text-stone-800 dark:text-stone-200">{row.original.nombre}</p>
                    <p className="text-xs text-stone-500 max-w-[150px] sm:max-w-xs truncate" title={row.original.descripcion || ''}>
                        {row.original.descripcion || t('inventario.no_desc')}
                    </p>
                </div>
            )
        },
        {
            accessorKey: "cantidad",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 hover:bg-stone-200 dark:hover:bg-stone-800">
                    Stock <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded font-bold">{row.original.cantidad}</span>
                    <span className="text-xs text-stone-500 uppercase font-bold tracking-wider">{row.original.unidad}</span>
                </div>
            )
        },
        {
            id: "quick_actions",
            header: "Modificar",
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleModifyStock(row.original.id, -1)}><Minus className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={() => handleModifyStock(row.original.id, 1)}><Plus className="h-4 w-4" /></Button>
                </div>
            )
        },
        {
            id: "actions",
            header: () => <div className="text-right">{t('inventario.actions')}</div>,
            cell: ({ row }) => (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('inventario.options')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setMaterialToDelete(row.original.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> {t('inventario.delete')}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ], [t]);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-3">
                        <Package className="h-7 w-7 sm:h-8 sm:w-8 text-primary" /> {t('inventario.title')}
                    </h1>
                    <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mt-1">{t('inventario.subtitle')}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 shadow-sm"><Upload className="h-4 w-4" /> {t('inventario.bulk_upload')}</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-xl font-bold"><FileUp className="h-6 w-6 text-primary" /> {t('inventario.bulk_modal_title')}</DialogTitle>
                                <DialogDescription>{t('inventario.bulk_modal_desc')}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold flex items-center gap-2"><Info className="h-4 w-4 text-blue-500" /> {t('inventario.format_info')}</h4>
                                    <p className="text-xs text-stone-600 dark:text-stone-400">{t('inventario.format_desc')}</p>
                                    <div className="bg-stone-100 dark:bg-stone-900 p-3 rounded-md font-mono text-[11px] border overflow-x-auto">Nombre, Descripción, Cantidad, Unidad</div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> {t('inventario.format_example_title')}</h4>
                                    <div className="bg-stone-50 dark:bg-stone-900/50 p-3 rounded-md font-mono text-[11px] border text-stone-500 whitespace-pre-line">{t('inventario.format_example')}</div>
                                </div>
                                <div className="pt-4 border-t">
                                    <Label className="block mb-3 text-sm font-bold">{t('inventario.select_file')}</Label>
                                    <div className="flex items-center gap-3">
                                        <Input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} disabled={isUploading} className="flex-1 cursor-pointer" />
                                        {isUploading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild><Button className="flex items-center gap-2 w-full sm:w-auto"><Plus className="h-4 w-4" /> {t('inventario.add_material')}</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>{t('inventario.create_title')}</DialogTitle></DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <Label>{t('inventario.form_name')}</Label>
                                <Input placeholder={t('inventario.form_name_ph')} value={nuevoMaterial.nombre} onChange={e => setNewMaterial({ ...nuevoMaterial, nombre: e.target.value })} />
                                <Label>{t('inventario.form_desc')}</Label>
                                <Textarea value={nuevoMaterial.descripcion} onChange={e => setNewMaterial({ ...nuevoMaterial, descripcion: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label>{t('inventario.form_qty')}</Label><Input type="number" min="0" value={nuevoMaterial.cantidad} onChange={e => setNewMaterial({ ...nuevoMaterial, cantidad: e.target.value })} /></div>
                                    <div><Label>{t('inventario.form_unit')}</Label><Input placeholder={t('inventario.form_unit_ph')} value={nuevoMaterial.unidad} onChange={e => setNewMaterial({ ...nuevoMaterial, unidad: e.target.value })} /></div>
                                </div>
                                <Button type="submit" className="w-full" disabled={isCreating}>{isCreating ? <Loader2 className="animate-spin" /> : t('inventario.submit_create')}</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <DataTable columns={columns} data={materiales} onDeleteSelected={(ids) => setBulkDeleteIds(ids)} />
            <AlertDialog open={bulkDeleteIds.length > 0} onOpenChange={() => setBulkDeleteIds([])}>
                <AlertDialogContent>
                    <AlertDialogTitle>{t('inventario.bulk_delete_title', { count: bulkDeleteIds.length })}</AlertDialogTitle>
                    <AlertDialogDescription>{t('inventario.bulk_delete_desc')}</AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('inventario.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmBulkDelete} className="bg-red-600">{t('inventario.bulk_delete_confirm')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={!!materialToDelete} onOpenChange={() => setMaterialToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogTitle>{t('inventario.delete_confirm_title')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('inventario.delete_confirm_desc')}</AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('inventario.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteMaterial} className="bg-red-600">{t('inventario.delete')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}