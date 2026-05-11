import { create } from 'zustand';
import { supabase } from '@/Supabase/Client';

export type EstadoObra = 'En curso' | 'Finalizada';

export interface Obra {
    id: string;
    nombre: string;
    descripcion?: string | null; // NUEVO CAMPO
    estado: EstadoObra;
    creado_en: string;
}

interface ObrasState {
    obras: Obra[];
    isLoading: boolean;
    error: string | null;
    fetchObras: () => Promise<void>;
    createObra: (nombre: string, descripcion?: string) => Promise<void>; // Actualizado
    updateEstadoObra: (id: string, nuevoEstado: EstadoObra) => Promise<void>;
    deleteObra: (id: string) => Promise<void>;
}

export const useObrasStore = create<ObrasState>((set, get) => ({
    obras: [],
    isLoading: false,
    error: null,

    // Ahora todos ven todas las obras de la empresa
    fetchObras: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('obras')
                .select('*')
                .order('creado_en', { ascending: false });

            if (error) throw error;
            set({ obras: data as Obra[] });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    createObra: async (nombre: string, descripcion?: string) => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase
                .from('obras')
                .insert([{ nombre, descripcion, estado: 'En curso' }]);

            if (error) throw error;
            await get().fetchObras();
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateEstadoObra: async (id: string, nuevoEstado: EstadoObra) => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase
                .from('obras')
                .update({ estado: nuevoEstado })
                .eq('id', id);

            if (error) throw error;
            const { obras } = get();
            set({ obras: obras.map(o => o.id === id ? { ...o, estado: nuevoEstado } : o) });
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

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