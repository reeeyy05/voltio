import React, { useEffect, useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { createClient } from '@supabase/supabase-js';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, Shield, ShieldAlert, Trash2, UserPlus, Loader2, Users } from 'lucide-react';

export default function UsersManagementPage() {
    const { usuarios, isLoading, fetchUsuarios, updateRolUsuario, deleteUsuario } = useAdminStore();

    // Estados para los modales
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Estados para el formulario de creación
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newName, setNewName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    // EL TRUCO SENIOR: Cliente temporal para crear usuario sin desloguear al Admin
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

            // Creamos un cliente que NO guarda sesión
            const tempSupabase = createClient(supabaseUrl, supabaseAnonKey, {
                auth: { persistSession: false, autoRefreshToken: false }
            });

            const { error } = await tempSupabase.auth.signUp({
                email: newEmail,
                password: newPassword,
                options: { data: { nombre: newName, apellidos: '' } }
            });

            if (error) throw error;

            // Recargamos la lista y cerramos modal
            await fetchUsuarios();
            setIsCreateOpen(false);
            setNewEmail(''); setNewPassword(''); setNewName('');

        } catch (error: any) {
            alert('Error al crear usuario: ' + error.message);
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
                        Gestión de Usuarios
                    </h1>
                    <p className="text-stone-600 dark:text-stone-400 mt-1">
                        Administra los accesos y roles de tu equipo.
                    </p>
                </div>

                {/* MODAL DE CREACIÓN DE USUARIO */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Añadir Usuario
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crear nuevo empleado</DialogTitle>
                            <DialogDescription>
                                Genera unas credenciales para que un empleado acceda a Voltio.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input id="name" required value={newName} onChange={e => setNewName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input id="email" type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña (Mínimo 6 caracteres)</Label>
                                <Input id="password" type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full" disabled={isCreating}>
                                {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Crear Cuenta'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* TABLA DE DATOS */}
            <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-stone-50 dark:bg-stone-900/50">
                        <TableRow>
                            <TableHead className="w-[250px]">Usuario</TableHead>
                            <TableHead>Correo</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && usuarios.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-stone-500">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                    Cargando usuarios...
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
                                            <Shield className="h-3 w-3" /> Admin
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="flex w-fit items-center gap-1">
                                            Empleado
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Abrir menú</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones de rol</DropdownMenuLabel>
                                            {user.rol === 'empleado' ? (
                                                <DropdownMenuItem onClick={() => updateRolUsuario(user.id, 'admin')}>
                                                    <Shield className="mr-2 h-4 w-4 text-amber-500" />
                                                    Hacer Administrador
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem onClick={() => updateRolUsuario(user.id, 'empleado')}>
                                                    <ShieldAlert className="mr-2 h-4 w-4 text-stone-500" />
                                                    Quitar Administrador
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                className="text-red-600 dark:text-red-400 focus:text-red-600"
                                                onClick={() => setUserToDelete(user.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Eliminar Usuario
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará el perfil del usuario y le impedirá acceder a sus obras y tareas asignadas. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                            Sí, eliminar usuario
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}