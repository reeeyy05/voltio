import { create } from 'zustand';
import { supabase } from '@/Supabase/Client';

export type EstadoTarea = 'Pendiente' | 'Completada';

export interface Tarea {
    id: string;
    obra_id: string;
    titulo: string;
    descripcion: string | null;
    estado: EstadoTarea;
    asignado_a: string | null;
    creado_en: string;
    // Relación con la tabla perfiles para mostrar el nombre del asignado
    perfiles?: { nombre: string; apellidos: string } | null;
}

interface TareasState {
    tareas: Tarea[];
    isLoading: boolean;
    error: string | null;
    fetchTareasPorObra: (obraId: string) => Promise<void>;
    createTarea: (tarea: Omit<Tarea, 'id' | 'creado_en' | 'perfiles'>) => Promise<void>;
    updateEstadoTarea: (id: string, nuevoEstado: EstadoTarea) => Promise<void>;
    deleteTarea: (id: string) => Promise<void>;
}

export const useTareasStore = create<TareasState>((set, get) => ({
    tareas: [],
    isLoading: false,
    error: null,

    fetchTareasPorObra: async (obraId: string) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('tareas')
                .select(`
                    *,
                    perfiles:asignado_a (nombre, apellidos)
                `)
                .eq('obra_id', obraId)
                .order('creado_en', { ascending: false });

            if (error) throw error;
            set({ tareas: data as Tarea[] });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    createTarea: async (tarea) => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase.from('tareas').insert([tarea]);
            if (error) throw error;
            await get().fetchTareasPorObra(tarea.obra_id);
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateEstadoTarea: async (id: string, nuevoEstado: EstadoTarea) => {
        try {
            const { error } = await supabase.from('tareas').update({ estado: nuevoEstado }).eq('id', id);
            if (error) throw error;

            // Actualización optimista en local
            const { tareas } = get();
            set({ tareas: tareas.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t) });
        } catch (error: any) {
            console.error("Error al actualizar tarea:", error);
            throw error;
        }
    },

    deleteTarea: async (id: string) => {
        try {
            const { error } = await supabase.from('tareas').delete().eq('id', id);
            if (error) throw error;

            const { tareas } = get();
            set({ tareas: tareas.filter(t => t.id !== id) });
        } catch (error: any) {
            console.error("Error al eliminar tarea:", error);
            throw error;
        }
    }
}));