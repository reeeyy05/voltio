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
    Package
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useTranslation } from "react-i18next"; // Importamos el hook de traducción
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
    const { t } = useTranslation(); // Inicializamos la traducción
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
                    <span className="font-bold text-xl tracking-tight text-stone-800 dark:text-stone-100 group-data-[collapsible=icon]:hidden">
                        VOLTIO
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Dashboard */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive("/app/panel")} tooltip={t('sidebar.dashboard')}>
                                    <Link to="/app/panel">
                                        <LayoutDashboard />
                                        <span>{t('sidebar.dashboard')}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Obras */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive("/app/obras")} tooltip={t('sidebar.works')}>
                                    <Link to="/app/obras">
                                        <HardHat />
                                        <span>{t('sidebar.works')}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Inventario */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive("/app/inventario")} tooltip={t('sidebar.inventory')}>
                                    <Link to="/app/inventario">
                                        <Package />
                                        <span>{t('sidebar.inventory')}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Usuarios (Solo Admin) */}
                            {rol === 'admin' && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={isActive("/app/usuarios")} tooltip={t('sidebar.users')}>
                                        <Link to="/app/usuarios">
                                            <Users />
                                            <span>{t('sidebar.users')}</span>
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
                                        {/* Traducción dinámica del rol */}
                                        <span className="truncate text-[10px] text-stone-500 uppercase font-bold tracking-wider">
                                            {rol ? t(`roles.${rol}`) : ''}
                                        </span>
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
                                        {t('sidebar.profile')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    {t('sidebar.settings')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {t('sidebar.logout')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}