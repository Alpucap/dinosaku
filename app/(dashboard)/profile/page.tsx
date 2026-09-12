import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Lib
import { DUMMY_USERS } from '@/lib/data/dummy-users';

// Section
import ProfileClient from './profile-client';

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('dinosaku_session')?.value;

    if (!sessionId) redirect('/login');

    const user = DUMMY_USERS.find(u => u.id === sessionId);
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
