import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';
import ProfileClient from './profile-client';
import { BackButton } from '@/components/shared/BackButton';

export default async function ProfilePage() {
    const user = await getSessionUser();

    if (!user) redirect('/login');

    let myChildren: any[] = [];
    if (user.role === 'parents') {
        myChildren = await prisma.user.findMany({
            where: { parentId: user.id },
            select: { id: true, plan: true, fullName: true, username: true, avatarUrl: true }
        });
    } else if (user.role === 'teacher' && user.classCode) {
        myChildren = await prisma.user.findMany({
            where: { role: 'CHILDREN', classCode: user.classCode },
            select: { id: true, plan: true, fullName: true, username: true, avatarUrl: true }
        });
    }

    let myTeacher = null;
    if (user.role === 'children' && user.classCode) {
        myTeacher = await prisma.user.findFirst({
            where: { role: 'TEACHER', classCode: user.classCode },
            select: { id: true, fullName: true, classCode: true }
        });
    }

    return (
        <div className="container-main py-8 md:py-12 animate-fade-in-up">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-heading text-primary">Profil Saya</h1>
                    <BackButton />
                </div>
                <p className="text-secondary mb-8">Kelola informasi pribadi dan pengaturan akun Anda di sini.</p>

                <ProfileClient 
                    initialUser={user} 
                    serverChildren={myChildren}
                    serverTeacher={myTeacher}
                />
            </div>
        </div>
    );
}
