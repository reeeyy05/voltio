import React from 'react';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import { SignUpForm } from '../forms/SignUpForm';

export const SignUpPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">

            {/* Header público */}
            <Header />

            {/* Contenedor principal que ocupa el espacio restante */}
            <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 py-12">

                {/* --- ELEMENTOS DE DISEÑO DE FONDO (Iguales a la Landing y SignIn) --- */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab308_1px,transparent_1px),linear-gradient(to_bottom,#eab308_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 dark:opacity-20 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
                {/* ------------------------------------------------------------------- */}

                {/* Contenedor un poco más ancho (max-w-lg) porque este formulario tiene columnas */}
                <div className="w-full max-w-lg relative z-10">

                    {/* Cabecera del Registro */}
                    <div className="flex flex-col items-center mb-8 text-center">
                        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-50 mb-3 tracking-tight">
                            Únete a Voltio
                        </h1>
                    </div>

                    {/* Tarjeta Contenedora del Formulario */}
                    <div className="bg-card border border-stone-200 dark:border-border rounded-2xl p-8 sm:p-10 shadow-md dark:shadow-sm">
                        <SignUpForm />
                    </div>

                </div>
            </main>

            {/* Footer público */}
            <Footer />

        </div>
    );
};