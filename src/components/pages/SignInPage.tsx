import { useTranslation } from 'react-i18next';
import { SignInForm } from '../forms/SignInForm';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';

export default function SignInPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">

            {/* Header público */}
            <Header />

            {/* Contenedor principal que ocupa el espacio restante */}
            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 py-12">

                {/* --- ELEMENTOS DE DISEÑO DE FONDO (Restaurados de la Landing Page) --- */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab308_1px,transparent_1px),linear-gradient(to_bottom,#eab308_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 dark:opacity-20 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
                {/* ------------------------------------------------------------------- */}

                <div className="w-full max-w-md relative z-10">

                    {/* Cabecera del Login */}
                    <div className="flex flex-col items-center mb-8 text-center">
                        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-50 mb-3 tracking-tight">
                            {t('login.title')}
                        </h1>
                        <p className="text-stone-600 dark:text-stone-400 font-medium">
                            {t('login.subtitle')}
                        </p>
                    </div>

                    {/* Tarjeta Contenedora del Formulario */}
                    <div className="bg-card border border-stone-200 dark:border-border rounded-2xl p-8 sm:p-10 shadow-md dark:shadow-sm">
                        <SignInForm />
                    </div>

                </div>
            </div>

            {/* Footer público */}
            <Footer />

        </div>
    );
}