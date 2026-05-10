import { create } from 'zustand';
import { supabase } from '@/Supabase/Client';

export type EstadoObra = 'En curso' | 'Finalizada';

export interface Obra {
    id: string;
    nombre: string;
    estado: EstadoObra;
    creado_en: string;
}

interface ObrasState {
    obras: Obra[];
    isLoading: boolean;
    error: string | null;
    fetchObras: () => Promise<void>;
    createObra: (nombre: string) => Promise<void>;
    updateEstadoObra: (id: string, nuevoEstado: EstadoObra) => Promise<void>;
    deleteObra: (id: string) => Promise<void>;
}

export const useObrasStore = create<ObrasState>((set, get) => ({
    obras: [],
    isLoading: false,
    error: null,

    // LEER OBRAS
    fetchObras: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('obras')
                .select('*')
                .order('creado_en', { ascending: false }); // Las más nuevas primero

            if (error) throw error;
            set({ obras: data as Obra[] });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // CREAR OBRA
    createObra: async (nombre: string) => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase
                .from('obras')
                .insert([{ nombre, estado: 'En curso' }]);

            if (error) throw error;
            await get().fetchObras(); // Recargamos la lista
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // ACTUALIZAR ESTADO
    updateEstadoObra: async (id: string, nuevoEstado: EstadoObra) => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase
                .from('obras')
                .update({ estado: nuevoEstado })
                .eq('id', id);

            if (error) throw error;

            // Actualizamos la vista local sin hacer otra petición
            const { obras } = get();
            set({ obras: obras.map(o => o.id === id ? { ...o, estado: nuevoEstado } : o) });
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // ELIMINAR OBRA (Solo admin)
    deleteObra: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase
                .from('obras')
                .delete()
                .eq('id', id);

            if (error) throw error;
            const { obras } = get();
            set({ obras: obras.filter(o => o.id !== id) });
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));