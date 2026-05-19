import { create } from 'zustand';
import { supabase } from '@/Supabase/Client';

export type EstadoTarea = 'Pendiente' | 'En curso' | 'Finalizada';

export interface Tarea {
    id: string;
    obra_id: string;
    descripcion: string;
    estado: EstadoTarea;
    empleado_id: string;
    obras?: { nombre: string } | null;
    perfiles?: { nombre: string; apellidos: string } | null;
}

interface TareasState {
    tareas: Tarea[];
    misTareas: Tarea[];
    todasLasTareas: Tarea[]; // NUEVO: Para el admin
    isLoading: boolean;
    error: string | null;
    fetchTareasPorObra: (obraId: string) => Promise<void>;
    fetchTareasDelEmpleado: (empleadoId: string) => Promise<void>;
    fetchAllTareas: () => Promise<void>; // NUEVO: Para el gráfico
    createTarea: (tarea: Omit<Tarea, 'id' | 'obras' | 'perfiles'>) => Promise<void>;
    updateEstadoTarea: (id: string, nuevoEstado: EstadoTarea) => Promise<void>;
    deleteTarea: (id: string) => Promise<void>;
}

export const useTareasStore = create<TareasState>((set, get) => ({
    tareas: [],
    misTareas: [],
    todasLasTareas: [], // Inicializamos vacío
    isLoading: false,
    error: null,

    fetchTareasPorObra: async (obraId: string) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('tareas')
                .select(`*, perfiles:empleado_id (nombre, apellidos)`)
                .eq('obra_id', obraId);
            if (error) throw error;
            set({ tareas: data as Tarea[] });
        } catch (error: any) { set({ error: error.message }); }
        finally { set({ isLoading: false }); }
    },

    fetchTareasDelEmpleado: async (empleadoId: string) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('tareas')
                .select(`*, obras:obra_id (nombre)`)
                .eq('empleado_id', empleadoId);
            if (error) throw error;
            set({ misTareas: data as Tarea[] });
        } catch (error: any) { set({ error: error.message }); }
        finally { set({ isLoading: false }); }
    },

    // NUEVA FUNCIÓN PARA EL ADMIN
    fetchAllTareas: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('tareas')
                .select(`*, perfiles:empleado_id (nombre, apellidos)`);
            if (error) throw error;
            set({ todasLasTareas: data as Tarea[] });
        } catch (error: any) { set({ error: error.message }); }
        finally { set({ isLoading: false }); }
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
        } finally { set({ isLoading: false }); }
    },

    updateEstadoTarea: async (id: string, nuevoEstado: EstadoTarea) => {
        try {
            const { error } = await supabase.from('tareas').update({ estado: nuevoEstado }).eq('id', id);
            if (error) throw error;
            const { tareas, misTareas, todasLasTareas } = get();
            set({
                tareas: tareas.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t),
                misTareas: misTareas.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t),
                todasLasTareas: todasLasTareas.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t)
            });
        } catch (error: any) { throw error; }
    },

    deleteTarea: async (id: string) => {
        try {
            const { error } = await supabase.from('tareas').delete().eq('id', id);
            if (error) throw error;
            const { tareas, misTareas, todasLasTareas } = get();
            set({
                tareas: tareas.filter(t => t.id !== id),
                misTareas: misTareas.filter(t => t.id !== id),
                todasLasTareas: todasLasTareas.filter(t => t.id !== id)
            });
        } catch (error: any) { throw error; }
    }
}));