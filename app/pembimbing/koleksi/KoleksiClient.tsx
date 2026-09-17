"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, ChevronRight, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import AssignModal from "./AssignModal";

type Story = {
  id: string;
  title: string;
  topic: string;
  theme: string;
  createdAt: Date;
  _count: { assignments: number };
};

type Student = { id: string; fullName: string; username: string };

export default function KoleksiClient({
  stories,
  students,
  deleteStory,
}: {
  stories: Story[];
  students: Student[];
  deleteStory: (formData: FormData) => void;
}) {
  const [search, setSearch] = useState("");

  const filteredStories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return stories;
    return stories.filter((story) =>
      [story.title, story.topic, story.theme].some((field) =>
        field.toLowerCase().includes(query)
      )
    );
  }, [stories, search]);

  return (
    <>
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input
          placeholder="Cari judul, topik, atau tema cerita..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {filteredStories.length === 0 ? (
          <div className="col-span-full rounded-xl border border-default bg-surface p-12 text-center text-text-secondary">
            <BookOpen className="mx-auto h-12 w-12 text-border-strong mb-4" />
            {stories.length === 0 ? (
              <>
                <p className="font-bold">Belum ada cerita yang dibuat.</p>
                <p className="text-sm mt-2">Buat cerita pertama Anda melalui menu Aksi & Misi.</p>
              </>
            ) : (
              <p className="font-bold">Tidak ada cerita yang cocok dengan pencarian.</p>
            )}
          </div>
        ) : (
          filteredStories.map((story) => (
            <div key={story.id} className="flex flex-col justify-between rounded-xl border border-default bg-surface overflow-hidden group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    <Calendar size={12} />
                    {story.createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-bold">
                      {story._count.assignments} Penugasan
                    </div>
                    <form action={deleteStory}>
                      <input type="hidden" name="id" value={story.id} />
                      <button type="submit" className="text-text-muted hover:text-brand-danger transition-colors p-1" title="Hapus cerita">
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>
                </div>
                <h3 className="font-heading text-lg font-bold text-text-primary mb-2 line-clamp-2">{story.title}</h3>
                <p className="text-xs text-text-secondary line-clamp-2">
                  Topik: {story.topic}<br />
                  Tema: {story.theme}
                </p>
              </div>
              <div className="border-t border-border-light bg-surface-soft px-6 py-4 flex items-center justify-between">
                <AssignModal storyId={story.id} storyTitle={story.title} students={students} />
                <Link href={`/pembimbing/koleksi/${story.id}`} className="flex items-center text-sm font-bold text-brand-primary hover:text-brand-primary/80 transition-colors">
                  Baca <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
