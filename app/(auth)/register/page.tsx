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
import { TermsModal } from "@/components/auth/terms-modal";

// Icon
import { Eye, EyeOff, AtSign } from "lucide-react";

// Lib
import { Role, REGISTER_ROLES } from "@/lib/constants/roles";
import { validateRegistrationForm } from "@/lib/validations/auth";
import { registerUserAction } from "../actions";

export default function RegisterPage() {
    const router = useRouter();

    // State untuk menampung data inputan dan status form
    const [formData, setFormData] = useState({
        role: 'parents' as Role,
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false,
    });

    // State untuk menampung error validasi
    const [errors, setErrors] = useState<Record<string, string>>({});
    // State untuk menampung status submit
    const [isSubmitting, setIsSubmitting] = useState(false);
    // State untuk menampung status sukses
    const [success, setSuccess] = useState(false);
    // State untuk menampung status modal terms
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    // State untuk menampung status show password
    const [showPassword, setShowPassword] = useState(false);

    // Function untuk menangani perubahan pada inputan
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Function untuk menangani perubahan pada role
    const handleRoleChange = (role: Role) => {
        setFormData(prev => ({ ...prev, role }));
    };

    // Function untuk menangani submit form
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const newErrors = validateRegistrationForm(formData);

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            setErrors({});
            
            // Panggil Server Action
            const result = await registerUserAction(formData);
            
            if (result.success && result.redirectUrl) {
                setSuccess(true);
                setTimeout(() => {
                    router.push(result.redirectUrl as string);
                }, 2000);
            } else {
                setIsSubmitting(false);
                setErrors({ root: result.error || 'Gagal mendaftar' });
            }
        } else {
            setErrors(newErrors);
        }
    };

    if (success) {
        return (
            <div className="text-center py-12 animate-fade-in-up">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-success-soft mb-6 shadow-soft">
                    <svg className="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-3xl font-heading text-primary">Hore! Berhasil!</h3>
                <p className="mt-3 text-base text-secondary">Selamat datang di Dinosaku. Akun barumu sudah siap digunakan.</p>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="mt-8 bg-brand-primary text-white hover:bg-brand-primary-hover px-8 py-3.5 h-auto text-lg rounded-xl font-heading transition-all shadow-card hover:-translate-y-1 w-full"
                    suppressHydrationWarning
                >
                    Mulai Bermain 🚀
                </button>
            </div>
        );
    }

    return (
        <>
            <Card className="w-full shadow-xl border-t-[6px] border-brand-primary rounded-xl bg-surface relative z-10 overflow-hidden">
                <CardContent className="p-6 md:p-8 pt-6 md:pt-6">
                    {/* Header untuk mobile/tablet */}
                    <div className="lg:hidden flex flex-col items-center text-center space-y-4 mb-4 mt-2">
                        <div className="relative h-12 w-[180px] mb-2">
                            <Image
                                src="/logo/dinosaku.svg"
                                alt="Dinosaku Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-heading text-primary tracking-tight">Selamat Datang!</h2>
                            <p className="mt-1 text-sm text-secondary">Mari belajar bersama Dinosaku.</p>
                        </div>
                    </div>
                    
                    <h2 className="hidden lg:block text-3xl font-heading text-primary mb-0 mt-2">Ayo Bergabung!</h2>
                    <p className="hidden lg:block text-secondary mb-3 text-sm md:text-base">Isi data di bawah ini untuk membuat akun barumu.</p>
                    {errors.root && <div className="p-3 mb-4 rounded-xl bg-danger-soft border border-danger text-danger text-sm font-medium animate-shake text-center">{errors.root}</div>}

                    <form className="space-y-4 relative z-10" onSubmit={handleSubmit} noValidate>
                        <FieldGroup className="gap-3">
                            {/* Pilihan Role */}
                            <Field orientation="vertical">
                                <FieldLabel className="text-base font-heading text-primary">Saya adalah seorang... <span className="text-destructive">*</span></FieldLabel>
                                <div className="grid grid-cols-3 gap-3 mt-2">
                                    {REGISTER_ROLES.map((r) => (
                                        <button
                                            key={r.id}
                                            type="button"
                                            suppressHydrationWarning
                                            onClick={() => handleRoleChange(r.id)}
                                            className={`py-4 px-2 border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200 ${formData.role === r.id
                                                ? 'bg-brand-primary text-white border-brand-primary shadow-md transform scale-105'
                                                : 'bg-surface text-secondary border-border hover:bg-surface-soft hover:border-brand-secondary'
                                                }`}
                                        >
                                            <div className="flex items-center justify-center">{r.icon}</div>
                                            <span className="text-sm font-heading">{r.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </Field>

                            {/* Nama Lengkap Input */}
                            <Field orientation="vertical" data-invalid={!!errors.fullName}>
                                <FieldLabel htmlFor="fullName" className="text-base font-heading text-primary">
                                    Nama Lengkap <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    suppressHydrationWarning
                                    autoComplete="name"
                                    required
                                    placeholder="Masukkan nama lengkap"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`h-12 rounded-lg border-2 focus-visible:ring-0 px-4 text-base shadow-sm transition-colors ${errors.fullName
                                        ? 'border-danger focus-visible:border-danger'
                                        : 'border-border focus-visible:border-brand-primary'
                                        }`}
                                />
                                {errors.fullName && <FieldError>{errors.fullName}</FieldError>}
                            </Field>

                            {/* Username Input */}
                            <Field orientation="vertical" data-invalid={!!errors.username}>
                                <FieldLabel htmlFor="username" className="text-base font-heading text-primary">
                                    Username <span className="text-destructive">*</span>
                                </FieldLabel>
                                <div className="relative flex items-center">
                                    <div className="absolute left-3 text-muted-foreground pointer-events-none transition-colors peer-focus:text-primary">
                                        <AtSign size={20} />
                                    </div>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        suppressHydrationWarning
                                        autoComplete="off"
                                        required
                                        placeholder="Buat username unik"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`peer h-12 rounded-lg border-2 focus-visible:ring-0 pl-10 pr-4 text-base shadow-sm transition-colors ${errors.username
                                            ? 'border-danger focus-visible:border-danger'
                                            : 'border-border focus-visible:border-brand-primary'
                                            }`}
                                    />
                                </div>
                                {errors.username && <FieldError>{errors.username}</FieldError>}
                            </Field>

                            {/* Email Input */}
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
                                        autoComplete="new-password"
                                        required
                                        placeholder="Minimal 8 karakter"
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

                            {/* Konfirmasi Password Input */}
                            <Field orientation="vertical" data-invalid={!!errors.confirmPassword}>
                                <FieldLabel htmlFor="confirmPassword" className="text-base font-heading text-primary">
                                    Ulangi Kata Sandi <span className="text-destructive">*</span>
                                </FieldLabel>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        suppressHydrationWarning
                                        autoComplete="new-password"
                                        required
                                        placeholder="Ketik ulang sandi"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`h-12 rounded-lg border-2 focus-visible:ring-0 px-4 pr-12 text-base shadow-sm transition-colors ${errors.confirmPassword
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
                                {errors.confirmPassword && <FieldError>{errors.confirmPassword}</FieldError>}
                            </Field>
                        </FieldGroup>

                        {/* Checkbox Syarat & Ketentuan */}
                        <div className="!mt-4 bg-surface-soft p-4 rounded-lg border border-border flex flex-col">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="termsAccepted"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onCheckedChange={(checked) => {
                                        setFormData(prev => ({ ...prev, termsAccepted: checked === true }));
                                        if (errors.termsAccepted) {
                                            setErrors(prev => ({ ...prev, termsAccepted: '' }));
                                        }
                                    }}
                                    className="h-5 w-5 rounded border-2 border-brand-primary/40 data-checked:border-brand-primary data-checked:bg-brand-primary [&>span>svg]:size-4"
                                />
                                <label htmlFor="termsAccepted" className="text-sm font-medium text-primary cursor-pointer">
                                    Saya setuju dengan <button type="button" suppressHydrationWarning onClick={() => setIsTermsOpen(true)} className="text-brand-primary hover:underline font-heading">Syarat & Ketentuan</button> Dinosaku.
                                </label>
                            </div>
                            {errors.termsAccepted && (
                                <p className="text-sm text-destructive mt-2 ml-8 font-heading">{errors.termsAccepted}</p>
                            )}
                        </div>

                        {/* Tombol Submit */}
                        <div className="!mt-5">
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
                                        Sedang Memproses...
                                    </span>
                                ) : (
                                    'Daftar Sekarang!'
                                )}
                            </button>
                        </div>

                        {/* Tautan Lupa Password */}
                        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 sm:gap-0 !mt-4">
                            <span className="text-sm text-muted font-medium">
                                Sudah punya akun? <Link href="/login" className="text-brand-primary font-heading hover:underline">Login</Link>
                            </span>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-heading text-brand-primary hover:text-brand-primary-hover transition-colors"
                            >
                                Lupa kata sandi?
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
        </>
    );
}
