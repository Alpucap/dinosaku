"use client";

import { Printer } from "lucide-react";

export function PrintReportButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-2 px-4 py-2 border border-border-strong text-text-primary text-sm font-bold rounded-lg hover:bg-surface-soft transition-colors w-max"
    >
      <Printer size={16} /> Cetak / Simpan PDF
    </button>
  );
}
