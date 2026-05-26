import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
    type ColumnDef,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Trash2 } from "lucide-react" // Añadido Trash2

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchPlaceholder?: string; // NUEVO: Para personalizar el buscador
    onDeleteSelected?: (selectedIds: string[]) => void; // NUEVO: Para habilitar el borrado múltiple
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchPlaceholder,
    onDeleteSelected
}: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = useState("")
    const [sorting, setSorting] = useState<SortingState>([])
    const [rowSelection, setRowSelection] = useState({}) // NUEVO: Estado para selección de filas
    const { t } = useTranslation()

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection, // Conectar estado
        getRowId: (row: any) => row.id, // IMPORTANTE: Usar el ID real de la fila para borrar
        state: {
            sorting,
            globalFilter,
            rowSelection, // Estado inyectado
        },
    })

    const selectedIds = Object.keys(rowSelection); // Obtener IDs seleccionados

    return (
        <div>
            {/* BUSCADOR Y BOTÓN DE BORRADO MASIVO */}
            <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-500" />
                    <Input
                        placeholder={searchPlaceholder || t('data_table.search')}
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(String(event.target.value))}
                        className="pl-8"
                    />
                </div>

                {/* BOTÓN MÁGICO DE BORRADO (Solo sale si hay 1 o más seleccionados) */}
                {onDeleteSelected && selectedIds.length > 0 && (
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onDeleteSelected(selectedIds);
                            setRowSelection({}); // Limpiamos selección tras pulsar
                        }}
                        className="w-full sm:w-auto flex items-center shadow-md animate-in fade-in zoom-in duration-200"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Borrar {selectedIds.length} seleccionado(s)
                    </Button>
                )}
            </div>

            {/* TABLA DE DATOS */}
            <div className="rounded-md border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 overflow-hidden">
                <Table>
                    <TableHeader className="bg-stone-50 dark:bg-stone-900/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-stone-700 dark:text-stone-300 font-semibold">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-stone-500">
                                    {t('data_table.no_results')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINACIÓN */}
            <div className="flex items-center justify-between px-2 mt-4">
                <div className="text-sm text-stone-500 flex items-center gap-4">
                    <span>
                        {t('data_table.page')} {table.getState().pagination.pageIndex + 1} {t('data_table.of')} {table.getPageCount()}
                    </span>
                    {selectedIds.length > 0 && (
                        <span className="font-semibold text-primary">{selectedIds.length} fila(s) seleccionadas.</span>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {t('data_table.previous')}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {t('data_table.next')}
                    </Button>
                </div>
            </div>
        </div>
    )
}