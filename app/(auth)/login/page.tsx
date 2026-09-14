'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Component
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";

// Icon
import { Eye, EyeOff } from "lucide-react";

// Lib
import { validateLoginForm } from "@/lib/validations/auth";
import { DUMMY_USERS } from "@/lib/data/dummy-users";
import { getDashboardPath } from "@/lib/constants/roles";

export default function LoginPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const newErrors = validateLoginForm(formData);

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Verifikasi dengan data dummy (email atau username)
            const user = DUMMY_USERS.find(u => 
                (u.email === formData.email || u.username === formData.email) && 
                u.password === formData.password
            );

            // Jika login berhasil
            if (user) {
                setIsRedirecting(true);
                
                // Set cookie untuk simulasi session
                document.cookie = `dinosaku_session=${user.id}; path=/; max-age=86400`; // 1 hari

                toast.add({
                    title: "Login Berhasil",
                    description: `Selamat datang kembali, ${user.fullName}!`,
                    type: "success",
                    timeout: 3000
                });
                setTimeout(() => {
                    router.push(getDashboardPath(user.role));
                }, 1500);
            } else {
                setIsSubmitting(false);
                setErrors({ root: 'Email atau kata sandi yang Anda masukkan salah.' });
            }
        } else {
            setErrors(newErrors);
        }
    };

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
                    <h2 className="mt-4 text-2xl md:text-3xl font-heading text-primary tracking-tight">Selamat Datang Kembali!</h2>
                    <p className="mt-1 text-sm text-secondary">Mari lanjut belajar bersama Dinosaku.</p>
                </div>

                <h2 className="text-3xl font-heading text-primary mb-0 mt-2">Masuk Akun</h2>
                <p className="text-secondary mb-3 text-sm md:text-base">Masukkan email dan kata sandimu untuk masuk.</p>

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
                        {/* Email Input */}
                        <Field orientation="vertical" data-invalid={!!errors.email}>
                            <FieldLabel htmlFor="email" className="text-base font-heading text-primary">
                                Email atau Username <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                                id="email"
                                name="email"
                                type="text"
                                suppressHydrationWarning
                                autoComplete="username"
                                required
                                placeholder="nama@email.com atau username"
                                value={formData.email}
                                onChange={handleChange}
                                className={`h-12 rounded-lg border-2 focus-visible:ring-0 px-4 text-base shadow-sm transition-colors ${errors.email
                                    ? 'border-danger focus-visible:border-danger'
                                    : 'border-border focus-visible:border-brand-primary'
                                    }`}
                            />
                            {errors.email && <FieldError>{errors.email}</FieldError>}
                        </Field>

                        {/* Password Input */}
                        <Field orientation="vertical" data-invalid={!!errors.password}>
                            <FieldLabel htmlFor="password" className="text-base font-heading text-primary">
                                Kata Sandi <span className="text-destructive">*</span>
                            </FieldLabel>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    suppressHydrationWarning
                                    autoComplete="current-password"
                                    required
                                    placeholder="Masukkan kata sandi"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`h-12 rounded-lg border-2 focus-visible:ring-0 px-4 pr-12 text-base shadow-sm transition-colors ${errors.password
                                        ? 'border-danger focus-visible:border-danger'
                                        : 'border-border focus-visible:border-brand-primary'
                                        }`}
                                />
                                <button
                                    type="button"
                                    suppressHydrationWarning
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-0 h-12 px-4 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && <FieldError>{errors.password}</FieldError>}
                        </Field>
                    </FieldGroup>

                    {/* Lupa Password & Ingat Saya */}
                    <div className="flex items-center justify-between !mt-4">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onCheckedChange={(checked) => {
                                    setFormData(prev => ({ ...prev, rememberMe: checked === true }));
                                }}
                                className="h-5 w-5 rounded border-2 border-brand-primary/40 data-checked:border-brand-primary data-checked:bg-brand-primary [&>span>svg]:size-4"
                            />
                            <label htmlFor="rememberMe" className="text-sm font-medium text-secondary cursor-pointer">
                                Ingat Saya
                            </label>
                        </div>
                        <Link
                            href="/forgot-password"
                            className="text-sm font-heading text-brand-primary hover:text-brand-primary-hover transition-colors"
                        >
                            Lupa kata sandi?
                        </Link>
                    </div>

                    {/* Tombol Submit */}
                    <div className="!mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting || isRedirecting}
                            suppressHydrationWarning
                            className="w-full h-14 text-lg flex justify-center items-center rounded-xl bg-brand-primary text-white hover:bg-brand-primary-hover font-heading shadow-card hover:-translate-y-1 transform duration-200 disabled:opacity-70 disabled:hover:translate-y-0 transition-all"
                        >
                            {(isSubmitting || isRedirecting) ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {isRedirecting ? 'Mengarahkan...' : 'Memeriksa...'}
                                </span>
                            ) : (
                                'Masuk Sekarang'
                            )}
                        </button>
                    </div>

                    {/* Tautan Belum punya akun */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 !mt-5">
                        <span className="text-sm text-muted font-medium">
                            Belum punya akun? <Link href="/register" className="text-brand-primary font-heading hover:underline">Daftar</Link>
                        </span>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
