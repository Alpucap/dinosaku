export const validateRegistrationForm = (formData: any) => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
        errors.fullName = 'Nama lengkap wajib diisi';
    } else if (formData.fullName.length < 3) {
        errors.fullName = 'Nama lengkap minimal 3 karakter';
    }

    if (!formData.username.trim()) {
        errors.username = 'Username wajib diisi';
    } else if (formData.username.length < 3) {
        errors.username = 'Username minimal 3 karakter';
    }

    if (!formData.email.trim()) {
        errors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
        errors.password = 'Kata sandi wajib diisi';
    } else if (formData.password.length < 6) {
        errors.password = 'Kata sandi minimal 6 karakter';
    }

    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Kata sandi tidak cocok';
    }

    if (!formData.termsAccepted) {
        errors.termsAccepted = 'Anda harus menyetujui Syarat dan Ketentuan';
    }

    return errors;
};

export const validateLoginForm = (formData: any) => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
        errors.email = 'Email atau username wajib diisi';
    }

    if (!formData.password) {
        errors.password = 'Kata sandi wajib diisi';
    }

    return errors;
};

export const validateForgotPasswordForm = (email: string) => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
        errors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Format email tidak valid';
    }

    return errors;
};
