import { useTranslation } from 'react-i18next';
import { SignInForm } from '../forms/SignInForm';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';

export default function SignInPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center relative px-4 py-16 sm:py-24 overflow-hidden">

                <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab308_1px,transparent_1px),linear-gradient(to_bottom,#eab308_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

                <div className="w-full max-w-md relative z-10 bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-xl my-auto">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <h1 className="text-3xl font-extrabold text-foreground mb-3">{t('login.title')}</h1>
                    </div>
                    <SignInForm />
                </div>
            </main>

            <Footer />
        </div>
    );
}