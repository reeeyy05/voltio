import React, { useEffect, useState, useMemo } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { createClient } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { toast } from 'sonner';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, Shield, ShieldAlert, Trash2, UserPlus, Loader2, Users, Edit, ArrowUpDown } from 'lucide-react';
import type { Perfil } from '@/stores/authStore';

export default function UsersManagementPage() {
    const { usuarios, isLoading, fetchUsuarios, updateRolUsuario, deleteUsuario, updateDetallesUsuario } = useAdminStore();
    const { t } = useTranslation();

    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Estados para Edición
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editSurname, setEditSurname] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newName, setNewName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || !newEmail.trim() || newPassword.length < 6) {
            toast.warning("Completa todos los campos. La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        setIsCreating(true);
        try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
            const tempSupabase = createClient(supabaseUrl, supabaseAnonKey, {
                auth: { persistSession: false, autoRefreshToken: false }
            });

            const { error } = await tempSupabase.auth.signUp({
                email: newEmail,
                password: newPassword,
                options: { data: { nombre: newName, apellidos: '' } }
            });
            if (error) throw error;

            await fetchUsuarios();
            setIsCreateOpen(false);
            setNewEmail(''); setNewPassword(''); setNewName('');
            toast.success("Usuario creado con éxito");
        } catch (error: any) {
            toast.error("Error al crear usuario: " + error.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleOpenEdit = (user: Perfil) => {
        setUserToEdit(user.id);
        setEditName(user.nombre);
        setEditSurname(user.apellidos || '');
        setIsEditOpen(true);
    };

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userToEdit || !editName.trim()) {
            toast.warning("El nombre es obligatorio");
            return;
        }
        setIsEditing(true);
        try {
            await updateDetallesUsuario(userToEdit, editName, editSurname);
            setIsEditOpen(false);
            toast.success("Información actualizada");
        } catch (error: any) {
            toast.error("Error al actualizar usuario");
        } finally {
            setIsEditing(false);
        }
    };

    const handleRoleChange = async (id: string, newRole: 'admin' | 'empleado') => {
        try {
            await updateRolUsuario(id, newRole);
            toast.success(`Rol actualizado a ${newRole}`);
        } catch (error) {
            toast.error("Error al cambiar de rol");
        }
    }

    const handleDelete = async () => {
        if (!userToDelete) return;
        try {
            await deleteUsuario(userToDelete);
            toast.success("Usuario eliminado");
        } catch (error) {
            toast.error("Error al eliminar el usuario");
        } finally {
            setUserToDelete(null);
        }
    };

    const columns = useMemo<ColumnDef<Perfil>[]>(() => [
        {
            accessorKey: "nombre",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 hover:bg-stone-200 dark:hover:bg-stone-800">
                        {t('users.col_user')}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="font-medium flex items-center gap-3 py-1">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="bg-primary/20 text-primary uppercase">
                                {user.nombre.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span>{user.nombre} {user.apellidos}</span>
                        </div>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                const name = row.original.nombre?.toLowerCase() || '';
                const surname = row.original.apellidos?.toLowerCase() || '';
                const email = row.original.email?.toLowerCase() || '';
                const search = value.toLowerCase();
                return name.includes(search) || surname.includes(search) || email.includes(search);
            }
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 hover:bg-stone-200 dark:hover:bg-stone-800">
                        {t('users.col_email')}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <span className="text-stone-600 dark:text-stone-400">{row.original.email}</span>,
        },
        {
            accessorKey: "rol",
            header: t('users.col_role'), // AQUÍ NO PONEMOS ORDENACIÓN
            cell: ({ row }) => {
                return row.original.rol === 'admin' ? (
                    <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 flex w-fit items-center gap-1">
                        <Shield className="h-3 w-3" /> {t('users.role_admin')}
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="flex w-fit items-center gap-1">
                        {t('users.role_employee')}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: () => <div className="text-right">{t('users.col_actions')}</div>,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{t('users.col_actions')}</DropdownMenuLabel>

                                <DropdownMenuItem onClick={() => handleOpenEdit(user)}>
                                    <Edit className="mr-2 h-4 w-4 text-stone-500" />
                                    {t('users.action_edit')}
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {user.rol === 'empleado' ? (
                                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')}>
                                        <Shield className="mr-2 h-4 w-4 text-amber-500" />
                                        {t('users.action_make_admin')}
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'empleado')}>
                                        <ShieldAlert className="mr-2 h-4 w-4 text-stone-500" />
                                        {t('users.action_remove_admin')}
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />

                                <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => setUserToDelete(user.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t('users.action_delete')}
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-3">
                        <Users className="h-8 w-8 text-primary" />
                        {t('users.title')}
                    </h1>
                    <p className="text-stone-600 dark:text-stone-400 mt-1">
                        {t('users.subtitle')}
                    </p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            {t('users.add_user')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('users.create_title')}</DialogTitle>
                            <DialogDescription>{t('users.create_desc')}</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>{t('users.form_name')}</Label>
                                <Input value={newName} onChange={e => setNewName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('users.form_email')}</Label>
                                <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('users.form_password')}</Label>
                                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full" disabled={isCreating}>
                                {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : t('users.submit_create')}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading && usuarios.length === 0 ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <DataTable columns={columns} data={usuarios} />
            )}

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('users.edit_title')}</DialogTitle>
                        <DialogDescription>{t('users.edit_desc')}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditUser} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label>{t('users.form_name')}</Label>
                            <Input value={editName} onChange={e => setEditName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('users.form_surname')}</Label>
                            <Input value={editSurname} onChange={e => setEditSurname(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full" disabled={isEditing}>
                            {isEditing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : t('users.submit_edit')}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('users.delete_confirm_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('users.delete_confirm_desc')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('users.delete_cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                            {t('users.delete_confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}