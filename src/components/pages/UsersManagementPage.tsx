import React, { useEffect, useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { createClient } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, Shield, ShieldAlert, Trash2, UserPlus, Loader2, Users } from 'lucide-react';

export default function UsersManagementPage() {
    const { usuarios, isLoading, fetchUsuarios, updateRolUsuario, deleteUsuario } = useAdminStore();
    const { t } = useTranslation();

    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newName, setNewName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación manual tras quitar los 'required'
        if (!newName.trim() || !newEmail.trim() || newPassword.length < 6) {
            alert(t('users.error_validation'));
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

        } catch (error: any) {
            alert(t('users.error_create') + error.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        await deleteUsuario(userToDelete);
        setUserToDelete(null);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
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
                                <Label htmlFor="name">{t('users.form_name')}</Label>
                                {/* SIN ATRIBUTO REQUIRED */}
                                <Input id="name" value={newName} onChange={e => setNewName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('users.form_email')}</Label>
                                {/* SIN ATRIBUTO REQUIRED */}
                                <Input id="email" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{t('users.form_password')}</Label>
                                {/* SIN ATRIBUTO REQUIRED */}
                                <Input id="password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full" disabled={isCreating}>
                                {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : t('users.submit_create')}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-stone-50 dark:bg-stone-900/50">
                        <TableRow>
                            <TableHead className="w-[250px]">{t('users.col_user')}</TableHead>
                            <TableHead>{t('users.col_email')}</TableHead>
                            <TableHead>{t('users.col_role')}</TableHead>
                            <TableHead className="text-right">{t('users.col_actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && usuarios.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-stone-500">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                    {t('users.loading')}
                                </TableCell>
                            </TableRow>
                        ) : usuarios.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={user.avatar || undefined} />
                                        <AvatarFallback className="bg-primary/20 text-primary uppercase">
                                            {user.nombre.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span>{user.nombre} {user.apellidos}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-stone-600 dark:text-stone-400">
                                    {user.email}
                                </TableCell>
                                <TableCell>
                                    {user.rol === 'admin' ? (
                                        <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 flex w-fit items-center gap-1">
                                            <Shield className="h-3 w-3" /> {t('users.role_admin')}
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="flex w-fit items-center gap-1">
                                            {t('users.role_employee')}
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>{t('users.col_actions')}</DropdownMenuLabel>
                                            {user.rol === 'empleado' ? (
                                                <DropdownMenuItem onClick={() => updateRolUsuario(user.id, 'admin')}>
                                                    <Shield className="mr-2 h-4 w-4 text-amber-500" />
                                                    {t('users.action_make_admin')}
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem onClick={() => updateRolUsuario(user.id, 'empleado')}>
                                                    <ShieldAlert className="mr-2 h-4 w-4 text-stone-500" />
                                                    {t('users.action_remove_admin')}
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                className="text-red-600 dark:text-red-400 focus:text-red-600"
                                                onClick={() => setUserToDelete(user.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                {t('users.action_delete')}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

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