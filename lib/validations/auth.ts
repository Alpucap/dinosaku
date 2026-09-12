import { DUMMY_USERS } from "@/lib/data/dummy-users";

export const validateRegistrationForm = (formData: any) => {
    const newErrors: Record<string, string> = {};

    // 1. Validasi Nama Lengkap
    if (formData.fullName !== undefined) {
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Nama Lengkap wajib diisi.';
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = 'Nama Lengkap minimal 3 karakter.';
        }
    }

    // 2. Validasi Username
    if (!formData.username) {
        newErrors.username = 'Username wajib diisi.';
    } else if (formData.username.length < 3 || formData.username.length > 20) {
        newErrors.username = 'Username harus antara 3 hingga 20 karakter.';
    } else if (formData.username.includes(' ')) {
        newErrors.username = 'Username tidak boleh mengandung spasi.';
    } else if (!/^[a-zA-Z0-9_.]+$/.test(formData.username)) {
        newErrors.username = 'Hanya mengizinkan huruf, angka, underscore (_), atau titik (.).';
    } else if (DUMMY_USERS.some(u => u.username.toLowerCase() === formData.username.toLowerCase())) {
        newErrors.username = 'Username ini sudah dipakai oleh orang lain.';
    }

    // 2. Validasi Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
        newErrors.email = 'Email wajib diisi.';
    } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Format email tidak valid (contoh: teks@domain.com).';
    } else if (DUMMY_USERS.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
        newErrors.email = 'Email ini sudah terdaftar di database.';
    }

    // 3. Validasi Password
    if (!formData.password) {
        newErrors.password = 'Password wajib diisi.';
    } else if (formData.password.length < 8) {
        newErrors.password = 'Password minimal 8 karakter.';
    }

    // 4. Konfirmasi Password
    if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Ulangi Password wajib diisi.';
    } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Konfirmasi password tidak cocok dengan password utama.';
    }

    // 5. Syarat & Ketentuan
    if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'Kamu harus mencentang persetujuan ini ya!';
    }

    return newErrors;
};

export const validateLoginForm = (formData: any) => {
    const newErrors: Record<string, string> = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
        newErrors.email = 'Email wajib diisi.';
    } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Format email tidak valid (contoh: teks@domain.com).';
    }

    if (!formData.password) {
        newErrors.password = 'Password wajib diisi.';
    }

    return newErrors;
};
