import { create } from 'zustand';
import { supabase } from '@/Supabase/Client';

// Ajustado al Check SQL: ('Pendiente', 'En curso', 'Finalizada')
export type EstadoTarea = 'Pendiente' | 'En curso' | 'Finalizada';

export interface Tarea {
    id: string;
    obra_id: string;
    // Ajustado a los nombres de tu tabla en SQL
    descripcion: string;
    estado: EstadoTarea;
    empleado_id: string;
    // Relación con Obras (para saber a qué obra pertenece)
    obras?: { nombre: string } | null;
    // Relación con Perfiles (para saber quién la tiene)
    perfiles?: { nombre: string; apellidos: string } | null;
}

interface TareasState {
    tareas: Tarea[];
    misTareas: Tarea[]; // Nuevo: Lista global de tareas del empleado
    isLoading: boolean;
    error: string | null;
    fetchTareasPorObra: (obraId: string) => Promise<void>;
    fetchTareasDelEmpleado: (empleadoId: string) => Promise<void>; // NUEVA FUNCIÓN
    createTarea: (tarea: Omit<Tarea, 'id' | 'obras' | 'perfiles'>) => Promise<void>;
    updateEstadoTarea: (id: string, nuevoEstado: EstadoTarea) => Promise<void>;
    deleteTarea: (id: string) => Promise<void>;
}

export const useTareasStore = create<TareasState>((set, get) => ({
    tareas: [],
    misTareas: [],
    isLoading: false,
    error: null,

    fetchTareasPorObra: async (obraId: string) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('tareas')
                .select(`
                    *,
                    perfiles:empleado_id (nombre, apellidos)
                `)
                .eq('obra_id', obraId);

            if (error) throw error;
            set({ tareas: data as Tarea[] });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchTareasDelEmpleado: async (empleadoId: string) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('tareas')
                .select(`
                    *,
                    obras:obra_id (nombre)
                `)
                .eq('empleado_id', empleadoId);

            if (error) throw error;
            set({ misTareas: data as Tarea[] });
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

            // Actualización optimista en local para ambas listas
            const { tareas, misTareas } = get();
            set({
                tareas: tareas.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t),
                misTareas: misTareas.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t)
            });
        } catch (error: any) {
            console.error("Error al actualizar tarea:", error);
            throw error;
        }
    },

    deleteTarea: async (id: string) => {
        try {
            const { error } = await supabase.from('tareas').delete().eq('id', id);
            if (error) throw error;

            const { tareas, misTareas } = get();
            set({
                tareas: tareas.filter(t => t.id !== id),
                misTareas: misTareas.filter(t => t.id !== id)
            });
        } catch (error: any) {
            console.error("Error al eliminar tarea:", error);
            throw error;
        }
    }
}));