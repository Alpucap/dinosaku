'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UnlinkButton({ role, childName, childId }: { role: string, childName: string, childId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const actionText = role === 'teacher' ? 'Keluarkan' : 'Putuskan';
  
  const handleUnlink = async () => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin ${actionText.toLowerCase()} akses ${childName} dari dasbor ini?`);
    if (confirmed) {
      setLoading(true);
      try {
        const res = await fetch('/api/pembimbing/unlink', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ childId })
        });
        if (res.ok) {
          router.refresh();
        } else {
          alert('Gagal mengeluarkan anak.');
        }
      } catch (e) {
        alert('Terjadi kesalahan koneksi.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button 
      onClick={handleUnlink}
      disabled={loading}
      className="text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg px-2 py-1 text-[11px] font-bold transition-colors"
    >
      {loading ? 'Memproses...' : actionText}
    </button>
  );
}
