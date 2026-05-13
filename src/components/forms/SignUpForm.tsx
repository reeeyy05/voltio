import { supabase } from '@/Supabase/Client';
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, CheckCircle2, Upload, User } from 'lucide-react';
import { PasswordInput } from '../ui/PasswordInput';
import { useAuthStore } from '@/stores/authStore';

export const SignUpForm: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { checkSession } = useAuthStore();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError(t('auth.err_img_size'));
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]{2,50}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!nameRegex.test(nombre)) {
            setError(t('auth.err_name'));
            setLoading(false);
            return;
        }

        if (!emailRegex.test(email)) {
            setError(t('auth.err_email'));
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError(t('auth.err_pass'));
            setLoading(false);
            return;
        }

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { nombre, apellidos }
                }
            });

            if (authError) throw authError;

            if (avatarFile && authData.user) {
                const fileExt = avatarFile.name.split('.').pop();
                const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, avatarFile, { cacheControl: '3600', upsert: false });

                if (!uploadError) {
                    const { data: urlData } = supabase.storage
                        .from('avatars')
                        .getPublicUrl(fileName);

                    await supabase
                        .from('perfiles')
                        .update({ avatar: urlData.publicUrl })
                        .eq('id', authData.user.id);
                }
            }

            await checkSession();

            setSuccess(true);
            setTimeout(() => {
                navigate('/app/panel');
            }, 1500);

        } catch (err: any) {
            setError(err.message || t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
                <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{t('auth.signup_success_title')}</h3>
                <p className="text-stone-600 dark:text-stone-400">{t('auth.signup_success_desc')}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSignUp} className="space-y-5">
            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-md flex items-start gap-2 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="flex flex-col items-center justify-center mb-6">
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-24 w-24 rounded-full border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-primary hover:bg-stone-100 transition-all shadow-sm"
                >
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Vista previa" className="h-full w-full object-cover" />
                    ) : (
                        <div className="text-stone-400 flex flex-col items-center">
                            <User className="h-8 w-8 mb-1 opacity-50" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">{t('auth.signup_photo')}</span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="h-6 w-6 text-white mb-1" />
                        <span className="text-[10px] text-white font-bold uppercase">{t('auth.signup_upload')}</span>
                    </div>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/webp"
                    className="hidden"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="nombre" className="text-stone-800 dark:text-stone-200 font-medium">{t('auth.signup_name')}</Label>
                    <Input
                        id="nombre"
                        placeholder={t('auth.signup_name_ph')}
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        disabled={loading}
                        className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="apellidos" className="text-stone-800 dark:text-stone-200 font-medium">{t('auth.signup_surname')}</Label>
                    <Input
                        id="apellidos"
                        placeholder={t('auth.signup_surname_ph')}
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        disabled={loading}
                        className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="email" className="text-stone-800 dark:text-stone-200 font-medium">{t('login.email')}</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder={t('login.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm"
                />
            </div>

            <div className="space-y-1.5">
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
        </form>
    );
};