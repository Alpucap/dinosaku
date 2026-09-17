"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Flame, Star, Medal, UserRound, ChevronRight, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import UnlinkButton from "@/components/dino/UnlinkButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AnakListClient({ 
  childrenList, 
  classrooms, 
  role 
}: { 
  childrenList: any[]; 
  classrooms: any[]; 
  role: string;
}) {
  const searchParams = useSearchParams();
  const initialClassId = searchParams.get("classId");
  const isValidClassId = classrooms.some(c => c.id === initialClassId);
  const defaultClass = isValidClassId ? initialClassId! : "all";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState(defaultClass);

  const classroomsMap = useMemo(() => {
    const map = new Map<string, string>();
    classrooms.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [classrooms]);

  const filteredChildren = useMemo(() => {
    return childrenList.filter(child => {
      // 1. Filter by Search Query
      const matchesSearch = child.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            child.username.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // 2. Filter by Class (Only for teachers)
      if (role.toLowerCase() === "teacher" && selectedClass !== "all") {
        const isInClass = child.joinedClasses?.some((c: any) => c.id === selectedClass);
        if (!isInClass) return false;
      }

      return true;
    });
  }, [childrenList, searchQuery, selectedClass, role]);

  return (
    <div className="space-y-6">
      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-4 bg-surface border border-border p-4 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input 
            placeholder="Cari nama atau username..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {role.toLowerCase() === "teacher" && (
          <div className="w-full sm:w-64">
            <Select value={selectedClass} onValueChange={(val) => setSelectedClass(val || 'all')}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-1 text-text-muted shrink-0" />
                <SelectValue placeholder="Semua Kelas">
                  {(val) => (!val || val === "all" ? "Semua Kelas" : classroomsMap.get(val) || "Semua Kelas")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {classrooms.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* LIST */}
      {filteredChildren.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-strong bg-surface px-6 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-soft text-text-muted">
            <UserRound className="h-6 w-6" />
          </span>
          <p className="text-sm font-semibold text-text-primary">
            Tidak ada murid yang cocok
          </p>
          <p className="max-w-sm text-sm text-text-secondary">
            Coba ganti kata kunci pencarian atau filter kelas Anda.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredChildren.map((child) => {
            const game = child.gamification;

            return (
              <li
                key={child.id}
                className="flex flex-col gap-4 rounded-xl border border-default bg-surface p-5 transition-shadow hover:shadow-card"
              >
                <Link
                  href={`/pembimbing/anak/${child.id}`}
                  className="group flex items-center gap-3"
                >
                  {child.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={child.avatarUrl}
                      alt=""
                      aria-hidden
                      className="h-12 w-12 shrink-0 rounded-full bg-surface-soft object-cover ring-2 ring-border"
                    />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary text-base font-bold text-white">
                      {child.fullName.slice(0, 1).toUpperCase()}
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-base font-bold text-text-primary group-hover:text-brand-primary group-hover:underline">
                      {child.fullName}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      @{child.username}
                    </p>
                  </div>
                  <ChevronRight size={18} className="shrink-0 text-text-muted group-hover:text-brand-primary" />
                </Link>

                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {child.joinedClasses?.map((c: any) => (
                      <span key={c.id} className="rounded-full bg-brand-accent-soft px-2.5 py-1 text-[10px] font-semibold text-brand-primary truncate max-w-[120px]">
                        {c.name}
                      </span>
                    ))}
                  </div>
                  <UnlinkButton role={role} childName={child.fullName} childId={child.id} classId={selectedClass !== 'all' ? selectedClass : undefined} />
                </div>

                {game ? (
                  <dl className="grid grid-cols-3 gap-2 border-t border-border-light pt-3 text-center">
                    <div>
                      <dt className="sr-only">Poin</dt>
                      <dd className="flex items-center justify-center gap-1 font-heading text-sm font-bold text-text-primary">
                        <Star className="h-3.5 w-3.5 text-brand-accent" />
                        {game.totalPoints}
                      </dd>
                      <p className="text-[11px] text-text-muted">Poin</p>
                    </div>
                    <div>
                      <dt className="sr-only">Runtutan hari</dt>
                      <dd className="flex items-center justify-center gap-1 font-heading text-sm font-bold text-text-primary">
                        <Flame className="h-3.5 w-3.5 text-brand-primary" />
                        {game.currentStreak}
                      </dd>
                      <p className="text-[11px] text-text-muted">Hari</p>
                    </div>
                    <div>
                      <dt className="sr-only">Lencana</dt>
                      <dd className="flex items-center justify-center gap-1 font-heading text-sm font-bold text-text-primary">
                        <Medal className="h-3.5 w-3.5 text-brand-primary" />
                        {child.userBadges?.length || 0}
                      </dd>
                      <p className="text-[11px] text-text-muted">Lencana</p>
                    </div>
                  </dl>
                ) : (
                  <p className="border-t border-border-light pt-3 text-xs text-text-muted">
                    Belum ada aktivitas belajar yang tercatat.
                  </p>
                )}

                {child.activities && child.activities.length > 0 && (
                  <div className="border-t border-border-light pt-3">
                    <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Aktivitas Terakhir</p>
                    <p className="text-xs text-brand-primary font-semibold truncate bg-brand-primary/5 px-2 py-1 rounded-md">
                      {child.activities[0].title}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
