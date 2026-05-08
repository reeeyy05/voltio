import { create } from 'zustand';
import { supabase } from '@/Supabase/Client';
import type { Perfil, RolUsuario } from './authStore';

interface AdminState {
    usuarios: Perfil[];
    isLoading: boolean;
    error: string | null;
    fetchUsuarios: () => Promise<void>;
    updateRolUsuario: (id: string, nuevoRol: RolUsuario) => Promise<void>;
    deleteUsuario: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
    usuarios: [],
    isLoading: false,
    error: null,

    // 1. LEER TODOS LOS USUARIOS (Read)
    fetchUsuarios: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('perfiles')
                .select('*')
                .order('nombre', { ascending: true }); // Ordenados alfabéticamente

            if (error) throw error;
            set({ usuarios: data as Perfil[] });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // 2. ACTUALIZAR ROL (Update)
    updateRolUsuario: async (id: string, nuevoRol: RolUsuario) => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase
                .from('perfiles')
                .update({ rol: nuevoRol })
                .eq('id', id);

            if (error) throw error;

            // Actualizamos la tabla localmente sin tener que recargar la página
            const { usuarios } = get();
            set({
                usuarios: usuarios.map(u => u.id === id ? { ...u, rol: nuevoRol } : u)
            });
        } catch (error: any) {
            set({ error: error.message });
            throw error; // Lanzamos el error para que la UI pueda mostrar una alerta
        } finally {
            set({ isLoading: false });
        }
    },

    // 3. ELIMINAR USUARIO (Delete)
    deleteUsuario: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            // Borramos el perfil. Como tu tabla tiene ON DELETE CASCADE o RLS estricto,
            // esto dejará al usuario sin acceso a la aplicación.
            const { error } = await supabase
                .from('perfiles')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Quitamos al usuario de la lista localmente
            const { usuarios } = get();
            set({
                usuarios: usuarios.filter(u => u.id !== id)
            });
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));