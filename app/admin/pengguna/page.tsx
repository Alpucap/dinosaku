import React from "react";
import { prisma } from "@/lib/prisma";
import { UsersClient, AdminUser } from "./UsersClient";
import { requireRole } from "@/lib/auth/guard";

export const metadata = {
  title: "Kelola Pengguna | Dinosaku Admin",
};

export default async function AdminUsersPage() {
  await requireRole(["admin"]);

  const rawUsers = await prisma.user.findMany({
    include: {
      gamification: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const users: AdminUser[] = rawUsers.map((user) => ({
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    avatarUrl: user.avatarUrl,
    role: user.role,
    status: user.status,
    suspendedUntil: (user as any).suspendedUntil ?? null,
    energy: user.gamification?.energy || 0,
  }));

  return (
    <div className="learning-page w-full">
      <header className="page-heading">
        <p className="eyebrow">Administrasi</p>
        <h1>Kelola Pengguna</h1>
        <p>Daftar seluruh pengguna yang terdaftar di Dinosaku.</p>
      </header>

      <UsersClient users={users} />
    </div>
  );
}
