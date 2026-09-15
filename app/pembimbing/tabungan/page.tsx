import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { PiggyBank, Target, Plus, Check } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function TabunganPage() {
  const user = await requireRole(["parents", "teacher"]);

  let children: any[] = [];
  if (user.role === 'teacher' && user.classCode) {
    children = await prisma.user.findMany({ where: { role: 'CHILDREN', classCode: user.classCode }, select: { id: true, fullName: true } });
  } else if (user.role === 'parents') {
    children = await prisma.user.findMany({ where: { role: 'CHILDREN', parentId: user.id }, select: { id: true, fullName: true } });
  }

  const childrenIds = children.map(c => c.id);

  const savings = await prisma.savingGoal.findMany({
    where: { userId: { in: childrenIds } },
    include: { user: { select: { fullName: true } } },
    orderBy: { createdAt: 'desc' }
  });

  async function createSavingGoal(formData: FormData) {
    'use server';
    const userId = formData.get('userId') as string;
    const title = formData.get('title') as string;
    const targetAmount = parseInt(formData.get('targetAmount') as string);
    const currentAmount = parseInt(formData.get('currentAmount') as string) || 0;

    if (!userId || !title || !targetAmount) return;

    await prisma.savingGoal.create({
      data: {
        userId,
        title,
        targetAmount,
        currentAmount,
        isCompleted: currentAmount >= targetAmount
      }
    });

    revalidatePath('/pembimbing/tabungan');
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-text-primary">
            Target Tabungan
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Pantau barang impian yang sedang ditabung oleh anak.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 items-start">
        {/* Form Tambah Target */}
        <form action={createSavingGoal} className="rounded-xl border border-default bg-surface p-5 flex flex-col gap-4 md:col-span-1 md:sticky md:top-6">
          <h3 className="font-bold text-text-primary border-b border-border-light pb-2">Buat Target Baru</h3>
          
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">Pilih Anak</label>
            <select name="userId" required className="w-full bg-surface-soft border border-border-strong rounded-lg p-2.5 text-sm">
              <option value="">-- Pilih Anak --</option>
              {children.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">Nama Impian (Barang)</label>
            <input type="text" name="title" required placeholder="Cth: Sepatu Bola Baru" className="w-full bg-surface-soft border border-border-strong rounded-lg p-2.5 text-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">Target Nominal (Rp)</label>
            <input type="number" name="targetAmount" required placeholder="100000" className="w-full bg-surface-soft border border-border-strong rounded-lg p-2.5 text-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">Tabungan Terkumpul Saat Ini (Rp)</label>
            <input type="number" name="currentAmount" defaultValue="0" className="w-full bg-surface-soft border border-border-strong rounded-lg p-2.5 text-sm" />
          </div>

          <button type="submit" className="mt-2 w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-primary/90 transition-colors">
            <Plus size={18} /> Tambah Target
          </button>
        </form>

        {/* Daftar Target Tabungan */}
        <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
          {savings.length === 0 ? (
            <div className="col-span-2 text-center py-10 rounded-xl border border-default bg-surface text-text-secondary">
              Belum ada target tabungan yang dibuat.
            </div>
          ) : (
            savings.map((goal) => {
              const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
              return (
                <div key={goal.id} className="flex flex-col gap-4 rounded-xl border border-default bg-surface p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-brand-accent-soft rounded-full flex items-center justify-center text-brand-primary">
                        <Target size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary">{goal.title}</h3>
                        <p className="text-xs text-text-muted">{goal.user.fullName}</p>
                      </div>
                    </div>
                    {goal.isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full">
                        <Check size={12} /> Tercapai
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-brand-primary">Rp {goal.currentAmount.toLocaleString('id-ID')}</span>
                      <span className="text-text-secondary">dari Rp {goal.targetAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="h-3 w-full bg-surface-soft rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-primary transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-right text-text-muted">{percentage}% Terkumpul</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
