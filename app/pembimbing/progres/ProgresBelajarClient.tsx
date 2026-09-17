"use client"

import React from "react"
import { DataTable, DataTableColumnDef } from "@/components/ui/data-table"

const formatActivityDate = (value: Date) =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

type Activity = {
  id: string
  type: string
  title: string
  score: number | null
  createdAt: Date
  user: {
    fullName: string
    avatarUrl: string | null
  }
}

export const columns: DataTableColumnDef<Activity>[] = [
  {
    accessorKey: "title",
    header: "Aktivitas",
    cell: ({ row }) => {
      const act = row.original
      return (
        <div className="flex flex-col">
          <span className="font-bold text-text-primary">{act.title}</span>
          <span className="text-xs text-text-secondary">
            {act.type === "QUIZ_COMPLETED" ? "Kuis" : "Cerita"}
          </span>
          <span className="mt-1 text-xs text-text-secondary sm:hidden">
            <span className="font-semibold text-text-primary">{act.user.fullName}</span>
            {" · "}
            {formatActivityDate(act.createdAt)}
          </span>
        </div>
      )
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "user.fullName",
    header: "Nama Anak",
    cell: ({ row }) => {
      return <span className="font-medium">{row.original.user.fullName}</span>
    },
    filterFn: "includesString",
    meta: {
      filterVariant: "text",
      filterLabel: "Nama Anak",
      filterPlaceholder: "Cari nama anak...",
      hideOnMobile: true,
    },
  },
  {
    accessorKey: "score",
    header: "Skor",
    cell: ({ row }) => {
      const score = row.original.score
      if (score === null) return <div className="text-center text-text-muted text-sm">-</div>
      return <div className="text-center font-bold text-text-primary">{score}</div>
    },
    filterFn: "inNumberRange",
    meta: {
      filterVariant: "numberRange",
      filterLabel: "Skor",
    },
  },
  {
    accessorKey: "createdAt",
    header: "Waktu",
    cell: ({ row }) => (
      <div className="text-center text-sm text-text-secondary">{formatActivityDate(row.original.createdAt)}</div>
    ),
    filterFn: "inDateRange",
    meta: {
      filterVariant: "dateRange",
      filterLabel: "Waktu",
      hideOnMobile: true,
    },
  },
]

export default function ProgresBelajarClient({ data }: { data: Activity[] }) {
  return (
    <div className="rounded-xl border border-default bg-surface p-6 shadow-sm">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
