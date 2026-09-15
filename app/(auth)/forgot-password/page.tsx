'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Component
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";

// Lib
import { validateForgotPasswordForm } from "@/lib/validations/auth";
import { forgotPasswordAction } from "../actions";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: '' }));
        }
        if (errors.root) {
            setErrors(prev => ({ ...prev, root: '' }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const newErrors = validateForgotPasswordForm(email);

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            setErrors({});

            const result = await forgotPasswordAction(email);
            setIsSubmitting(false);

            if (result.success) {
                setSuccess(true);
            } else {
                setErrors({ root: result.error || 'Email tidak ditemukan di sistem kami.' });
            }
        } else {
            setErrors(newErrors);
        }
    };

    if (success) {
        return (
            <Card className="w-full shadow-xl border-t-[6px] border-brand-primary rounded-xl bg-surface relative z-10 overflow-hidden">
                <CardContent className="p-6 md:p-8 pt-10 text-center animate-fade-in-up">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-success-soft mb-6 shadow-soft">
                        <svg className="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-heading text-primary">Tautan Terkirim!</h3>
                    <p className="mt-3 text-base text-secondary mb-8">
                        Instruksi untuk mengatur ulang kata sandi telah dikirimkan ke <strong className="text-primary">{email}</strong>. Silakan periksa kotak masuk atau folder spam.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex justify-center items-center bg-brand-primary text-white hover:bg-brand-primary-hover px-8 py-3.5 h-auto text-lg rounded-xl font-heading transition-all shadow-card hover:-translate-y-1 w-full"
                    >
                        Kembali ke Halaman Masuk
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-xl border-t-[6px] border-brand-primary rounded-xl bg-surface relative z-10 overflow-hidden">
            <CardContent className="p-6 md:p-8 pt-6 md:pt-6">
                {/* Header untuk mobile/tablet */}
                <div className="lg:hidden flex flex-col items-center text-center mb-4 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary rounded-full blur-[40px] opacity-20 pointer-events-none"></div>
                    <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 animate-[floatMascot_4s_ease-in-out_infinite]">
                        <Image
                            src="/mascot/dino.png"
                            alt="Mascot Dinosaku"
                            fill
                            priority
                            className="object-contain drop-shadow-md"
                        />
                    </div>
                </div>

                <Link href="/login" className="inline-flex items-center text-sm font-semibold text-brand-primary hover:underline mb-6">
                    &larr; Kembali
                </Link>

                <h2 className="text-3xl font-heading text-primary mb-0">Lupa Kata Sandi?</h2>
                <p className="text-secondary mb-5 text-sm md:text-base">
                    Jangan khawatir! Masukkan alamat email yang terdaftar, dan tautan untuk mengatur ulang kata sandi akan segera dikirimkan.
                </p>

                {errors.root && (
                    <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 flex items-start gap-2">
                        <svg className="w-5 h-5 text-danger shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-sm font-medium text-danger">{errors.root}</p>
                    </div>
                )}

                <form className="space-y-4 relative z-10" onSubmit={handleSubmit} noValidate>
                    <FieldGroup className="gap-3">
                        <Field orientation="vertical" data-invalid={!!errors.email}>
                            <FieldLabel htmlFor="email" className="text-base font-heading text-primary">
                                Alamat Email <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                suppressHydrationWarning
                                autoComplete="email"
                                required
                                placeholder="nama@email.com"
                                value={email}
                                onChange={handleChange}
                                className={`h-12 rounded-lg border-2 focus-visible:ring-0 px-4 text-base shadow-sm transition-colors ${errors.email
                                    ? 'border-danger focus-visible:border-danger'
                                    : 'border-border focus-visible:border-brand-primary'
                                    }`}
                            />
                            {errors.email && <FieldError>{errors.email}</FieldError>}
                        </Field>
                    </FieldGroup>

                    {/* Tombol Submit */}
                    <div className="!mt-8">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            suppressHydrationWarning
                            className="w-full h-14 text-lg flex justify-center items-center rounded-xl bg-brand-primary text-white hover:bg-brand-primary-hover font-heading shadow-card hover:-translate-y-1 transform duration-200 disabled:opacity-70 disabled:hover:translate-y-0 transition-all"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Mengirim...
                                </span>
                            ) : (
                                'Kirim Tautan Reset'
                            )}
                        </button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
