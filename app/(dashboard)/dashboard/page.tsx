import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { getDashboardPath } from '@/lib/constants/roles';

export default async function DashboardPage() {
    const user = await getSessionUser();

    if (!user) redirect('/login');

    redirect(getDashboardPath(user.role));
}
