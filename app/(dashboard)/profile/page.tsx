import { redirect } from 'next/navigation';

// Lib
import { getSessionUser } from '@/lib/auth/session';

// Section
import ProfileClient from './profile-client';

export default async function ProfilePage() {
    const user = await getSessionUser();

    if (!user) redirect('/login');

    return (
        <div className="container-main py-8 md:py-12 animate-fade-in-up">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-heading text-primary mb-2">Profil Saya</h1>
                <p className="text-secondary mb-8">Kelola informasi pribadi dan pengaturan akun Anda di sini.</p>

                <ProfileClient initialUser={user} />
            </div>
        </div>
    );
}
