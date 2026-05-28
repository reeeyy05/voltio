import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/Supabase/Client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { updateUserPassword, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                toast.info(t('recovery.session_verified'));
            }
        });

        return () => subscription.unsubscribe();
    }, [t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error(t('recovery.err_mismatch'));
            return;
        }

        if (password.length < 6) {
            toast.error(t('recovery.err_length'));
            return;
        }

        try {
            await updateUserPassword(password);
            toast.success(t('recovery.success_update'));
            navigate("/app/panel");
        } catch (error) {
            toast.error(t('recovery.err_update'));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50 dark:bg-stone-950">
            <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-xl p-8 border border-stone-100 dark:border-stone-800 animate-in fade-in zoom-in duration-300">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-stone-900 dark:text-white">{t('recovery.update_title')}</h1>
                    <p className="text-stone-500 dark:text-stone-400 mt-2 text-sm">
                        {t('recovery.update_subtitle')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div className="space-y-2">
                        <Label className="font-medium text-stone-800 dark:text-stone-200">
                            {t('recovery.new_password')}
                        </Label>
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('recovery.min_chars')}
                            disabled={isLoading}
                            className="bg-background shadow-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="font-medium text-stone-800 dark:text-stone-200">
                            {t('recovery.confirm_password')}
                        </Label>
                        <PasswordInput
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={t('recovery.repeat_password')}
                            disabled={isLoading}
                            className="bg-background shadow-sm"
                        />
                    </div>

                    <Button type="submit" className="w-full font-bold text-base shadow-md mt-4" disabled={isLoading}>
                        {isLoading && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
                        {t('recovery.save_password')}
                    </Button>
                </form>
            </div>
        </div>
    );
}