"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function ClassCodeCard({ initialCode }: { initialCode?: string | null }) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const runGenerate = async () => {
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      const res = await fetch("/api/pembimbing/generate-class-code", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Gagal membuat kode kelas.");
        return;
      }

      setCode(data.classCode);
      setNotice(
        data.migratedStudents > 0
          ? `Kode baru dibuat. ${data.migratedStudents} murid yang sudah tergabung otomatis ikut ke kode ini.`
          : "Kode kelas berhasil dibuat.",
      );
      router.refresh();
    } catch {
      setError("Tidak bisa menghubungi server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateClick = () => {
    // Kode pertama kali tidak perlu konfirmasi — belum ada apa pun yang
    // dipertaruhkan. Regenerate mengganti kode yang sudah dibagikan, jadi
    // butuh persetujuan eksplisit lewat dialog, bukan langsung jalan.
    if (code) {
      setConfirmOpen(true);
    } else {
      runGenerate();
    }
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    runGenerate();
  };

  return (
    <div className="rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-5 flex items-start gap-4">
      <div className="h-10 w-10 bg-brand-primary text-white rounded-full flex items-center justify-center shrink-0">
        <KeyRound size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-brand-primary">Kode Kelas Anda</h3>
        <p className="text-sm text-text-secondary mt-1">
          Bagikan kode ini kepada murid-murid Anda agar otomatis masuk ke
          daftar pantauan Anda saat mereka bergabung.
        </p>

        {code ? (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="bg-white border border-border-strong px-4 py-2 rounded-lg font-mono font-bold text-lg inline-block text-text-primary tracking-widest shadow-sm">
              {code}
            </div>
            <button
              type="button"
              onClick={handleGenerateClick}
              disabled={loading}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              Buat kode baru
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleGenerateClick}
            disabled={loading}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <KeyRound size={16} />
            )}
            {loading ? "Membuat..." : "Buat Kode Kelas"}
          </button>
        )}

        {error && (
          <p role="alert" className="mt-2 text-sm font-medium text-danger">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-2 text-sm font-medium text-success">
            {notice}
          </p>
        )}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="border-t-4 border-brand-primary">
          <DialogHeader>
            <DialogTitle className="text-lg text-primary">
              Buat kode kelas baru?
            </DialogTitle>
            <DialogDescription>
              Kode lama (
              <span className="font-mono font-bold text-text-primary">
                {code}
              </span>
              ) tidak akan berlaku lagi untuk murid baru. Murid yang sudah
              tergabung otomatis ikut ke kode barunya, jadi kelas Anda tidak
              berantakan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              className="rounded-lg"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirm}
              className="rounded-lg bg-brand-primary text-white hover:bg-brand-primary-hover"
            >
              Ya, buat kode baru
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
