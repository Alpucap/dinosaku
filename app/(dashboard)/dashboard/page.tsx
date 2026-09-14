import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DUMMY_USERS } from '@/lib/data/dummy-users';

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('dinosaku_session')?.value;

    if (!sessionId) redirect('/login');

    const user = DUMMY_USERS.find(u => u.id === sessionId);
    if (!user) redirect('/login');

    redirect('/profile');
}
