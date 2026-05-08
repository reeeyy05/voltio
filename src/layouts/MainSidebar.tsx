import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { HardHat, LayoutDashboard, Users, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function MainSidebar() {
    const { rol } = useAuthStore();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <Sidebar>
            {/* LOGO EN EL SIDEBAR: Ahora el logo es la cabecera del menú */}
            <SidebarHeader className="p-4 border-b border-sidebar-border">
                <Link to="/app/panel" className="flex items-center justify-center">
                    <img
                        src="/logo.png"
                        alt="Logo Voltio"
                        className="h-12 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform"
                    />
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-bold text-stone-500 tracking-widest mb-2 mt-2 uppercase">
                        Gestión
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive("/app/panel")}>
                                    <Link to="/app/panel">
                                        <LayoutDashboard className="h-5 w-5" />
                                        <span>Panel Principal</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive("/app/obras")}>
                                    <Link to="/app/obras">
                                        <HardHat className="h-5 w-5" />
                                        <span>Obras en Curso</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {rol === 'admin' && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={isActive("/app/usuarios")}>
                                        <Link to="/app/usuarios">
                                            <Users className="h-5 w-5" />
                                            <span>Gestión de Usuarios</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive("/app/perfil")}>
                                    <Link to="/app/perfil">
                                        <UserCircle className="h-5 w-5" />
                                        <span>Mi Perfil</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}