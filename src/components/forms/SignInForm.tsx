import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';

export function SignInForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { signIn, isLoading, error } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signIn(email, password);
            navigate('/app');
        } catch (err) {
            // El error es manejado por el store y renderizado en la UI
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {error && (
                <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-start gap-2 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>Credenciales incorrectas o error de conexión.</span>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-800 dark:text-stone-200 font-medium">
                    {t('login.email')}
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder={t('login.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm"
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-stone-800 dark:text-stone-200 font-medium">
                        {t('login.password')}
                    </Label>
                    <Link
                        to="/reset-password"
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        {t('login.forgot_password')}
                    </Link>
                </div>
                <Input
                    id="password"
                    type="password"
                    placeholder={t('login.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm"
                />
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground font-bold text-base py-6 shadow-md hover:shadow-lg dark:shadow-none transition-all"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verificando...
                    </>
                ) : (
                    t('login.submit')
                )}
            </Button>
        </form>
    );
}