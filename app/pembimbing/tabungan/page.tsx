import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { Plus, Check, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function TargetTabunganPage() {
  const user = await requireRole(["parents", "teacher"]);

  let children: { id: string; fullName: string }[] = [];
  if (user.role === "teacher" && user.classCode) {
    children = await prisma.user.findMany({ where: { role: "CHILDREN", classCode: user.classCode }, select: { id: true, fullName: true } });
  } else if (user.role === "parents") {
    children = await prisma.user.findMany({ where: { role: "CHILDREN", parentId: user.id }, select: { id: true, fullName: true } });
  }

  const childrenIds = children.map((c) => c.id);

  const savings = await prisma.savingGoal.findMany({
    where: { userId: { in: childrenIds } },
    include: { user: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
  });

  async function deleteSavingGoal(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;

    const goal = await prisma.savingGoal.findUnique({ where: { id }, select: { userId: true } });
    if (!goal || !childrenIds.includes(goal.userId)) return;

    await prisma.savingGoal.delete({ where: { id } });
    revalidatePath("/pembimbing/tabungan");
  }

  async function createSavingGoal(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const title = formData.get("title") as string;
    const targetAmount = parseInt(formData.get("targetAmount") as string);
    const currentAmount = parseInt(formData.get("currentAmount") as string) || 0;

    if (!userId || !title || !targetAmount) return;
    if (!childrenIds.includes(userId)) return;

    await prisma.savingGoal.create({
      data: {
        userId,
        title,
        targetAmount,
        currentAmount,
        isCompleted: currentAmount >= targetAmount,
      },
    });

    revalidatePath("/pembimbing/tabungan");
  }

  const inputClass =
    "w-full bg-surface-soft border border-border-strong rounded-lg p-2 text-sm focus:border-brand-primary outline-none transition-colors";
  const labelClass = "block text-[11px] uppercase tracking-wider font-bold text-text-secondary mb-1";

  return (
    <div className="learning-page w-full">
      <header className="page-heading">
        <p className="eyebrow">Manajemen Murid / Anak</p>
        <h1>Target Tabungan</h1>
        <p>Buat target barang impian dan pantau perkembangan tabungan anak secara terpusat.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-5 items-start">
        <form action={createSavingGoal} className="rounded-xl border border-default bg-surface p-5 flex flex-col gap-4 md:col-span-2">
          <h3 className="font-bold text-text-primary text-sm">Buat Target Baru</h3>

          <div>
            <label className={labelClass}>Pilih Anak</label>
            <select name="userId" required className={inputClass}>
              <option value="">-- Pilih Anak --</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Nama Impian</label>
            <input type="text" name="title" required placeholder="Cth: Sepatu Bola" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Target (Rp)</label>
            <input type="number" name="targetAmount" required placeholder="100000" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Terkumpul (Rp)</label>
            <input type="number" name="currentAmount" defaultValue="0" className={inputClass} />
          </div>

          <button
            type="submit"
            className="mt-2 w-full flex items-center justify-center gap-2 bg-brand-accent text-white font-bold py-2.5 px-4 rounded-lg hover:bg-brand-accent/90 transition-colors text-sm shadow-sm"
          >
            <Plus size={16} /> Tambah
          </button>
        </form>

        <div className="md:col-span-3 rounded-xl border border-default bg-surface overflow-hidden flex flex-col h-full min-h-[300px]">
          <div className="border-b border-border-light bg-surface-soft px-4 py-3 flex items-center justify-between gap-2">
            <h3 className="font-heading text-sm font-bold text-text-primary">Daftar Impian</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{savings.length} target</span>
          </div>
          {savings.length === 0 ? (
            <div className="p-8 text-center text-text-secondary text-sm flex-1 flex items-center justify-center">
              Belum ada target tabungan.
            </div>
          ) : (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1 max-h-[560px] custom-scrollbar">
              {savings.map((goal) => {
                const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
                return (
                  <div key={goal.id} className="flex flex-col gap-3 rounded-xl border border-border-light bg-surface-soft p-4 relative group">
                    <form action={deleteSavingGoal} className="absolute top-2 right-2 z-10">
                      <input type="hidden" name="id" value={goal.id} />
                      <button
                        type="submit"
                        className="text-text-muted hover:text-brand-danger transition-colors p-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 focus-visible:opacity-100"
                        title="Hapus target tabungan"
                        aria-label={`Hapus target ${goal.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                    <div className="flex items-center justify-between gap-2 pr-8">
                      <div className="min-w-0">
                        <h3 className="font-bold text-text-primary text-sm">{goal.title}</h3>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          Untuk: <span className="font-semibold text-brand-primary">{goal.user.fullName}</span>
                        </p>
                      </div>
                      {goal.isCompleted && (
                        <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-[#10b981]/10 text-[#10b981] px-2 py-1 rounded-md shrink-0">
                          <Check size={10} /> Tercapai
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-bold text-brand-primary">Rp {goal.currentAmount.toLocaleString("id-ID")}</span>
                        <span className="text-text-secondary font-medium">
                          {percentage}% dari Rp {goal.targetAmount.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-brand-accent transition-all duration-500" style={{ width: percentage + "%" }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
