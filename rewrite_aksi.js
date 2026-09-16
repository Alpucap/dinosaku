const fs = require('fs');

let pageStr = fs.readFileSync('app/pembimbing/aksi/page.tsx', 'utf-8');

if (!pageStr.includes('CeritaClient')) {
  pageStr = pageStr.replace('import { revalidatePath } from "next/cache";', 'import { revalidatePath } from "next/cache";\nimport CeritaClient from "../cerita/CeritaClient";');
}

const newReturn = `
  return (
    <div className="learning-page w-full">
      <header className="page-heading">
        <p className="eyebrow">Manajemen Murid / Anak</p>
        <h1>Aksi & Misi</h1>
        <p>Berikan tugas misi finansial dan pantau target barang impian anak secara terpusat.</p>
      </header>
      
      <div className="flex flex-col gap-12 w-full">
        {user.role === 'teacher' ? (
          <div>
            <CeritaClient />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 pb-2 border-b-2 border-border">
              <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
                <Target size={24} />
              </div>
              <h2 className="text-xl font-heading font-bold text-primary">Misi & Cerita (Orang Tua)</h2>
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

        {/* TARGET TABUNGAN (BOTH) */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-2 border-b-2 border-border">
            <div className="bg-brand-accent/10 p-2 rounded-lg text-brand-accent">
              <PiggyBank size={24} />
            </div>
            <h2 className="text-xl font-heading font-bold text-primary">Target Tabungan</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-5 items-start">
            <form action={createSavingGoal} className="rounded-xl border border-default bg-surface p-5 flex flex-col gap-4 md:col-span-2">
              <h3 className="font-bold text-text-primary text-sm">Buat Target Baru</h3>
              
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-text-secondary mb-1">Pilih Anak</label>
                <select name="userId" required className="w-full bg-surface-soft border border-border-strong rounded-lg p-2 text-sm focus:border-brand-primary outline-none transition-colors">
                  <option value="">-- Pilih Anak --</option>
                  {children.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-text-secondary mb-1">Nama Impian</label>
                <input type="text" name="title" required placeholder="Cth: Sepatu Bola" className="w-full bg-surface-soft border border-border-strong rounded-lg p-2 text-sm focus:border-brand-primary outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-text-secondary mb-1">Target (Rp)</label>
                <input type="number" name="targetAmount" required placeholder="100000" className="w-full bg-surface-soft border border-border-strong rounded-lg p-2 text-sm focus:border-brand-primary outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-text-secondary mb-1">Terkumpul (Rp)</label>
                <input type="number" name="currentAmount" defaultValue="0" className="w-full bg-surface-soft border border-border-strong rounded-lg p-2 text-sm focus:border-brand-primary outline-none transition-colors" />
              </div>

              <button type="submit" className="mt-2 w-full flex items-center justify-center gap-2 bg-brand-accent text-white font-bold py-2.5 px-4 rounded-lg hover:bg-brand-accent/90 transition-colors text-sm shadow-sm">
                <Plus size={16} /> Tambah
              </button>
            </form>

            <div className="md:col-span-3 rounded-xl border border-default bg-surface overflow-hidden flex flex-col h-full min-h-[300px]">
              <div className="border-b border-border-light bg-surface-soft px-4 py-3">
                <h3 className="font-heading text-sm font-bold text-text-primary">Daftar Impian</h3>
              </div>
              {savings.length === 0 ? (
                <div className="p-8 text-center text-text-secondary text-sm flex-1 flex items-center justify-center">
                  Belum ada target tabungan.
                </div>
              ) : (
                <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1 max-h-[400px] custom-scrollbar">
                  {savings.map((goal) => {
                    const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
                    return (
                      <div key={goal.id} className="flex flex-col gap-3 rounded-xl border border-border-light bg-surface-soft p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-text-primary text-sm">{goal.title}</h3>
                            <p className="text-[10px] text-text-muted mt-0.5">Untuk: <span className="font-semibold text-brand-primary">{goal.user.fullName}</span></p>
                          </div>
                          {goal.isCompleted && (
                            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-[#10b981]/10 text-[#10b981] px-2 py-1 rounded-md shrink-0">
                              <Check size={10} /> Tercapai
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="font-bold text-brand-primary">Rp {goal.currentAmount.toLocaleString('id-ID')}</span>
                            <span className="text-text-secondary font-medium">Rp {goal.targetAmount.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-accent transition-all duration-500"
                              style={{ width: percentage + '%' }}
                            />
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
      </div>
    </div>
  );
}
`;

pageStr = pageStr.substring(0, pageStr.indexOf('  return (')) + newReturn;

fs.writeFileSync('app/pembimbing/aksi/page.tsx', pageStr);
