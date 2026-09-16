"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors shrink-0"
    >
      <ArrowLeft size={18} />
      Kembali
    </button>
  );
}
