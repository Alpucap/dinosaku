import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { Target, CheckCircle, Clock, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";
import CeritaClient from "../cerita/CeritaClient";

export default async function AksiDanMisiPage() {
  const user = await requireRole(["parents", "teacher"]);

  let children: any[] = [];
  if (user.role === 'teacher' ) {
    children = await prisma.user.findMany({ where: { role: 'CHILDREN', joinedClasses: { some: { teacherId: user.id } } }, select: { id: true, fullName: true } });
  } else if (user.role === 'parents') {
    children = await prisma.user.findMany({ where: { role: 'CHILDREN', parentId: user.id }, select: { id: true, fullName: true } });
  }

  // Fetch Assignments
  const assignments = await prisma.assignment.findMany({
    where: { assignerId: user.id },
    include: { assignee: { select: { fullName: true } } },
    orderBy: { createdAt: 'desc' }
  });

  // Server Actions
  async function createAssignment(formData: FormData) {
    'use server';
    const assigneeId = formData.get('assigneeId') as string;
    const topic = formData.get('topic') as string;
    const theme = formData.get('theme') as string;

    if (!assigneeId || !topic || !theme) return;

    await prisma.assignment.create({
      data: {
        assignerId: user.id,
        assigneeId,
        topic,
        theme,
        status: 'PENDING'
      }
    });

    revalidatePath('/pembimbing/aksi');
  }

  return (
    <div className="learning-page w-full">
      <header className="page-heading">
        <p className="eyebrow">Manajemen Murid / Anak</p>
        <h1>Aksi & Misi</h1>
        <p>Berikan tugas misi dan cerita finansial untuk anak, lalu pantau penyelesaiannya.</p>
      </header>
      
      <div className="flex flex-col gap-12 w-full">
        {user.role === 'teacher' ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 pb-2 border-b-2 border-border">
              <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
                <Target size={24} />
              </div>
              <h2 className="text-xl font-heading font-bold text-primary">Misi & Cerita</h2>
            </div>

            <CeritaClient />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 pb-2 border-b-2 border-border">
              <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
                <Target size={24} />
              </div>
              <h2 className="text-xl font-heading font-bold text-primary">Misi & Cerita</h2>
            </div>

            <div className="grid md:grid-cols-5 gap-6 items-start">
              <form action={createAssignment} className="rounded-xl border border-default bg-surface p-5 flex flex-col gap-4 md:col-span-2">
                <h3 className="font-bold text-text-primary text-sm">Beri Misi Baru</h3>
                
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-text-secondary mb-1">Pilih Anak</label>
                  <select name="assigneeId" required className="w-full bg-surface-soft border border-border-strong rounded-lg p-2 text-sm focus:border-brand-primary outline-none transition-colors">
                    <option value="">-- Pilih Anak --</option>
                    {children.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-text-secondary mb-1">Topik Misi</label>
                  <input type="text" name="topic" required placeholder="Cth: Belajar Hemat" className="w-full bg-surface-soft border border-border-strong rounded-lg p-2 text-sm focus:border-brand-primary outline-none transition-colors" />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-text-secondary mb-1">Tema Cerita</label>
                  <input type="text" name="theme" required placeholder="Cth: Petualangan di Hutan" className="w-full bg-surface-soft border border-border-strong rounded-lg p-2 text-sm focus:border-brand-primary outline-none transition-colors" />
                </div>

                <button type="submit" className="mt-2 w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-brand-primary/90 transition-colors text-sm shadow-sm">
                  <Plus size={16} /> Beri Tugas
                </button>
              </form>

              <div className="md:col-span-3 rounded-xl border border-default bg-surface overflow-hidden flex flex-col h-full min-h-[300px]">
                <div className="border-b border-border-light bg-surface-soft px-4 py-3">
                  <h3 className="font-heading text-sm font-bold text-text-primary">Riwayat Penugasan</h3>
                </div>
                {assignments.length === 0 ? (
                  <div className="p-8 text-center text-text-secondary text-sm flex-1 flex items-center justify-center">
                    Belum ada misi yang diberikan.
                  </div>
                ) : (
                  <ul className="divide-y divide-border-light overflow-y-auto flex-1 max-h-[400px] custom-scrollbar">
                    {assignments.map(a => (
                      <li key={a.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-soft transition-colors">
                        <div>
                          <p className="font-bold text-text-primary text-sm">Misi: {a.topic}</p>
                          <p className="text-xs text-text-secondary mt-1">Untuk <span className="font-semibold text-brand-primary">{a.assignee.fullName}</span></p>
                          <p className="text-[10px] text-text-muted mt-0.5">Tema: {a.theme}</p>
                        </div>
                        <div className="shrink-0">
                          {a.status === 'COMPLETED' ? (
                            <span className="flex w-fit items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded-md">
                              <CheckCircle size={12} /> Selesai
                            </span>
                          ) : (
                            <span className="flex w-fit items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#d97706] bg-[#d97706]/10 px-2 py-1 rounded-md">
                              <Clock size={12} /> Menunggu
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
