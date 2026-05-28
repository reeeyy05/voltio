import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const { sendPasswordResetEmail, isLoading } = useAuthStore();
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        try {
            await sendPasswordResetEmail(email);
            setIsSent(true);
            toast.success(t('recovery.success_toast'));
        } catch (error) {
            toast.error(t('recovery.error_toast'));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50 dark:bg-stone-950">
            <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-xl p-8 border border-stone-100 dark:border-stone-800">

                {isSent ? (
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                            <MailCheck className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{t('recovery.check_email')}</h2>
                        <p className="text-stone-500 dark:text-stone-400">
                            {t('recovery.check_email_desc_1')} <b>{email}</b>.
                            {t('recovery.check_email_desc_2')}
                        </p>
                        <Button variant="outline" className="w-full mt-4" asChild>
                            <Link to="/login">{t('recovery.back_login')}</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-300">
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold text-stone-900 dark:text-white">{t('recovery.title')}</h1>
                            <p className="text-stone-500 dark:text-stone-400 mt-2 text-sm">
                                {t('recovery.subtitle')}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 text-left">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-medium text-stone-800 dark:text-stone-200">
                                    {t('recovery.email_label')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('login.email_placeholder')}
                                    required
                                    disabled={isLoading}
                                    className="bg-background focus-visible:ring-primary shadow-sm"
                                />
                            </div>

                            <Button type="submit" className="w-full font-bold text-base shadow-md" disabled={isLoading}>
                                {isLoading && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
                                {t('recovery.submit')}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-stone-150 dark:border-stone-800 text-center">
                            <Link to="/login" className="text-sm font-medium text-stone-500 hover:text-primary flex items-center justify-center gap-2 transition-colors">
                                <ArrowLeft className="h-4 w-4" /> {t('recovery.back_login')}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}