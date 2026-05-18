import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, Plus, Loader2, MoreHorizontal, Minus, Trash2, ArrowUpDown } from 'lucide-react';
import { useInventarioStore, type Material } from '@/stores/inventarioStore';

export default function InventarioPage() {
    const { t } = useTranslation();
    const { materiales, isLoading, fetchMateriales, createMaterial, updateCantidad, deleteMaterial } = useInventarioStore();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [nuevoMaterial, setNewMaterial] = useState({ nombre: '', descripcion: '', cantidad: '', unidad: '' });

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

    const handleModifyStock = async (id: string, variacion: number) => {
        try {
            await updateCantidad(id, variacion);
            toast.success("Stock actualizado");
        } catch (error) {
            toast.error("No se pudo actualizar el stock");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMaterial(id);
            toast.success("Material eliminado");
        } catch (error) {
            toast.error("No se pudo eliminar el material");
        }
    };

    // DEFINICIÓN DE LAS COLUMNAS DE LA TABLA
    const columns = useMemo<ColumnDef<Material>[]>(() => [
        {
            accessorKey: "nombre",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 hover:bg-stone-200 dark:hover:bg-stone-800">
                        {t('inventario.form_name')}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div>
                    <p className="font-bold text-stone-800 dark:text-stone-200">{row.original.nombre}</p>
                    <p className="text-xs text-stone-500 max-w-xs truncate" title={row.original.descripcion || ''}>
                        {row.original.descripcion || 'Sin descripción'}
                    </p>
                </div>
            )
        },
        {
            accessorKey: "cantidad",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 hover:bg-stone-200 dark:hover:bg-stone-800">
                        Stock
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
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
                                <DropdownMenuItem onClick={() => handleDelete(material.id)} className="text-red-600">
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
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-3">
                        <Package className="h-8 w-8 text-primary" />
                        {t('inventario.title')}
                    </h1>
                    <p className="text-stone-600 dark:text-stone-400 mt-1">
                        {t('inventario.subtitle')}
                    </p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> {t('inventario.add_material')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
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

            {isLoading && materiales.length === 0 ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
                <DataTable columns={columns} data={materiales} />
            )}
        </div>
    );
}