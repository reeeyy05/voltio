import { supabase } from '@/Supabase/Client';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { PasswordInput } from '../ui/PasswordInput';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export const SignUpForm: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { checkSession } = useAuthStore();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { nombre, apellidos } }
            });

            if (error) throw error;

            // Al estar desactivada la confirmación por email, Supabase nos da sesión directa.
            // Forzamos al store global a leer esa sesión y obtener el perfil:
            await checkSession();

            // Notificamos y redirigimos sin pasar por la pantalla de login
            toast.success("¡Registro exitoso! Accediendo a Voltio...");
            navigate('/app');

        } catch (err: any) {
            setError(err.message);
            setLoading(false); // Solo paramos la carga si hay error
        }
    };

    return (
        <form onSubmit={handleSignUp} className="space-y-4 w-full">
            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> {error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-stone-800 dark:text-stone-200 font-medium">{t('auth.signup_name')}</Label>
                    <Input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="apellidos" className="text-stone-800 dark:text-stone-200 font-medium">{t('auth.signup_surname')}</Label>
                    <Input id="apellidos" value={apellidos} onChange={e => setApellidos(e.target.value)} required className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-800 dark:text-stone-200 font-medium">{t('login.email')}</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-stone-800 dark:text-stone-200 font-medium">{t('auth.signup_pass_hint')}</Label>
                <PasswordInput
                    id="password"
                    placeholder={t('login.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm"
                />
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground font-bold text-base py-6 shadow-md hover:shadow-lg dark:shadow-none transition-all mt-4"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t('auth.signup_loading')}
                    </>
                ) : (
                    t('auth.signup_submit')
                )}
            </Button>

            <div className="text-center mt-6 text-sm text-stone-600 dark:text-stone-400">
                {t('auth.signup_already')}{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                    {t('auth.signup_login_link')}
                </Link>
            </div>

            <div className="text-center mt-4 pt-4 border-t border-stone-150 dark:border-stone-800 flex flex-col items-center justify-center">
                <Button variant="ghost" size="sm" asChild className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 gap-2 w-full">
                    <Link to="/">
                        <ArrowLeft className="h-4 w-4" />
                        Volver a la página de inicio
                    </Link>
                </Button>
            </div>
        </form>
    );
};