import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/Supabase/Client';

export type RolUsuario = 'admin' | 'empleado' | null;

export interface Perfil {
    id: string;
    nombre: string;
    apellidos: string | null;
    rol: RolUsuario;
    email: string;
    avatar: string | null;
}

interface AuthState {
    session: Session | null;
    perfil: Perfil | null;
    rol: RolUsuario;
    isLoading: boolean;
    error: string | null;
    checkSession: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

// AÑADIDO: Incluimos 'get' para poder leer el estado actual dentro de las funciones
export const useAuthStore = create<AuthState>((set, get) => ({
    session: null,
    perfil: null,
    rol: null,
    isLoading: false,
    error: null,

    checkSession: async () => {
        // FIX: Solo mostramos la pantalla de carga si NO hay una sesión activa.
        // Si ya estamos dentro (ej: al cambiar de pestaña), la comprobación se hace en segundo plano.
        if (!get().session) {
            set({ isLoading: true });
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
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
            } else {
                // Si la sesión caducó mientras estábamos fuera, limpiamos todo
                set({ session: null, perfil: null, rol: null });
            }
        } catch (error) {
            console.error("Error al verificar sesión:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            if (data.session) {
                const { data: perfilData, error: profileError } = await supabase
                    .from('perfiles')
                    .select('*')
                    .eq('id', data.session.user.id)
                    .single();

                if (profileError) console.error("Error al cargar perfil:", profileError);

                set({
                    session: data.session,
                    perfil: (perfilData as Perfil) || null,
                    rol: (perfilData?.rol as RolUsuario) || null
                });
            }
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        await supabase.auth.signOut();
        set({ session: null, perfil: null, rol: null });
    }
}));