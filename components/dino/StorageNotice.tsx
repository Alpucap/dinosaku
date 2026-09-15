'use client';
import { useProgress } from '@/lib/use-progress';

export default function StorageNotice() {
  const { storageUnavailable } = useProgress();
  return storageUnavailable ? <p role="status" className="bg-warning-soft px-5 py-3 text-sm text-primary">Penyimpanan browser tidak tersedia. Progres hanya tersimpan selama halaman ini terbuka.</p> : null;
}
