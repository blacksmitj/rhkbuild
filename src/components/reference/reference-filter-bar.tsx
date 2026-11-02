"use client"

import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { MONTH_NAMES } from "@/lib/mock-data"
import { Search } from "lucide-react"

interface ReferenceFilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedUnit: string
  onUnitChange: (unit: string) => void
  selectedYear: string
  onYearChange: (year: string) => void
  selectedMonth: string
  onMonthChange: (month: string) => void
  availableUnits: string[]
}

export function ReferenceFilterBar({
  searchQuery,
  onSearchChange,
  selectedUnit,
  onUnitChange,
  selectedYear,
  onYearChange,
  selectedMonth,
  onMonthChange,
  availableUnits,
}: ReferenceFilterBarProps) {
  return (
    <div className="space-y-2.5 p-3 rounded-lg border bg-muted/20">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Cari kata kunci rencana aksi, IKI, atau nama pegawai..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 text-xs bg-background h-9"
        />
      </div>

      {/* Dropdown Filters (Unit Kerja, Tahun, Bulan) */}
      <div className="grid grid-cols-3 gap-2">
        <NativeSelect
          size="sm"
          value={selectedUnit}
          onChange={(e) => onUnitChange(e.target.value)}
          className="w-full text-xs"
        >
          <NativeSelectOption value="all">Semua Unit Kerja</NativeSelectOption>
          {availableUnits.map((unit) => (
            <NativeSelectOption key={unit} value={unit}>
              {unit}
            </NativeSelectOption>
          ))}
        </NativeSelect>

        <NativeSelect
          size="sm"
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className="w-full text-xs"
        >
          <NativeSelectOption value="all">Semua Tahun</NativeSelectOption>
          <NativeSelectOption value="2026">2026</NativeSelectOption>
          <NativeSelectOption value="2025">2025</NativeSelectOption>
        </NativeSelect>

        <NativeSelect
          size="sm"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="w-full text-xs"
        >
          <NativeSelectOption value="all">Semua Bulan</NativeSelectOption>
          {MONTH_NAMES.map((name, idx) => (
            <NativeSelectOption key={name} value={String(idx + 1)}>
              {name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
    </div>
  )
}

