'use server';

import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: {
    fullName: string;
    username: string;
    avatarUrl?: string;
    schoolName?: string;
}) {
    const sessionUser = await getSessionUser();
    if (!sessionUser) throw new Error("Unauthorized");

    let schoolId: string | null = null;
    if (data.schoolName && data.schoolName.trim()) {
        const nameTrimmed = data.schoolName.trim();
        let school = await prisma.school.findFirst({
            where: { name: { equals: nameTrimmed, mode: 'insensitive' } }
        });
        if (!school) {
            school = await prisma.school.create({
                data: { name: nameTrimmed }
            });
        }
        schoolId = school.id;
    }

    await prisma.user.update({
        where: { id: sessionUser.id },
        data: {
            fullName: data.fullName.trim(),
            username: data.username.trim(),
            avatarUrl: data.avatarUrl || undefined,
            schoolId: schoolId,
        }
    });

    revalidatePath('/profile');
    return { success: true };
}
