"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Plus, MoreVertical, Pencil, Trash, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ClassManagerClient({ initialClasses, teacherId }: { initialClasses: any[], teacherId: string }) {
  const router = useRouter();
  const [classes, setClasses] = useState(initialClasses);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/pembimbing/kelas", {
        method: "POST",
        body: JSON.stringify({ name: newName }),
      });
      const data = await res.json();
      if (data.success) {
        setClasses([data.classroom, ...classes]);
        setNewName("");
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kelas ini? Semua murid di dalamnya tidak akan terhubung lagi.")) return;
    try {
      const res = await fetch(`/api/pembimbing/kelas/${id}`, { method: "DELETE" });
      if (res.ok) {
        setClasses(classes.filter(c => c.id !== id));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Kode kelas ${code} disalin!`);
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="bg-surface border border-border p-5 rounded-xl flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-sm font-semibold text-text-primary block mb-1">Nama Kelas Baru</label>
          <Input 
            placeholder="Contoh: Cerdas Keuangan 4A" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleCreate} disabled={isLoading || !newName.trim()} className="bg-brand-primary text-white hover:bg-brand-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          Buat Kelas
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {classes.map(cls => (
          <div key={cls.id} className="bg-surface border border-border p-5 rounded-xl shadow-sm relative group">
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface-soft text-text-muted hover:text-text-primary outline-none">
                  <MoreVertical className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => alert("Fitur edit menyusul (bisa diedit lewat API PUT).")} className="cursor-pointer">
                    <Pencil className="w-4 h-4 mr-2" /> Ubah Nama
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(cls.id)} className="cursor-pointer text-destructive focus:text-destructive">
                    <Trash className="w-4 h-4 mr-2" /> Hapus Kelas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h3 className="font-bold text-lg text-text-primary pr-8">{cls.name}</h3>
            
            <div className="mt-4 flex items-center justify-between bg-brand-primary/5 border border-brand-primary/20 p-3 rounded-lg">
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">Kode Kelas</p>
                <p className="font-mono text-xl font-bold tracking-widest text-brand-primary">{cls.code}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyCode(cls.code)} className="text-brand-primary border-brand-primary/30">
                <Copy className="w-4 h-4 mr-2" /> Salin
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-border-light flex justify-between items-center text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {cls._count?.students || 0} Murid
              </span>
              <a href={`/pembimbing/anak?classId=${cls.id}`} className="text-brand-primary font-bold hover:underline">Kelola Murid &rarr;</a>
            </div>
          </div>
        ))}

        {classes.length === 0 && (
          <div className="sm:col-span-2 text-center p-8 border-2 border-dashed border-border-strong rounded-xl text-text-secondary">
            Belum ada kelas. Buat kelas pertama Anda di atas.
          </div>
        )}
      </div>
    </div>
  );
}
