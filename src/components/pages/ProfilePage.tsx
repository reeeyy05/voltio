import { useRef, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useTranslation } from "react-i18next";
import { supabase } from "@/Supabase/Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Camera, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const { perfil, logout, checkSession } = useAuthStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !perfil) return;

        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: t('profile.err_size') });
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setUploading(true);
        setMessage(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${perfil.id}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            const { error: updateError } = await supabase
                .from('perfiles')
                .update({ avatar: urlData.publicUrl })
                .eq('id', perfil.id);

            if (updateError) throw updateError;

            await checkSession();
            setMessage({ type: 'success', text: t('profile.success_upload') });
            setTimeout(() => setMessage(null), 3000);

        } catch (error) {
            console.error("Error:", error);
            setMessage({ type: 'error', text: t('profile.err_upload') });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{t('profile.title')}</h1>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium border transition-all ${message.type === 'error'
                        ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:border-red-900/50'
                        : 'bg-green-50 text-green-600 border-green-200 dark:bg-green-950/30 dark:border-green-900/50'
                    }`}>
                    {message.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                    {message.text}
                </div>
            )}

            <Card className="border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
                <CardHeader className="flex flex-col items-center gap-6 bg-stone-50/50 dark:bg-stone-900/50 pb-8 pt-10">
                    <div className="relative group">
                        <Avatar className="h-28 w-28 border-4 border-background shadow-md transition-transform duration-300 group-hover:scale-105">
                            <AvatarImage src={perfil?.avatar || ""} />
                            <AvatarFallback className="text-4xl bg-primary/10 text-primary uppercase font-bold">
                                {perfil?.nombre?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div
                            onClick={() => !uploading && fileInputRef.current?.click()}
                            className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${uploading ? 'opacity-100' : ''}`}
                        >
                            {uploading ? (
                                <Loader2 className="h-6 w-6 text-white animate-spin" />
                            ) : (
                                <>
                                    <Camera className="h-6 w-6 text-white mb-1" />
                                    <span className="text-[10px] text-white font-bold uppercase tracking-wider">{t('profile.change_photo')}</span>
                                </>
                            )}
                        </div>

                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>

                    <CardTitle className="text-3xl font-extrabold text-stone-900 dark:text-stone-50">
                        {perfil?.nombre} {perfil?.apellidos}
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">{t('profile.name')}</span>
                            <p className="p-3 bg-stone-50 dark:bg-stone-900/50 rounded-lg border border-stone-100 dark:border-stone-800 text-stone-800 dark:text-stone-200">
                                {perfil?.nombre}
                            </p>
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">{t('profile.surname')}</span>
                            <p className="p-3 bg-stone-50 dark:bg-stone-900/50 rounded-lg border border-stone-100 dark:border-stone-800 text-stone-800 dark:text-stone-200">
                                {perfil?.apellidos || '-'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">{t('profile.email')}</span>
                        <p className="p-3 bg-stone-50 dark:bg-stone-900/50 rounded-lg border border-stone-100 dark:border-stone-800 text-stone-800 dark:text-stone-200">
                            {perfil?.email}
                        </p>
                    </div>

                    <div className="pt-6 border-t border-stone-100 dark:border-stone-800">
                        <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto font-bold px-8">
                            <LogOut className="mr-2 h-4 w-4" /> {t('profile.logout')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}