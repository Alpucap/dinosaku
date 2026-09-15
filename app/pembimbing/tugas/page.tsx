import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { Target, CheckCircle, Clock } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function PenugasanPage() {
  const user = await requireRole(["parents", "teacher"]);

  let children: any[] = [];
  if (user.role === 'teacher' && user.classCode) {
    children = await prisma.user.findMany({ where: { role: 'CHILDREN', classCode: user.classCode }, select: { id: true, fullName: true } });
  } else if (user.role === 'parents') {
    children = await prisma.user.findMany({ where: { role: 'CHILDREN', parentId: user.id }, select: { id: true, fullName: true } });
  }

  const assignments = await prisma.assignment.findMany({
    where: { assignerId: user.id },
    include: { assignee: { select: { fullName: true } } },
    orderBy: { createdAt: 'desc' }
  });

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

    revalidatePath('/pembimbing/tugas');
  }

  return (
    <div className="learning-page">
      <header className="page-heading">
        <p className="eyebrow">Manajemen Murid / Anak</p>
        <h1>Berikan Tugas</h1>
        <p>Berikan tugas cerita edukasi kepada anak dengan topik dan tema tertentu.</p>
      </header>
      <div className="flex flex-col gap-6 max-w-4xl">

      <div className="grid gap-6 md:grid-cols-3 items-start">
        <form action={createAssignment} className="rounded-xl border border-default bg-surface p-5 flex flex-col gap-4 md:col-span-1 md:sticky md:top-6">
          <h3 className="font-bold text-text-primary border-b border-border-light pb-2">Buat Misi Baru</h3>
          
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">Pilih Anak</label>
            <select name="assigneeId" required className="w-full bg-surface-soft border border-border-strong rounded-lg p-2.5 text-sm">
              <option value="">-- Pilih Anak --</option>
              {children.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">Topik Belajar</label>
            <select name="topic" required className="w-full bg-surface-soft border border-border-strong rounded-lg p-2.5 text-sm">
              <option value="">-- Pilih Topik --</option>
              <option value="Menabung">Menabung</option>
              <option value="Mendapat Uang">Mendapat Uang</option>
              <option value="Kebutuhan vs Keinginan">Kebutuhan vs Keinginan</option>
              <option value="Investasi">Investasi Sederhana</option>
              <option value="Anggaran">Membuat Anggaran</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">Tema Cerita</label>
            <select name="theme" required className="w-full bg-surface-soft border border-border-strong rounded-lg p-2.5 text-sm">
              <option value="">-- Pilih Tema --</option>
              <option value="Luar Angkasa">Luar Angkasa</option>
              <option value="Kebun Binatang">Kebun Binatang</option>
              <option value="Bawah Laut">Bawah Laut</option>
              <option value="Hutan Ajaib">Hutan Ajaib</option>
              <option value="Kota Robot">Kota Robot</option>
            </select>
          </div>

          <button type="submit" className="mt-2 w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-primary/90 transition-colors">
            <Target size={18} /> Beri Tugas
          </button>
        </form>

        <div className="md:col-span-2 rounded-xl border border-default bg-surface overflow-hidden">
          <div className="border-b border-border-light bg-surface-soft px-5 py-4">
            <h3 className="font-heading text-base font-bold text-text-primary">Riwayat Penugasan</h3>
          </div>
          {assignments.length === 0 ? (
            <div className="p-10 text-center text-text-secondary text-sm">
              Belum ada misi yang diberikan.
            </div>
          ) : (
            <ul className="divide-y divide-border-light">
              {assignments.map(a => (
                <li key={a.id} className="p-5 flex items-center justify-between hover:bg-surface-soft transition-colors">
                  <div>
                    <p className="font-bold text-text-primary">Misi: {a.topic}</p>
                    <p className="text-sm text-text-secondary">Untuk <span className="font-semibold">{a.assignee.fullName}</span> • Tema: {a.theme}</p>
                  </div>
                  <div>
                    {a.status === 'COMPLETED' ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-[#10b981] bg-[#10b981]/10 px-3 py-1.5 rounded-full">
                        <CheckCircle size={14} /> Selesai
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-[#d97706] bg-[#d97706]/10 px-3 py-1.5 rounded-full">
                        <Clock size={14} /> Menunggu
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
    </div>
  );
}
