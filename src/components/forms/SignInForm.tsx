import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { PasswordInput } from '../ui/PasswordInput';

export function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

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
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-800 dark:text-stone-200">{t('login.email')}</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder={t('login.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="bg-background focus-visible:ring-primary"
                />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-stone-800 dark:text-stone-200">
                        {t('login.password')}
                    </Label>
                </div>
                <PasswordInput
                    id="password"
                    placeholder={t('login.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
                <a href="/reset-password" className="text-sm font-medium text-primary hover:underline">
                    {t('login.forgot_password')}
                </a>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('auth.signin_loading')}
                    </>
                ) : (
                    t('login.submit')
                )}
            </Button>

            <div className="text-center mt-4 text-sm text-stone-600 dark:text-stone-400">
                {t('auth.signup_already')}{' '}
                <Link to="/registro" className="font-medium text-primary hover:underline">
                    Regístrate aquí
                </Link>
            </div>

            <div className="text-center mt-6 pt-4 border-t border-stone-150 dark:border-stone-800 flex flex-col items-center justify-center">
                <Button variant="ghost" size="sm" asChild className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 gap-2 w-full">
                    <Link to="/">
                        <ArrowLeft className="h-4 w-4" />
                        Volver a la página de inicio
                    </Link>
                </Button>
            </div>
        </form>
    );
}