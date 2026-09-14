import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { PiggyBank, Target, Plus, Check } from "lucide-react";

export default async function TabunganPage() {
  const user = await requireRole(["parents", "teacher"]);

  let childrenIds = [];
  if (user.role === 'teacher' && user.classCode) {
    const children = await prisma.user.findMany({ where: { role: 'CHILDREN', classCode: user.classCode }, select: { id: true } });
    childrenIds = children.map((c: any) => c.id);
  } else if (user.role === 'parents') {
    const children = await prisma.user.findMany({ where: { role: 'CHILDREN', parentId: user.id }, select: { id: true } });
    childrenIds = children.map((c: any) => c.id);
  }

  const savings = await prisma.savingGoal.findMany({
    where: { userId: { in: childrenIds } },
    include: { user: { select: { fullName: true } } },
    orderBy: { createdAt: 'desc' }
  });

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
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-brand-primary/90 transition-colors w-max">
          <Plus size={16} /> Tambah Target
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
  );
}
