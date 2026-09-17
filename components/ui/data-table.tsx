"use client"

import * as React from "react"
import {
  ColumnDef,
  RowData,
  SortingState,
  flexRender,
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  createFilteredRowModel,
  filterFn_includesString,
  filterFn_inNumberRange,
  filterFn_inDateRange,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Search } from "lucide-react"

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
    inDateRange: filterFn_inDateRange,
  },
})

export type DataTableFeatures = typeof features
export type DataTableColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>

export interface DataTableColumnMeta {
  filterVariant?: "text" | "numberRange" | "dateRange"
  filterLabel?: string
  filterPlaceholder?: string
  hideOnMobile?: boolean
  align?: "left" | "center" | "right"
}

interface DataTableProps<TData extends RowData> {
  columns: DataTableColumnDef<TData>[]
  data: TData[]
}

function getColumnMeta(column: { columnDef: { meta?: unknown } }): DataTableColumnMeta | undefined {
  return column.columnDef.meta as DataTableColumnMeta | undefined
}

function ColumnFilter({ column }: { column: any }) {
  const meta = getColumnMeta(column)

  if (meta?.filterVariant === "text") {
    const value = (column.getFilterValue() as string) ?? ""
    return (
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input
          placeholder={meta.filterPlaceholder ?? "Cari..."}
          value={value}
          onChange={(event) => column.setFilterValue(event.target.value || undefined)}
          className="pl-9"
        />
      </div>
    )
  }

  if (meta?.filterVariant === "numberRange") {
    const [min, max] = (column.getFilterValue() as [number | undefined, number | undefined]) ?? []
    return (
      <div className="flex items-center gap-2 w-full">
        <Input
          type="number"
          placeholder="Min"
          value={min ?? ""}
          onChange={(event) =>
            column.setFilterValue((old: [number | undefined, number | undefined] | undefined) => [
              event.target.value === "" ? undefined : Number(event.target.value),
              old?.[1],
            ])
          }
          className="flex-1 min-w-0"
        />
        <span className="text-text-muted text-sm">-</span>
        <Input
          type="number"
          placeholder="Maks"
          value={max ?? ""}
          onChange={(event) =>
            column.setFilterValue((old: [number | undefined, number | undefined] | undefined) => [
              old?.[0],
              event.target.value === "" ? undefined : Number(event.target.value),
            ])
          }
          className="flex-1 min-w-0"
        />
      </div>
    )
  }

  if (meta?.filterVariant === "dateRange") {
    const [from, to] = (column.getFilterValue() as [string | undefined, string | undefined]) ?? []
    return (
      <div className="flex items-center gap-2 w-full">
        <Input
          type="date"
          value={from ?? ""}
          onChange={(event) =>
            column.setFilterValue((old: [string | undefined, string | undefined] | undefined) => [
              event.target.value || undefined,
              old?.[1],
            ])
          }
          className="flex-1 min-w-0"
        />
        <span className="text-text-muted text-sm">-</span>
        <Input
          type="date"
          value={to ?? ""}
          onChange={(event) =>
            column.setFilterValue((old: [string | undefined, string | undefined] | undefined) => [
              old?.[0],
              event.target.value || undefined,
            ])
          }
          className="flex-1 min-w-0"
        />
      </div>
    )
  }

  return null
}

export function DataTable<TData extends RowData>({
  columns,
  data,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  })

  const filterableColumns = table
    .getAllLeafColumns()
    .filter((column: any) => getColumnMeta(column)?.filterVariant)

  return (
    <div className="space-y-4">
      {filterableColumns.length > 0 && (
        <div className="flex flex-wrap items-end gap-4">
          {filterableColumns.map((column: any) => {
            const meta = getColumnMeta(column)
            const minWidth =
              meta?.filterVariant === "dateRange" ? "min-w-[300px]" : "min-w-[180px]"
            return (
              <div key={column.id} className={`flex flex-col gap-1 flex-1 ${minWidth}`}>
                {meta?.filterLabel && (
                  <label className="text-xs font-medium text-text-secondary">
                    {meta.filterLabel}
                  </label>
                )}
                <ColumnFilter column={column} />
              </div>
            )
          })}
        </div>
      )}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader className="bg-surface-soft">
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`text-xs font-semibold text-text-muted whitespace-nowrap py-3 px-4 ${
                        getColumnMeta(header.column)?.align === "center"
                          ? "text-center"
                          : getColumnMeta(header.column)?.align === "right"
                          ? "text-right"
                          : "text-left"
                      } ${getColumnMeta(header.column)?.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-1.5 ${
                            getColumnMeta(header.column)?.align === "center"
                              ? "justify-center"
                              : getColumnMeta(header.column)?.align === "right"
                              ? "justify-end"
                              : "justify-start"
                          } ${
                            header.column.getCanSort()
                              ? "cursor-pointer select-none hover:text-brand-primary transition-colors"
                              : ""
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <ChevronUp className="w-3.5 h-3.5" />,
                            desc: <ChevronDown className="w-3.5 h-3.5" />,
                          }[header.column.getIsSorted() as string] ?? (
                            header.column.getCanSort() ? (
                              <div className="w-3.5 h-3.5 opacity-0" />
                            ) : null
                          )}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  className="border-b border-border/40 last:border-0 hover:bg-surface-soft/60 transition-colors"
                >
                  {row.getAllCells().map((cell: any) => (
                    <TableCell
                      key={cell.id}
                      className={`py-3 px-4 ${getColumnMeta(cell.column)?.hideOnMobile ? "hidden sm:table-cell" : ""} ${
                        getColumnMeta(cell.column)?.align === "center"
                          ? "text-center"
                          : getColumnMeta(cell.column)?.align === "right"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-text-muted">
                  Data tidak ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-text-secondary">
          Menampilkan {table.state.pagination.pageIndex * table.state.pagination.pageSize + 1} - {Math.min((table.state.pagination.pageIndex + 1) * table.state.pagination.pageSize, table.getFilteredRowModel().rows.length)} dari {table.getFilteredRowModel().rows.length} data
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-border hover:bg-surface-soft"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-border hover:bg-surface-soft"
            aria-label="Halaman selanjutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
