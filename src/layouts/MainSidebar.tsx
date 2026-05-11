import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar";
import {
    HardHat,
    LayoutDashboard,
    Users,
    UserCircle,
    LogOut,
    Settings,
    ChevronUp,
    Package // NUEVO ICONO PARA INVENTARIO
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MainSidebar() {
    const { rol, perfil, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="p-4 border-b border-sidebar-border">
                <Link to="/app/panel" className="flex items-center gap-3 px-2">
                    <img src="/logo.png" alt="Logo Voltio" className="h-8 w-auto object-contain" />
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive("/app/panel")} tooltip="Panel Principal">
                                    <Link to="/app/panel">
                                        <LayoutDashboard />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive("/app/obras")} tooltip="Obras en Curso">
                                    <Link to="/app/obras">
                                        <HardHat />
                                        <span>Obras</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* NUEVA OPCIÓN DE INVENTARIO */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive("/app/inventario")} tooltip="Inventario y Materiales">
                                    <Link to="/app/inventario">
                                        <Package />
                                        <span>Inventario</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {rol === 'admin' && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={isActive("/app/usuarios")} tooltip="Gestión de Usuarios">
                                        <Link to="/app/usuarios">
                                            <Users />
                                            <span>Usuarios</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={perfil?.avatar || undefined} alt={perfil?.nombre} />
                                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary uppercase font-bold">
                                            {perfil?.nombre?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                        <span className="truncate font-semibold">{perfil?.nombre} {perfil?.apellidos}</span>
                                        <span className="truncate text-[10px] text-stone-500 uppercase font-bold tracking-wider">{rol}</span>
                                    </div>
                                    <ChevronUp className="ml-auto group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="start" sideOffset={4}>
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={perfil?.avatar || undefined} />
                                            <AvatarFallback className="rounded-lg bg-primary/10 text-primary uppercase font-bold">
                                                {perfil?.nombre?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{perfil?.nombre}</span>
                                            <span className="truncate text-xs text-stone-500">{perfil?.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to="/app/perfil" className="cursor-pointer w-full">
                                        <UserCircle className="mr-2 h-4 w-4" />
                                        Mi Perfil
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Ajustes
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Cerrar Sesión
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}