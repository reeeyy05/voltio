import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { HardHat, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export function MainSidebar() {
    return (
        // La caja principal del menú lateral
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    {/* Título de la sección de navegación */}
                    <SidebarGroupLabel className="text-sm font-semibold text-slate-500 mb-2 mt-4">
                        MENÚ PRINCIPAL
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>

                            {/* Botón: Panel de control */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link to="/app/panel">
                                        <LayoutDashboard />
                                        <span>Panel Principal</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Botón: Gestión de obras */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link to="/app/obras">
                                        <HardHat />
                                        <span>Obras en Curso</span>
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