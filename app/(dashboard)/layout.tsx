import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getSessionUser();

    // Proteksi Route
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
