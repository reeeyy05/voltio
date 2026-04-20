import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { HardHat, Wrench, Users, LayoutDashboard } from "lucide-react"

export default function App() {
  return (
    // SidebarProvider envuelve toda la app para gestionar el estado del menú
    <SidebarProvider>

      {/* 1. Definición del Menú Lateral */}
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg font-bold text-blue-600 mb-4 mt-2">
              ⚡ VOLTIO
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <LayoutDashboard />
                      <span>Panel Principal</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <HardHat />
                      <span>Obras en Curso</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <Users />
                      <span>Empleados</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <Wrench />
                      <span>Inventario Materiales</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* 2. Área de Contenido Principal (Lo que cambia según la ruta) */}
      <main className="flex-1 p-6 w-full">
        <div className="flex items-center gap-4 mb-6">
          {/* Este botón oculta/muestra el menú (en móvil se vuelve hamburguesa) */}
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Panel Principal</h1>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center text-gray-500">
          Aquí irá el contenido de las pantallas (Gráficos, Tablas, Formularios...)
        </div>
      </main>

    </SidebarProvider>
  )
}