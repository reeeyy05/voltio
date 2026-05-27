import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Loader2, Save, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/Supabase/Client";

export default function ProfilePage() {
    const { perfil, logout, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Estado local para manejar los cambios antes de guardar
    const [formData, setFormData] = useState({ nombre: "", apellidos: "" });
    const [isDirty, setIsDirty] = useState(false);

    // Inicializar estado con datos del store cuando estén disponibles
    useEffect(() => {
        if (perfil) {
            setFormData({
                nombre: perfil.nombre || "",
                apellidos: perfil.apellidos || ""
            });
        }
    }, [perfil]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Comparamos con el perfil original para determinar si hubo cambios
        setIsDirty(value !== (perfil ? (perfil[name as keyof typeof perfil] || "") : ""));
    };

    const handleSave = async () => {
        if (!perfil) return;

        try {
            const { error } = await supabase
                .from('perfiles')
                .update({ nombre: formData.nombre, apellidos: formData.apellidos })
                .eq('id', perfil.id);

            if (error) throw error;

            toast.success("Perfil actualizado con éxito");
            setIsDirty(false);
            // Opcional: podrías forzar un refetch del perfil aquí
        } catch (error) {
            toast.error("Error al actualizar el perfil");
        }
    };

    if (!perfil) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">{t('profile.title')}</h1>

            <Card>
                <CardHeader className="flex flex-row items-center gap-4 pt-10">
                    <div className="relative">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={perfil.avatar || ""} />
                            <AvatarFallback>{perfil.nombre?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 p-1 bg-stone-100 rounded-full hover:bg-stone-200">
                            <Camera className="h-4 w-4" />
                        </button>
                    </div>
                    <div>
                        <CardTitle>{perfil.nombre} {perfil.apellidos}</CardTitle>
                        <p className="text-sm text-stone-500">{perfil.email}</p>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Nombre</Label>
                            <Input name="nombre" value={formData.nombre} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1">
                            <Label>Apellidos</Label>
                            <Input name="apellidos" value={formData.apellidos} onChange={handleInputChange} />
                        </div>
                    </div>

                    {/* Botón de guardar condicional */}
                    {isDirty && (
                        <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                            <Button onClick={handleSave} className="w-full">
                                <Save className="mr-2 h-4 w-4" /> Guardar cambios
                            </Button>
                        </div>
                    )}

                    <div className="pt-6 border-t">
                        <Button variant="destructive" onClick={() => { logout(); navigate("/"); }} className="w-full">
                            <LogOut className="mr-2 h-4 w-4" /> {t('profile.logout')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}