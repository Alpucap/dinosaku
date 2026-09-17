"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, role: Role) {
  const admin = await requireRole(["admin"]);
  if (admin.id === userId) {
    throw new Error("Tidak dapat mengubah role diri sendiri.");
  }
  
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/pengguna");
}

export async function banUser(userId: string, durationDays: number | null) {
  const admin = await requireRole(["admin"]);
  if (admin.id === userId) {
    throw new Error("Tidak dapat memblokir diri sendiri.");
  }

  let suspendedUntil: Date | null = null;
  if (durationDays !== null && durationDays > 0) {
    suspendedUntil = new Date();
    suspendedUntil.setDate(suspendedUntil.getDate() + durationDays);
  }

  await prisma.user.update({
    where: { id: userId },
    data: { 
      status: "SUSPENDED",
      suspendedUntil,
    } as any,
  });

  revalidatePath("/admin/pengguna");
}

export async function unbanUser(userId: string) {
  await requireRole(["admin"]);
  
  await prisma.user.update({
    where: { id: userId },
    data: { 
      status: "ACTIVE",
      suspendedUntil: null,
    } as any,
  });

  revalidatePath("/admin/pengguna");
}
