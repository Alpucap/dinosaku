'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DUMMY_USERS, User } from '@/lib/data/dummy-users';

// Components
import { toast } from '@/components/ui/toast';

// Sections
import { ProfileHeader } from './_sections/ProfileHeader';
import { ChildrenProfileSection } from './_sections/ChildrenProfileSection';
import { AdminProfileSection } from './_sections/AdminProfileSection';
import { ParentsProfileSection } from './_sections/ParentsProfileSection';
import { PersonalInfoSection } from './_sections/PersonalInfoSection';
import { SecuritySection } from './_sections/SecuritySection';
import { PreferencesSection } from './_sections/PreferencesSection';
import { DangerZoneSection } from './_sections/DangerZoneSection';

const ADULT_AVATAR_OPTIONS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Kelluny",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Cattelyaa",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Steva",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=AAbiiiW",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Petro"
];

const CHILD_AVATAR_OPTIONS = [
    "https://api.dicebear.com/10.x/critters/svg?seed=Dino",
    "https://api.dicebear.com/10.x/critters/svg?seed=Rex",
    "https://api.dicebear.com/10.x/critters/svg?seed=Spike",
    "https://api.dicebear.com/10.x/critters/svg?seed=Bella",
    "https://api.dicebear.com/10.x/critters/svg?seed=Tricera",
    "https://api.dicebear.com/10.x/critters/svg?seed=Ptero"
];

export default function ProfileClient({ initialUser }: { initialUser: User }) {
    const router = useRouter();
    const [user, setUser] = useState(initialUser);

    const [formData, setFormData] = useState(initialUser);
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isSavingPrefs, setIsSavingPrefs] = useState(false);

    const [isAvatarOpen, setIsAvatarOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Cek role
    const isChild = user.role === 'children';
    const isParent = user.role === 'parents';
    const isTeacher = user.role === 'teacher';
    const isAdmin = user.role === 'admin';

    const myChildren = DUMMY_USERS.filter(u => u.parentId === user.id);
    const premiumChildrenCount = myChildren.filter(c => c.plan === 'premium').length;

    const myTeacher = isChild && user.classCode ? DUMMY_USERS.find(u => u.role === 'teacher' && u.classCode === user.classCode) : null;

    const handleLogout = () => {
        document.cookie = 'dinosaku_session=; path=/; max-age=0';
        toast.add({
            title: "Log Out Berhasil",
            description: "Sampai jumpa lagi!",
            type: "info",
            timeout: 3000
        });
        router.push('/login');
        router.refresh();
    };

    const handleAvatarChange = (url: string) => {
        const updatedUser = { ...user, avatarUrl: url };
        setUser(updatedUser);
        setFormData(updatedUser);
        setIsAvatarOpen(false);
        toast.add({
            title: "Avatar Diperbarui!",
            description: "Foto profil dinosaurus Anda sudah diganti.",
            type: "success",
            timeout: 3000
        });
    };

    const handleSaveProfile = async () => {
        const newErrors: Record<string, string> = {};

        if (!isChild) {
            if (!formData.fullName.trim()) newErrors.fullName = "Nama lengkap wajib diisi.";
            else if (formData.fullName.length < 3) newErrors.fullName = "Nama lengkap minimal 3 karakter.";

            if (!formData.username.trim()) {
                newErrors.username = "Username wajib diisi.";
            } else if (formData.username.length < 3) {
                newErrors.username = "Username minimal 3 karakter.";
            } else {
                const isUsernameTaken = DUMMY_USERS.some(
                    u => u.username.toLowerCase() === formData.username.toLowerCase() && u.id !== initialUser.id
                );
                if (isUsernameTaken) {
                    newErrors.username = "Username sudah digunakan oleh pengguna lain.";
                }
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors({ ...errors, fullName: newErrors.fullName, username: newErrors.username });
            return;
        }

        // Clear profile errors
        const currentErrors = { ...errors };
        delete currentErrors.fullName;
        delete currentErrors.username;
        setErrors(currentErrors);

        setIsSavingProfile(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        setIsSavingProfile(false);

        setUser({ ...user, fullName: formData.fullName, username: formData.username, schoolId: formData.schoolId });

        toast.add({
            title: "Profil Diperbarui!",
            description: "Informasi pribadi Anda telah disimpan.",
            type: "success",
            timeout: 3000
        });
    };

    const handleSavePassword = async () => {
        const newErrors: Record<string, string> = {};

        if (!passwordForm.current) newErrors.currentPassword = "Password saat ini wajib diisi.";
        else if (passwordForm.current !== initialUser.password) newErrors.currentPassword = "Password saat ini salah.";

        if (!passwordForm.new) newErrors.newPassword = "Password baru wajib diisi.";
        else if (passwordForm.new.length < 8) newErrors.newPassword = "Password baru minimal 8 karakter.";

        if (passwordForm.new !== passwordForm.confirm) newErrors.confirmPassword = "Konfirmasi password tidak cocok.";

        if (Object.keys(newErrors).length > 0) {
            setErrors({
                ...errors,
                currentPassword: newErrors.currentPassword,
                newPassword: newErrors.newPassword,
                confirmPassword: newErrors.confirmPassword
            });
            return;
        }

        const currentErrors = { ...errors };
        delete currentErrors.currentPassword;
        delete currentErrors.newPassword;
        delete currentErrors.confirmPassword;
        setErrors(currentErrors);

        setIsSavingPassword(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSavingPassword(false);

        setPasswordForm({ current: '', new: '', confirm: '' });

        toast.add({
            title: "Password Berhasil Diubah!",
            description: "Keamanan akun Anda telah diperbarui.",
            type: "success",
            timeout: 3000
        });
    };

    const handlePreferencesChange = async (checked: boolean) => {
        const newPrefs = { ...formData.preferences, notificationsEnabled: checked };
        setFormData({ ...formData, preferences: newPrefs });

        setIsSavingPrefs(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        setUser({ ...user, preferences: newPrefs });
        setIsSavingPrefs(false);

        toast.add({
            title: "Preferensi Disimpan",
            description: checked ? "Notifikasi email diaktifkan." : "Notifikasi email dimatikan.",
            type: "success",
            timeout: 2000
        });
    };

    return (
        <div className="space-y-4" suppressHydrationWarning>
            {/* Header / Avatar Card */}
            <ProfileHeader
                user={user}
                formData={formData}
                isChild={isChild}
                isAvatarOpen={isAvatarOpen}
                setIsAvatarOpen={setIsAvatarOpen}
                handleAvatarChange={handleAvatarChange}
            />

            {/* Role: Anak-Anak */}
            {isChild && <ChildrenProfileSection user={user} myTeacher={myTeacher || null} />}

            {/* Role: Admin Utama */}
            {isAdmin && <AdminProfileSection />}

            {/* Role: Orang Tua */}
            {isParent && <ParentsProfileSection user={user} premiumChildrenCount={premiumChildrenCount} myChildren={myChildren} />}

            {/* Informasi Pribadi (Termasuk Guru) */}
            <PersonalInfoSection
                user={user}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                isChild={isChild}
                isTeacher={isTeacher}
                handleSaveProfile={handleSaveProfile}
                isSavingProfile={isSavingProfile}
            />

            {/* Keamanan Akun */}
            <SecuritySection
                passwordForm={passwordForm}
                setPasswordForm={setPasswordForm}
                errors={errors}
                handleSavePassword={handleSavePassword}
                isSavingPassword={isSavingPassword}
            />

            {/* Pengaturan & Privasi */}
            <PreferencesSection
                formData={formData}
                handlePreferencesChange={handlePreferencesChange}
                isSavingPrefs={isSavingPrefs}
            />

            {/* Danger Zone */}
            <DangerZoneSection handleLogout={handleLogout} />
        </div>
    );
}
