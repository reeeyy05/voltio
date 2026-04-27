import React from 'react';
import { Header } from '../common/Header';
import { SignUpForm } from './SignUpForm';

export const SignUpPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-yellow-50 bg-[url('/grid-pattern.svg')]">
            <Header />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-yellow-200">
                    <div className="p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Únete a Voltio
                            </h2>
                            <p className="text-sm text-gray-500 mt-2">
                                Crea tu cuenta de empleado para acceder a tus obras
                            </p>
                        </div>

                        <SignUpForm />

                    </div>
                </div>
            </main>
        </div>
    );
};