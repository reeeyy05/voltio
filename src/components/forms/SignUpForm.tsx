import { supabase } from '@/Supabase/Client';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export const SignUpForm: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        nombre,
                        apellidos,
                        rol: 'empleado'
                    }
                }
            });

            if (signUpError) throw signUpError;
            setSuccess(true);

        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al intentar registrar la cuenta.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center text-center space-y-6 p-6">
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100">¡Registro completado!</h3>
                    <p className="text-stone-500 dark:text-stone-400">Tu cuenta ha sido creada exitosamente. Ya puedes acceder al panel.</p>
                </div>
                <Button
                    onClick={() => navigate('/login')}
                    className="w-full bg-primary text-primary-foreground font-bold text-base py-6 shadow-md hover:shadow-lg dark:shadow-none transition-all mt-4"
                >
                    Ir a Iniciar Sesión
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSignUp} className="space-y-6">
            {error && (
                <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-start gap-2 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-stone-800 dark:text-stone-200 font-medium">Nombre</Label>
                    <Input
                        id="nombre"
                        type="text"
                        required
                        placeholder="Ej: Juan"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        disabled={loading}
                        className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="apellidos" className="text-stone-800 dark:text-stone-200 font-medium">Apellidos</Label>
                    <Input
                        id="apellidos"
                        type="text"
                        required
                        placeholder="Ej: Pérez"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        disabled={loading}
                        className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-800 dark:text-stone-200 font-medium">Correo electrónico</Label>
                <Input
                    id="email"
                    type="email"
                    required
                    placeholder="ejemplo@voltio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-stone-800 dark:text-stone-200 font-medium">Contraseña</Label>
                <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
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
                className="w-full bg-primary text-primary-foreground font-bold text-base py-6 shadow-md hover:shadow-lg dark:shadow-none transition-all"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Procesando...
                    </>
                ) : (
                    'Crear Cuenta'
                )}
            </Button>

            <div className="text-center mt-4 text-sm text-stone-600 dark:text-stone-400">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                    Inicia sesión aquí
                </Link>
            </div>
        </form>
    );
};