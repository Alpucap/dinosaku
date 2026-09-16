import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Calendar, ChevronRight, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import AssignModal from "./AssignModal";

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

  const [stories, students] = await Promise.all([
    prisma.story.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { assignments: true } } }
    }),
    prisma.user.findMany({
      where: { classCode: user.classCode, role: 'CHILDREN' },
      select: { id: true, fullName: true, username: true }
    })
  ]);

  return (
    <div className="learning-page w-full">
      <header className="page-heading">
        <p className="eyebrow">Manajemen Konten</p>
        <h1>Koleksi Cerita AI</h1>
        <p>Lihat dan baca kembali cerita yang telah AI buat untuk murid-murid Anda.</p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {stories.length === 0 ? (
          <div className="col-span-full rounded-xl border border-default bg-surface p-12 text-center text-text-secondary">
            <BookOpen className="mx-auto h-12 w-12 text-border-strong mb-4" />
            <p className="font-bold">Belum ada cerita yang dibuat.</p>
            <p className="text-sm mt-2">Buat cerita pertama Anda melalui menu Aksi & Misi.</p>
          </div>
        ) : (
          stories.map((story) => (
            <div key={story.id} className="flex flex-col justify-between rounded-xl border border-default bg-surface overflow-hidden group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    <Calendar size={12} />
                    {story.createdAt.toLocaleDateString("id-ID", { day: 'numeric', month: 'long' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-bold">
                      {story._count.assignments} Penugasan
                    </div>
                    <form action={deleteStory}>
                      <input type="hidden" name="id" value={story.id} />
                      <button type="submit" className="text-text-muted hover:text-brand-danger transition-colors p-1" title="Hapus cerita">
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>
                </div>
                <h3 className="font-heading text-lg font-bold text-text-primary mb-2 line-clamp-2">{story.title}</h3>
                <p className="text-xs text-text-secondary line-clamp-2">
                  Topik: {story.topic}<br/>
                  Tema: {story.theme}
                </p>
              </div>
              <div className="border-t border-border-light bg-surface-soft px-6 py-4 flex items-center justify-between">
                <AssignModal storyId={story.id} storyTitle={story.title} students={students} />
                <Link href={`/pembimbing/koleksi/${story.id}`} className="flex items-center text-sm font-bold text-brand-primary hover:text-brand-primary/80 transition-colors">
                  Baca <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
