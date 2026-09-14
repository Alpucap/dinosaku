import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// Lib
import { DUMMY_USERS } from '@/lib/data/dummy-users';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Ambil cookie session
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('dinosaku_session')?.value;

    // Proteksi Route
    if (!sessionId) {
        redirect('/login');
    }

    // Validasi user
    const user = DUMMY_USERS.find(u => u.id === sessionId);
    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-app font-sans text-primary flex flex-col">
            <main className="flex-1 bg-surface-soft/50">
                {children}
            </main>
        </div>
    );
}
