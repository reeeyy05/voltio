import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase'; // Importamos el "cable" que acabas de crear

// DEFINICIÓN DE TIPOS
export type RolUsuario = 'admin' | 'gerente' | 'empleado' | null;

export interface Perfil {
    id: string;
    nombre: string;
    apellidos: string | null;
    rol: RolUsuario;
    email: string;
    avatar: string | null;
}

// Lo que va a recordar nuestro cerebro central
interface AuthState {
    session: Session | null;
    perfil: Perfil | null;
    rol: RolUsuario;
    isLoading: boolean;
    checkSession: () => Promise<void>;
    logout: () => Promise<void>;
}

// ==========================================
// 2. CREACIÓN DEL CEREBRO (Zustand)
export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    perfil: null,
    rol: null,
    isLoading: true,

    // Esta función se ejecutará al abrir la web para ver si ya estábamos dentro
    checkSession: async () => {
        try {
            set({ isLoading: true });

            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Si hay sesión, descargamos los datos de su perfil
                const { data: perfilData } = await supabase
                    .from('perfiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                set({
                    session,
                    perfil: perfilData as Perfil,
                    rol: (perfilData?.rol as RolUsuario) || null
                });
            }
        } catch (error) {
            console.error("Error al verificar sesión:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    // Función para cerrar la sesión y borrar la memoria
    logout: async () => {
        await supabase.auth.signOut();
        set({ session: null, perfil: null, rol: null });
    }
}));