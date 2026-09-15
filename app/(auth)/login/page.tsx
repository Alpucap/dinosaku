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
import { Eye, EyeOff, UserCircle2, GraduationCap, Users } from "lucide-react";

// Lib
import { validateLoginForm } from "@/lib/validations/auth";
import { loginUserAction } from "../actions";

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

        // Hapus pesan error saat user mengetik
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFastLogin = (email: string) => {
        setFormData({
            email: email,
            password: 'password123',
            rememberMe: false
        });
        // Scroll ke form
        document.getElementById('email')?.focus();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const newErrors = validateLoginForm(formData);

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            setErrors({});

            // Server Action
            const result = await loginUserAction(formData.email, formData.password);

            if (result.success && result.redirectUrl) {
                setIsRedirecting(true);
                
                toast.add({
                    title: "Login Berhasil",
                    description: `Selamat datang kembali!`,
                    type: "success",
                    timeout: 3000
                });
                
                setTimeout(() => {
                    router.push(result.redirectUrl as string);
                }, 1000);
            } else {
                setIsSubmitting(false);
                setErrors({ root: result.error || 'Email atau kata sandi yang Anda masukkan salah.' });
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-card border-2 border-border-light rounded-3xl overflow-hidden bg-background">
            <CardContent className="p-6 sm:p-10 flex flex-col gap-8">
                {/* Logo & Judul */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative h-16 w-16 mb-2">
                        <Image
                            src="/mascot/dino-happy.svg"
                            alt="Dinosaku Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div>
                        <h1 className="font-heading text-3xl font-bold text-primary tracking-tight">Selamat Datang!</h1>
                        <p className="text-muted text-base mt-2 font-medium">Masuk untuk melanjutkan petualangan finansialmu.</p>
                    </div>
                </div>

                {/* FAST LOGIN BUTTONS FOR HACKATHON MVP */}
                <div className="bg-brand-primary/5 rounded-xl p-4 border border-brand-primary/20 space-y-3">
                    <p className="text-xs font-bold text-center text-brand-primary uppercase tracking-wider">Fast Login (MVP)</p>
                    <div className="grid grid-cols-3 gap-2">
                        <button 
                            type="button" 
                            onClick={() => handleFastLogin('anak1@dinosaku.com')}
                            className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-border-light shadow-sm hover:border-brand-primary hover:bg-brand-primary/5 transition-all group"
                        >
                            <UserCircle2 className="text-text-secondary group-hover:text-brand-primary h-6 w-6 mb-1" />
                            <span className="text-[10px] font-bold text-text-primary text-center">Siswa</span>
                        </button>
                        <button 
                            type="button" 
                            onClick={() => handleFastLogin('ortu@dinosaku.com')}
                            className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-border-light shadow-sm hover:border-brand-primary hover:bg-brand-primary/5 transition-all group"
                        >
                            <Users className="text-text-secondary group-hover:text-brand-primary h-6 w-6 mb-1" />
                            <span className="text-[10px] font-bold text-text-primary text-center">Orang Tua</span>
                        </button>
                        <button 
                            type="button" 
                            onClick={() => handleFastLogin('guru@dinosaku.com')}
                            className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-border-light shadow-sm hover:border-brand-primary hover:bg-brand-primary/5 transition-all group"
                        >
                            <GraduationCap className="text-text-secondary group-hover:text-brand-primary h-6 w-6 mb-1" />
                            <span className="text-[10px] font-bold text-text-primary text-center">Guru</span>
                        </button>
                    </div>
                </div>

                {/* Pesan Error Root */}
                {errors.root && (
                    <div className="p-4 rounded-xl bg-danger-soft border-2 border-danger text-danger text-sm font-medium animate-shake text-center">
                        {errors.root}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <FieldGroup>
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
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors focus:outline-none p-1 rounded-md hover:bg-surface-soft"
                                    aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && <FieldError>{errors.password}</FieldError>}
                        </Field>
                    </FieldGroup>

                    {/* Checkbox Remember Me & Forgot Password */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onCheckedChange={(checked) =>
                                    handleChange({ target: { name: 'rememberMe', type: 'checkbox', checked } } as any)
                                }
                                className="h-5 w-5 rounded border-2 border-border-strong data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary transition-all"
                            />
                            <label
                                htmlFor="rememberMe"
                                className="text-sm font-medium leading-none text-text-secondary cursor-pointer select-none"
                            >
                                Ingat saya
                            </label>
                        </div>

                        <Link
                            href="/forgot-password"
                            className="text-sm font-bold text-brand-primary hover:text-brand-primary-hover hover:underline"
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
