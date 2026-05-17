import { create } from 'zustand';
import { supabase } from '@/Supabase/Client';
import type { Perfil, RolUsuario } from './authStore';

interface AdminState {
    usuarios: Perfil[];
    isLoading: boolean;
    error: string | null;
    fetchUsuarios: () => Promise<void>;
    updateRolUsuario: (id: string, nuevoRol: RolUsuario) => Promise<void>;
    updateDetallesUsuario: (id: string, nombre: string, apellidos: string) => Promise<void>;
    deleteUsuario: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
    usuarios: [],
    isLoading: false,
    error: null,

    fetchUsuarios: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('perfiles')
                .select('*')
                .order('nombre', { ascending: true });

            if (error) throw error;
            set({ usuarios: data as Perfil[] });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateRolUsuario: async (id: string, nuevoRol: RolUsuario) => {
        try {
            const { error } = await supabase.from('perfiles').update({ rol: nuevoRol }).eq('id', id);
            if (error) throw error;

            const { usuarios } = get();
            set({ usuarios: usuarios.map(u => u.id === id ? { ...u, rol: nuevoRol } : u) });
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    },

    // NUEVO: Función Update para el CRUD
    updateDetallesUsuario: async (id: string, nombre: string, apellidos: string) => {
        try {
            const { error } = await supabase.from('perfiles').update({ nombre, apellidos }).eq('id', id);
            if (error) throw error;

            const { usuarios } = get();
            set({ usuarios: usuarios.map(u => u.id === id ? { ...u, nombre, apellidos } : u) });
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    },

    deleteUsuario: async (id: string) => {
        try {
            const { error } = await supabase.from('perfiles').delete().eq('id', id);
            if (error) throw error;

            const { usuarios } = get();
            set({ usuarios: usuarios.filter(u => u.id !== id) });
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    }
}));