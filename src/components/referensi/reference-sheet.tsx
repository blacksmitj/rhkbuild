"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ReferenceFilterBar } from "@/components/referensi/reference-filter-bar"
import { ReferenceCard } from "@/components/referensi/reference-card"
import { CopyConfirmDialog } from "@/components/referensi/copy-confirm-dialog"
import { useSkpStore } from "@/lib/stores/skp-store"
import { MONTH_NAMES, type ColleagueReference, type SkpIndicator } from "@/lib/mock-data"
import { Search, Sparkles } from "lucide-react"

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
  const [selectedUnit, setSelectedUnit] = React.useState("ALL")
  const [filterYear, setFilterYear] = React.useState("ALL")
  const [filterMonth, setFilterMonth] = React.useState("ALL")

  const [selectedRef, setSelectedRef] = React.useState<ColleagueReference | null>(null)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [copiedIds, setCopiedIds] = React.useState<string[]>([])

  const currentMonthlyPeriod = getCurrentMonthlyPeriod()
  const targetMonthName = MONTH_NAMES[selectedMonth - 1]

  // Daftar unik unit kerja
  const availableUnits = React.useMemo(() => {
    return Array.from(new Set(colleagueReferences.map((r) => r.unitName)))
  }, [colleagueReferences])

  // Reset saat sheet dibuka
  React.useEffect(() => {
    if (open) {
      setSearchQuery("")
      setSelectedUnit("ALL")
      setFilterYear("ALL")
      setFilterMonth("ALL")
      setCopiedIds([])
    }
  }, [open])

  // Filter referensi
  const filteredReferences = React.useMemo(() => {
    return colleagueReferences.filter((ref) => {
      // Prioritaskan kecocokan IKI jika targetIndicator disediakan (PRD Bagian 12.1)
      const matchesSearch =
        searchQuery === "" ||
        ref.actionDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.indicatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.ownerName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesUnit = selectedUnit === "ALL" || ref.unitName === selectedUnit
      const matchesYear = filterYear === "ALL" || ref.periodYear.toString() === filterYear
      const matchesMonth = filterMonth === "ALL" || ref.periodMonth.toString() === filterMonth

      return matchesSearch && matchesUnit && matchesYear && matchesMonth
    })
  }, [colleagueReferences, searchQuery, selectedUnit, filterYear, filterMonth])

  const handleInitiateCopy = (ref: ColleagueReference) => {
    setSelectedRef(ref)
    setConfirmOpen(true)
  }

  const handleConfirmCopy = () => {
    if (!selectedRef || !targetIndicator) return

    copyFromReference(targetIndicator.id, selectedRef)
    setCopiedIds((prev) => [...prev, selectedRef.id])
    setConfirmOpen(false)
  }

  const isDuplicate = Boolean(
    selectedRef &&
      targetIndicator &&
      currentMonthlyPeriod &&
      checkDuplicateAction(
        targetIndicator.id,
        currentMonthlyPeriod.id,
        selectedRef.actionDescription
      )
  )

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-[540px] w-full flex flex-col p-0">
          {/* Header Panel */}
          <SheetHeader className="p-4 border-b bg-muted/20">
            <div className="flex items-center gap-2 text-primary mb-1">
              <Sparkles className="size-5" />
              <SheetTitle className="text-base font-bold">
                Referensi Rencana Aksi Se-Instansi
              </SheetTitle>
            </div>
            <SheetDescription className="text-xs">
              Melihat & menyalin rencana aksi rekan kerja pada IKI yang relevan ke periode{" "}
              <strong>{targetMonthName} {selectedYear}</strong> (PRD Bagian 4E).
            </SheetDescription>

            {targetIndicator && (
              <div className="p-2.5 rounded-md bg-background border text-xs mt-2 text-left">
                <span className="font-semibold text-muted-foreground uppercase tracking-wider block text-[10px]">
                  Target IKI Tujuan Salin:
                </span>
                <p className="font-medium text-foreground line-clamp-1">
                  {targetIndicator.indicatorName} ({targetIndicator.unit})
                </p>
              </div>
            )}
          </SheetHeader>

          {/* Filter Bar */}
          <div className="p-4 pb-2">
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

          {/* List References */}
          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
            {filteredReferences.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed rounded-xl bg-card my-4">
                <Search className="size-8 text-muted-foreground mx-auto mb-2" />
                <h4 className="font-medium text-sm text-foreground">Tidak Ada Referensi Ditemukan</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  Coba sesuaikan kata kunci pencarian atau ubah filter unit kerja dan periode.
                </p>
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

      {/* Confirmation Dialog Sebelum Salin */}
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

