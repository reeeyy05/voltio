import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { PasswordInput } from '../ui/PasswordInput';

export function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Extraemos estado y acciones del Store global
    const { signIn, isLoading, error } = useAuthStore();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signIn(email, password);
            navigate('/app/panel');
        } catch (err) { }
    };

    return (
        <form onSubmit={handleSignIn} className="space-y-4 w-full max-w-sm">
            {error && (
                <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-start gap-2 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-800 dark:text-stone-200">
                    Correo electrónico
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@voltio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="bg-background focus-visible:ring-primary"
                />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-stone-800 dark:text-stone-200">
                        Contraseña
                    </Label>
                </div>
                <PasswordInput
                    id="password"
                    placeholder="Introduce tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
                <a href="/reset-password" className="text-sm font-medium text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                </a>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando sesión...
                    </>
                ) : (
                    'Entrar'
                )}
            </Button>
        </form>
    );
}