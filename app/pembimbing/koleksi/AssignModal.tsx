'use client';
import React, { useState } from 'react';
import { Users, Plus, Loader2, X } from 'lucide-react';
import { toast } from '@/components/ui/toast';
import { assignExistingStory } from '../cerita/actions';
import { useRouter } from 'next/navigation';

export default function AssignModal({ storyId, storyTitle, students }: { storyId: string, storyTitle: string, students: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAssign = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      await assignExistingStory(storyId, storyTitle, selected);
      toast.add({ title: 'Berhasil ditugaskan!', type: 'success' });
      setIsOpen(false);
      setSelected([]);
      router.refresh();
    } catch(e: any) {
      toast.add({ title: e.message || 'Gagal menugaskan', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-1 text-sm font-bold text-info hover:text-info/80 transition-colors">
        <Users size={16} /> Tugaskan
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border w-full max-w-md rounded-2xl p-6 shadow-xl relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-text-muted hover:text-text-primary">
              <X size={20} />
            </button>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-1">Tugaskan Cerita</h3>
            <p className="text-sm text-text-secondary mb-4 line-clamp-1">"{storyTitle}"</p>
            
            <div className="max-h-60 overflow-y-auto space-y-2 mb-6 p-1">
              {students.length === 0 && <p className="text-sm text-text-muted">Tidak ada murid.</p>}
              {students.map(s => (
                <label key={s.id} className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-surface-soft">
                  <input type="checkbox" className="w-4 h-4 rounded text-brand-primary" checked={selected.includes(s.id)} onChange={(e) => {
                    if (e.target.checked) setSelected([...selected, s.id]);
                    else setSelected(selected.filter(id => id !== s.id));
                  }} />
                  <div>
                    <p className="text-sm font-bold">{s.fullName}</p>
                    <p className="text-xs text-text-muted">@{s.username}</p>
                  </div>
                </label>
              ))}
            </div>

            <button onClick={handleAssign} disabled={loading || selected.length === 0} className="w-full button-primary py-3 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Bagikan ke {selected.length} Murid</>}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
