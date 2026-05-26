import { create } from 'zustand';
import { supabase } from '@/Supabase/Client';

export interface Material {
    id: string;
    nombre: string;
    descripcion: string | null;
    cantidad: number;
    unidad: string;
    creado_en: string;
}

interface InventarioState {
    materiales: Material[];
    isLoading: boolean;
    error: string | null;
    fetchMateriales: () => Promise<void>;
    createMaterial: (material: Omit<Material, 'id' | 'creado_en'>) => Promise<void>;
    createMaterialesBulk: (materiales: Omit<Material, 'id' | 'creado_en'>[]) => Promise<void>;
    updateCantidad: (id: string, variacion: number) => Promise<void>;
    deleteMaterial: (id: string) => Promise<void>;
    deleteMaterialesBulk: (ids: string[]) => Promise<void>; // NUEVO
}

export const useInventarioStore = create<InventarioState>((set, get) => ({
    materiales: [],
    isLoading: false,
    error: null,

    fetchMateriales: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('materiales')
                .select('*')
                .order('nombre', { ascending: true });

            if (error) throw error;
            set({ materiales: data as Material[] });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    createMaterial: async (material) => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase.from('materiales').insert([material]);
            if (error) throw error;
            await get().fetchMateriales();
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    createMaterialesBulk: async (materiales) => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase.from('materiales').insert(materiales);
            if (error) throw error;
            await get().fetchMateriales();
        } catch (error: any) {
            console.error("Error en carga masiva:", error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateCantidad: async (id: string, variacion: number) => {
        try {
            const material = get().materiales.find(m => m.id === id);
            if (!material) return;

            const nuevaCantidad = Math.max(0, material.cantidad + variacion);

            const { error } = await supabase
                .from('materiales')
                .update({ cantidad: nuevaCantidad })
                .eq('id', id);

            if (error) throw error;

            const { materiales } = get();
            set({ materiales: materiales.map(m => m.id === id ? { ...m, cantidad: nuevaCantidad } : m) });
        } catch (error: any) {
            console.error("Error al actualizar cantidad:", error);
            throw error;
        }
    },

    deleteMaterial: async (id: string) => {
        try {
            const { error } = await supabase.from('materiales').delete().eq('id', id);
            if (error) throw error;

            const { materiales } = get();
            set({ materiales: materiales.filter(m => m.id !== id) });
        } catch (error: any) {
            console.error("Error al eliminar material:", error);
            throw error;
        }
    },

    deleteMaterialesBulk: async (ids: string[]) => {
        try {
            const { error } = await supabase.from('materiales').delete().in('id', ids);
            if (error) throw error;

            const { materiales } = get();
            set({ materiales: materiales.filter(m => !ids.includes(m.id)) });
        } catch (error: any) {
            console.error("Error al eliminar materiales masivamente:", error);
            throw error;
        }
    }
}));