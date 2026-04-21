import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MainSidebar } from "./MainSidebar";
import { Outlet } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function MainLayout() {
    const { perfil } = useAuthStore();

    return (
        <SidebarProvider>
            <MainSidebar />
            <main className="flex-1 w-full bg-slate-50 min-h-screen flex flex-col">

                {/* HEADER */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">

                    {/* LADO IZQUIERDO: Botón para el menú y Logo de Voltio */}
                    <div className="flex items-center gap-4">
                        <SidebarTrigger />

                        <div className="flex items-center gap-2">
                            <img
                                src="/logo.png"
                                alt="Logo Voltio"
                                className="h-9 w-9 object-contain"
                            />
                            {/* El nombre de la aplicación al lado del logo */}
                            <span className="font-bold text-blue-600 text-xl tracking-tight">
                                VOLTIO
                            </span>
                        </div>
                    </div>

                    {/* LADO DERECHO: Información del Usuario Registrado */}
                    <div className="flex items-center gap-4">

                        {/* Nombre y Cargo del usuario */}
                        <div className="hidden md:flex flex-col text-right">
                            <span className="text-sm font-bold text-slate-900">
                                {perfil?.nombre || "Usuario"} {perfil?.apellidos || ""}
                            </span>
                            <span className="text-xs text-slate-500 capitalize">
                                {perfil?.rol || "Invitado"}
                            </span>
                        </div>

                        {/* EL CÍRCULO DE PERFIL */}
                        <Avatar className="h-10 w-10 border border-slate-200">
                            <AvatarImage src={perfil?.avatar || ""} alt="Foto de perfil" />
                        </Avatar>

                    </div>

                </header>

                {/* Zona central donde se irán cargando las páginas (Obras, Panel, etc.) */}
                <div className="p-6 flex-1 overflow-auto">
                    <Outlet />
                </div>

            </main>

        </SidebarProvider>
    );
}