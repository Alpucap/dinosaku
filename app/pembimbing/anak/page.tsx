import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { getGuardianScopeLabel } from "@/lib/data/children";
import AnakListClient from "./AnakListClient";
import { Suspense } from "react";

export default async function DaftarAnakPage() {
  const guardian = await requireRole(["parents", "teacher"]);
  
  let children: any[] = [];
  let classrooms: any[] = [];

  if (guardian.role === 'teacher' || guardian.role === 'TEACHER') {
    children = await prisma.user.findMany({
      where: { 
        role: "CHILDREN",
        joinedClasses: { some: { teacherId: guardian.id } }
      },
      include: { gamification: true, userBadges: true, activities: { take: 1, orderBy: { createdAt: 'desc' } }, joinedClasses: { where: { teacherId: guardian.id } } }
    });

    classrooms = await prisma.classroom.findMany({
      where: { teacherId: guardian.id },
      orderBy: { name: 'asc' }
    });
  } else if (guardian.role === 'parents' || guardian.role === 'PARENTS') {
    children = await prisma.user.findMany({
      where: { 
        role: "CHILDREN", 
        parentId: guardian.id 
      },
      include: { gamification: true, userBadges: true, activities: { take: 1, orderBy: { createdAt: 'desc' } } }
    });
  }

  return (
    <div className="learning-page">
      <header className="page-heading">
        <p className="eyebrow">Manajemen Murid / Anak</p>
        <h1>Daftar Anak</h1>
        <p>{getGuardianScopeLabel(guardian as any)} — {children.length} anak.</p>
      </header>

      <Suspense fallback={<div className="animate-pulse h-64 bg-surface rounded-xl"></div>}>
        <AnakListClient 
        childrenList={children} 
        classrooms={classrooms} 
        role={guardian.role} 
      />
      </Suspense>
    </div>
  );
}
