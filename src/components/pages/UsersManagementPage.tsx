import { useEffect, useState } from "react";
import { supabase } from "@/Supabase/Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // ¡Ahora sí va a funcionar esto!
import { Trash2, RefreshCcw, ShieldAlert, ShieldCheck } from "lucide-react";
import type { Perfil } from "@/stores/authStore";

export default function UsersManagementPage() {
    const [usuarios, setUsuarios] = useState<Perfil[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsuarios = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('perfiles')
            .select('*')
            .order('nombre', { ascending: true });

        if (!error && data) {
            setUsuarios(data as Perfil[]);
        } else {
            console.error("Error al cargar usuarios:", error);
        }
        setLoading(false);
    };

    const toggleRol = async (id: string, currentRol: string) => {
        const nuevoRol = currentRol === 'admin' ? 'empleado' : 'admin';
        const { error } = await supabase
            .from('perfiles')
            .update({ rol: nuevoRol })
            .eq('id', id);

        if (!error) {
            await fetchUsuarios();
        } else {
            console.error("Error al cambiar rol:", error);
            alert("Hubo un error al cambiar el rol. Revisa permisos.");
        }
    };

    const eliminarUsuario = async (id: string) => {
        if (!confirm("⚠️ ¿Estás seguro de eliminar este perfil? Esta acción es irreversible.")) return;
        const { error } = await supabase.from('perfiles').delete().eq('id', id);

        if (!error) {
            await fetchUsuarios();
        } else {
            console.error("Error al eliminar:", error);
            alert("No se pudo eliminar al usuario.");
        }
    };

    useEffect(() => {
        void fetchUsuarios(); // Usamos void para decirle a TypeScript que no esperamos a la promesa aquí
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
                    <p className="text-stone-500">Administra los accesos y roles del equipo.</p>
                </div>
                <Button onClick={() => void fetchUsuarios()} variant="outline" disabled={loading}>
                    <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
            </div>

            <div className="bg-card border rounded-lg overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-stone-50 dark:bg-stone-900/50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-sm text-stone-600 dark:text-stone-300">Usuario</th>
                            <th className="p-4 font-semibold text-sm text-stone-600 dark:text-stone-300">Email</th>
                            <th className="p-4 font-semibold text-sm text-stone-600 dark:text-stone-300">Rol</th>
                            <th className="p-4 font-semibold text-sm text-stone-600 dark:text-stone-300 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {usuarios.map((u) => (
                            <tr key={u.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/50 transition-colors">
                                <td className="p-4 text-sm font-medium">
                                    {u.nombre} {u.apellidos || ''}
                                </td>
                                <td className="p-4 text-sm text-stone-500">{u.email}</td>
                                <td className="p-4">
                                    <Badge variant={u.rol === 'admin' ? 'default' : 'secondary'} className="capitalize flex w-fit items-center gap-1">
                                        {u.rol === 'admin' ? <ShieldAlert className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                                        {u.rol}
                                    </Badge>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Button size="sm" variant="outline" onClick={() => void toggleRol(u.id, u.rol || 'empleado')}>
                                        Cambiar Rol
                                    </Button>
                                    <Button size="icon" variant="destructive" onClick={() => void eliminarUsuario(u.id)} title="Eliminar usuario">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {usuarios.length === 0 && !loading && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-stone-500">
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}