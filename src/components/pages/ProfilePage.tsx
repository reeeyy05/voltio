import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const { perfil, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Mi Perfil</h1>

            <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4 bg-stone-50/50 dark:bg-stone-900/50">
                    <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
                        <AvatarImage src={perfil?.avatar || ""} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary uppercase font-bold">
                            {perfil?.nombre?.charAt(0)}{perfil?.apellidos?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl">{perfil?.nombre} {perfil?.apellidos}</CardTitle>
                        <p className="text-stone-500 flex items-center gap-1 mt-1">
                            <Shield className="h-4 w-4" />
                            <span className="capitalize">{perfil?.rol || 'Empleado'}</span>
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <span className="text-muted-foreground font-medium">Correo electrónico</span>
                            <p className="p-2 bg-stone-50 dark:bg-stone-900 rounded-md border">{perfil?.email}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-muted-foreground font-medium">ID de Sistema</span>
                            <p className="p-2 bg-stone-50 dark:bg-stone-900 rounded-md border font-mono text-xs truncate">
                                {perfil?.id}
                            </p>
                        </div>
                    </div>

                    <Button variant="destructive" onClick={handleLogout} className="w-full">
                        <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}