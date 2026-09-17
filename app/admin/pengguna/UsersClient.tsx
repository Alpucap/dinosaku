"use client";

import React, { useState, useTransition } from "react";
import { DataTable, DataTableColumnDef } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Shield, UserX, UserCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUserRole, banUser, unbanUser } from "./actions";
import { Role } from "@prisma/client";
import { toast } from "@/components/ui/toast";

export type AdminUser = {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  status: string;
  suspendedUntil: Date | null;
  energy: number;
};

export function UsersClient({ users }: { users: AdminUser[] }) {
  const [isPending, startTransition] = useTransition();
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("CHILDREN");
  
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [banDuration, setBanDuration] = useState<string>("");

  const handleUpdateRole = () => {
    if (!selectedUser) return;
    startTransition(async () => {
      try {
        await updateUserRole(selectedUser.id, selectedRole);
        toast.add({ title: "Berhasil", description: "Role pengguna berhasil diubah.", type: "success" } as any);
        setIsRoleModalOpen(false);
      } catch (err: any) {
        toast.add({ title: "Gagal", description: err.message, type: "error" } as any);
      }
    });
  };

  const handleBan = () => {
    if (!selectedUser) return;
    startTransition(async () => {
      try {
        const days = banDuration ? parseInt(banDuration, 10) : null;
        await banUser(selectedUser.id, days);
        toast.add({ title: "Berhasil", description: "Pengguna berhasil diblokir.", type: "success" } as any);
        setIsBanModalOpen(false);
      } catch (err: any) {
        toast.add({ title: "Gagal", description: err.message, type: "error" } as any);
      }
    });
  };

  const handleUnban = (userId: string) => {
    startTransition(async () => {
      try {
        await unbanUser(userId);
        toast.add({ title: "Berhasil", description: "Blokir pengguna berhasil dibuka.", type: "success" } as any);
      } catch (err: any) {
        toast.add({ title: "Gagal", description: err.message, type: "error" } as any);
      }
    });
  };

  const columns: DataTableColumnDef<AdminUser>[] = [
    {
      accessorKey: "fullName",
      header: "Pengguna",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                aria-hidden
                className="h-9 w-9 shrink-0 rounded-full bg-surface-soft object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
                {user.fullName.slice(0, 1).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <span className="block truncate font-semibold text-text-primary">
                {user.fullName}
              </span>
              <span className="block truncate text-xs text-text-muted">
                @{user.username}
              </span>
            </div>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        const query = String(value).toLowerCase();
        const name = String(row.original.fullName || "").toLowerCase();
        const username = String(row.original.username || "").toLowerCase();
        return name.includes(query) || username.includes(query);
      },
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Cari nama atau username...",
        filterLabel: "Nama Pengguna",
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      meta: {
        align: "center",
      },
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <div className="text-center text-text-primary font-medium">
            {role}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      meta: {
        align: "center",
      },
      cell: ({ row }) => {
        const status = row.original.status;
        const suspendedUntil = row.original.suspendedUntil;
        
        if (status === "SUSPENDED") {
          return (
            <div className="text-center text-danger font-medium">
              Diblokir {suspendedUntil ? `(sampai ${new Date(suspendedUntil).toLocaleDateString()})` : '(Permanen)'}
            </div>
          );
        }
        return (
          <div className="text-center text-text-primary">
            Aktif
          </div>
        );
      },
    },
    {
      accessorKey: "energy",
      header: "Energi",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.original.energy}
        </div>
      ),
      meta: {
        filterVariant: "numberRange",
        filterLabel: "Energi",
        align: "center",
      },
    },
    {
      id: "actions",
      header: "Aksi",
      meta: {
        align: "center",
      },
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface-soft text-text-muted hover:text-text-primary outline-none transition-colors"
                aria-label="Buka menu"
              >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  setSelectedRole(user.role as Role);
                  setIsRoleModalOpen(true);
                }}
              >
                <Shield className="mr-2 h-4 w-4" />
                Ubah Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.status === "SUSPENDED" ? (
                <DropdownMenuItem onClick={() => handleUnban(user.id)}>
                  <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-green-500">Buka Blokir</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(user);
                    setBanDuration("");
                    setIsBanModalOpen(true);
                  }}
                >
                  <UserX className="mr-2 h-4 w-4 text-red-500" />
                  <span className="text-red-500">Blokir Pengguna</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
      },
    },
  ];

  return (
    <>
      <div className="rounded-xl border border-default bg-surface p-6 shadow-sm">
        <DataTable columns={columns} data={users} />
      </div>

      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Role Pengguna</DialogTitle>
            <DialogDescription>
              Ubah role untuk {selectedUser?.fullName}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val as Role)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CHILDREN">Anak</SelectItem>
                <SelectItem value="PARENTS">Orang Tua</SelectItem>
                <SelectItem value="TEACHER">Guru</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleModalOpen(false)}>Batal</Button>
            <Button onClick={handleUpdateRole} disabled={isPending}>Simpan Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBanModalOpen} onOpenChange={setIsBanModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Blokir Pengguna</DialogTitle>
            <DialogDescription>
              Blokir {selectedUser?.fullName}. Kosongkan durasi untuk memblokir secara permanen.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <label className="text-sm font-medium">Durasi (Hari)</label>
            <Input 
              type="number" 
              placeholder="Contoh: 3 (kosongkan untuk permanen)" 
              value={banDuration}
              onChange={(e) => setBanDuration(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBanModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleBan} disabled={isPending}>Blokir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
