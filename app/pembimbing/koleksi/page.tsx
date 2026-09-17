import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import KoleksiClient from "./KoleksiClient";

export default async function KoleksiGuruPage() {
  const user = await requireRole(["teacher"]);

  async function deleteStory(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    if (!id) return;
    
    // Verify story belongs to teacher
    const story = await prisma.story.findUnique({ where: { id, userId: user.id } });
    if (!story) return;

    // Delete associated assignments first to keep it clean
    await prisma.assignment.deleteMany({ where: { storyId: id } });
    
    // Delete story
    await prisma.story.delete({ where: { id } });
    revalidatePath('/pembimbing/koleksi');
    revalidatePath('/pembimbing/aksi');
  }

  const storiesRaw = await prisma.story.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // Fetch assignment counts separately to avoid PrismaClientValidationError on outdated clients
  const assignmentCounts = await prisma.assignment.groupBy({
    by: ['storyId'],
    _count: { id: true },
    where: { storyId: { in: storiesRaw.map(s => s.id) } }
  }).catch(() => []); // Fallback in case Assignment model isn't fully synced

  const countMap = new Map(assignmentCounts.map((a: any) => [a.storyId, a._count.id]));

  const stories = storiesRaw.map((s: any) => ({
    ...s,
    _count: { assignments: countMap.get(s.id) || 0 }
  }));

  const students = await prisma.user.findMany({
    where: { classCode: user.classCode, role: 'CHILDREN' },
    select: { id: true, fullName: true, username: true }
  });

  return (
    <div className="learning-page w-full">
      <header className="page-heading">
        <p className="eyebrow">Manajemen Konten</p>
        <h1>Koleksi Cerita AI</h1>
        <p>Lihat dan baca kembali cerita yang telah AI buat untuk murid-murid Anda.</p>
      </header>

      <div className="flex flex-col gap-6 w-full">
        <KoleksiClient stories={stories} students={students} deleteStory={deleteStory} />
      </div>
    </div>
  );
}
