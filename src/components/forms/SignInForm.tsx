import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignInForm() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Aquí implementaremos la conexión real con Supabase
        console.log('Intento de inicio de sesión:', { email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="bg-background border-stone-300 dark:border-border focus-visible:ring-primary shadow-sm"
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-bold text-base py-6 shadow-md hover:shadow-lg dark:shadow-none transition-all"
            >
                {t('login.submit')}
            </Button>
        </form>
    );
}