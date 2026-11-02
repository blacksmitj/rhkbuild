"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ReferenceFilterBar } from "@/components/reference/reference-filter-bar"
import { ReferenceCard } from "@/components/reference/reference-card"
import { CopyConfirmDialog } from "@/components/reference/copy-confirm-dialog"
import { useSkpStore } from "@/lib/stores/skp-store"
import { MONTH_NAMES, type ColleagueReference, type SkpIndicator } from "@/lib/mock-data"
import { Search } from "lucide-react"

interface ReferenceSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetIndicator?: SkpIndicator | null
}

export function ReferenceSheet({
  open,
  onOpenChange,
  targetIndicator,
}: ReferenceSheetProps) {
  const {
    colleagueReferences,
    selectedMonth,
    selectedYear,
    copyFromReference,
    checkDuplicateAction,
    getCurrentMonthlyPeriod,
  } = useSkpStore()

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedUnit, setSelectedUnit] = React.useState("all")
  const [filterYear, setFilterYear] = React.useState("all")
  const [filterMonth, setFilterMonth] = React.useState("all")

  const [selectedRef, setSelectedRef] = React.useState<ColleagueReference | null>(null)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [copiedIds, setCopiedIds] = React.useState<string[]>([])

  const currentMonthlyPeriod = getCurrentMonthlyPeriod()
  const targetMonthName = MONTH_NAMES[selectedMonth - 1]

  // Daftar unik unit kerja
  const availableUnits = React.useMemo(() => {
    return Array.from(new Set(colleagueReferences.map((ref) => ref.unitName)))
  }, [colleagueReferences])

  // Reset filter when indicator changes
  React.useEffect(() => {
    if (open) {
      setSearchQuery("")
      setSelectedUnit("all")
      setFilterYear("all")
      setFilterMonth("all")
    }
  }, [open, targetIndicator])

  // Filter daftar referensi
  const filteredReferences = React.useMemo(() => {
    return colleagueReferences.filter((ref) => {
      // Filter teks pencarian (case insensitive)
      const matchesSearch =
        searchQuery.trim() === "" ||
        ref.actionDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.indicatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.ownerName.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter Unit Kerja
      const matchesUnit = selectedUnit === "all" || ref.unitName === selectedUnit

      // Filter Tahun
      const matchesYear = filterYear === "all" || String(ref.periodYear) === filterYear

      // Filter Bulan
      const matchesMonth = filterMonth === "all" || String(ref.periodMonth) === filterMonth

      return matchesSearch && matchesUnit && matchesYear && matchesMonth
    })
  }, [colleagueReferences, searchQuery, selectedUnit, filterYear, filterMonth])

  // Handler saat tombol salin di klik pada suatu kartu
  const handleInitiateCopy = (reference: ColleagueReference) => {
    setSelectedRef(reference)
    setConfirmOpen(true)
  }

  // Cek apakah aksi yang dipilih duplikat dengan yang sudah ada di IKI ini
  const isDuplicate = React.useMemo(() => {
    if (!selectedRef || !targetIndicator || !currentMonthlyPeriod) return false
    return checkDuplicateAction(
      targetIndicator.id,
      currentMonthlyPeriod.id,
      selectedRef.actionDescription
    )
  }, [selectedRef, targetIndicator, currentMonthlyPeriod, checkDuplicateAction])

  // Konfirmasi salin aksi
  const handleConfirmCopy = () => {
    if (!selectedRef || !targetIndicator) return

    const result = copyFromReference(targetIndicator.id, selectedRef)
    if (result.success) {
      setCopiedIds((prev) => [...prev, selectedRef.id])
      setConfirmOpen(false)
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col">
          <SheetHeader className="p-5 pb-3 border-b bg-muted/20">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Search className="size-4" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold">
                  Eksplorasi Referensi Rencana Aksi
                </SheetTitle>
                <SheetDescription className="text-xs">
                  Target: {targetIndicator?.indicatorName} &bull; Periode: {targetMonthName} {selectedYear}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Bar Filter */}
          <div className="p-4 border-b bg-background">
            <ReferenceFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedUnit={selectedUnit}
              onUnitChange={setSelectedUnit}
              selectedYear={filterYear}
              onYearChange={setFilterYear}
              selectedMonth={filterMonth}
              onMonthChange={setFilterMonth}
              availableUnits={availableUnits}
            />
          </div>

          {/* Daftar Kartu Referensi */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Menampilkan {filteredReferences.length} referensi aktivitas</span>
            </div>

            {filteredReferences.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground space-y-2">
                <p className="text-sm font-medium">Tidak ada referensi yang cocok</p>
                <p className="text-xs">Cobalah mengubah kata kunci atau menyetel filter ke semua.</p>
              </div>
            ) : (
              filteredReferences.map((ref) => (
                <ReferenceCard
                  key={ref.id}
                  reference={ref}
                  targetMonthName={targetMonthName}
                  targetYear={selectedYear}
                  isCopied={copiedIds.includes(ref.id)}
                  onCopy={handleInitiateCopy}
                />
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialog Konfirmasi Salin (BR-09, BR-12) */}
      <CopyConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        reference={selectedRef}
        targetMonthName={targetMonthName}
        targetYear={selectedYear}
        isDuplicate={isDuplicate}
        onConfirm={handleConfirmCopy}
      />
    </>
  )
}
