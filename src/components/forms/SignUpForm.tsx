import { supabase } from '@/Supabase/Client';
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, CheckCircle2, Upload, User } from 'lucide-react';
import { PasswordInput } from '../ui/PasswordInput';

export const SignUpForm: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // NUEVO: Estados para el avatar
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    // NUEVO: Manejador para previsualizar la foto antes de subirla
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validamos que sea una imagen y no pese demasiado (ej. máx 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('La imagen no debe superar los 2MB');
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

        // 1. Validaciones Regex (Frontend)
        const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]{2,50}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!nameRegex.test(nombre)) {
            setError("El nombre ingresado no es válido.");
            setLoading(false);
            return;
        }

        if (!emailRegex.test(email)) {
            setError("El correo electrónico no es válido.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            setLoading(false);
            return;
        }

        try {
            // 2. CREAR USUARIO (El Trigger de la BBDD le pondrá el avatar por defecto)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { nombre, apellidos }
                }
            });

            if (authError) throw authError;

            // 3. SUBIDA SEGURA DEL AVATAR (Solo si eligió foto y la cuenta se creó bien)
            if (avatarFile && authData.user) {
                const fileExt = avatarFile.name.split('.').pop();
                // Nombramos el archivo con el ID del usuario para tener el bucket ordenado
                const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, avatarFile, { cacheControl: '3600', upsert: false });

                if (uploadError) {
                    console.error("Error subiendo foto:", uploadError);
                    // No cortamos la ejecución porque la cuenta ya está creada, solo avisamos
                    setError("Cuenta creada, pero hubo un error al subir la foto de perfil.");
                } else {
                    // Obtenemos la URL pública de la imagen que acabamos de subir
                    const { data: urlData } = supabase.storage
                        .from('avatars')
                        .getPublicUrl(fileName);

                    // Actualizamos la tabla perfiles con la foto real (pisando la de por defecto)
                    await supabase
                        .from('perfiles')
                        .update({ avatar: urlData.publicUrl })
                        .eq('id', authData.user.id);
                }
            }

            // 4. ÉXITO
            setSuccess(true);
            setTimeout(() => {
                navigate('/app/panel');
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Error inesperado al crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
                <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100">¡Cuenta creada!</h3>
                <p className="text-stone-600 dark:text-stone-400">Redirigiendo a tu panel...</p>
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

            {/* SECCIÓN DEL AVATAR VISUAL */}
            <div className="flex flex-col items-center justify-center mb-6">
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-24 w-24 rounded-full border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-primary hover:bg-stone-100 transition-all shadow-sm"
                    title="Haz clic para subir tu foto"
                >
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Vista previa" className="h-full w-full object-cover" />
                    ) : (
                        <div className="text-stone-400 flex flex-col items-center">
                            <User className="h-8 w-8 mb-1 opacity-50" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">Foto</span>
                        </div>
                    )}

                    {/* Efecto hover sobre la imagen */}
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="h-6 w-6 text-white mb-1" />
                        <span className="text-[10px] text-white font-bold uppercase">Subir</span>
                    </div>
                </div>

                {/* Input de archivo oculto */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/webp"
                    className="hidden"
                />
            </div>

            {/* RESTO DEL FORMULARIO */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="nombre" className="text-stone-800 dark:text-stone-200 font-medium">Nombre</Label>
                    <Input
                        id="nombre"
                        required
                        placeholder="Juan"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        disabled={loading}
                        className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="apellidos" className="text-stone-800 dark:text-stone-200 font-medium">Apellidos</Label>
                    <Input
                        id="apellidos"
                        required
                        placeholder="Pérez"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        disabled={loading}
                        className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="email" className="text-stone-800 dark:text-stone-200 font-medium">Correo Electrónico</Label>
                <Input
                    id="email"
                    type="email"
                    required
                    placeholder="juan@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm"
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="password" className="text-stone-800 dark:text-stone-200 font-medium">Contraseña</Label>
                <PasswordInput
                    id="password"
                    required
                    placeholder="••••••••"
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
                        Creando cuenta...
                    </>
                ) : (
                    'Crear Cuenta'
                )}
            </Button>

            <div className="text-center mt-6 text-sm text-stone-600 dark:text-stone-400">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                    Inicia sesión aquí
                </Link>
            </div>
        </form>
    );
};