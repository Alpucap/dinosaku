"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";

export function JoinClassForm({ currentCode }: { currentCode?: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/learn/join-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Gagal bergabung ke kelas.");
        return;
      }

      setSuccess(
        `Berhasil! Kamu sekarang di kelas ${data.classCode} bersama ${data.teacherName}.`,
      );
      setCode("");
      router.refresh();
    } catch {
      setError("Tidak bisa menghubungi server. Cek koneksimu, ya.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label
        htmlFor="classCode"
        className="text-sm font-bold text-text-primary"
      >
        {currentCode ? "Pindah ke kelas lain" : "Masukkan kode kelas"}
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <KeyRound
            size={18}
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            id="classCode"
            name="classCode"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="MISAL: DINO-4A"
            autoComplete="off"
            maxLength={24}
            className="h-12 w-full rounded-lg border-2 border-border bg-surface pl-11 pr-4 font-mono text-base tracking-widest text-text-primary outline-none transition-colors placeholder:tracking-normal placeholder:font-sans placeholder:text-text-muted focus:border-brand-primary"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !code.trim()}
          className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-primary px-6 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting && <Loader2 size={18} className="animate-spin" />}
          {submitting ? "Memeriksa..." : "Gabung"}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="text-sm font-medium text-success">
          {success}
        </p>
      )}
    </form>
  );
}
