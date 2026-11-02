"use client"

import * as React from "react"
import { AppHeader } from "@/components/layout/app-header"
import { ReferenceFilterBar } from "@/components/reference/reference-filter-bar"
import { ReferenceCard } from "@/components/reference/reference-card"
import { CopyConfirmDialog } from "@/components/reference/copy-confirm-dialog"
import { useSkpStore } from "@/lib/stores/skp-store"
import { MONTH_NAMES, type ColleagueReference } from "@/lib/mock-data"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { Users, CalendarDays, ShieldAlert, Sparkles } from "lucide-react"
import { cn } from "cn"

export default function StandaloneReferencePage() {
  const {
    colleagueReferences,
    indicators,
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
  const [targetIndicatorId, setTargetIndicatorId] = React.useState<string>(indicators[0]?.id || "")

  const [selectedRef, setSelectedRef] = React.useState<ColleagueReference | null>(null)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [copiedIds, setCopiedIds] = React.useState<string[]>([])

  const currentMonthlyPeriod = getCurrentMonthlyPeriod()
  const targetMonthName = MONTH_NAMES[selectedMonth - 1]
  const targetIndicator = indicators.find((i) => i.id === targetIndicatorId)

  // Daftar unik unit kerja
  const availableUnits = React.useMemo(() => {
    return Array.from(new Set(colleagueReferences.map((r) => r.unitName)))
  }, [colleagueReferences])

  const filteredReferences = React.useMemo(() => {
    return colleagueReferences.filter((ref) => {
      const matchesSearch =
        searchQuery === "" ||
        ref.actionDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.indicatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.ownerName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesUnit = selectedUnit === "all" || ref.unitName === selectedUnit
      const matchesYear = filterYear === "all" || String(ref.periodYear) === filterYear
      const matchesMonth = filterMonth === "all" || String(ref.periodMonth) === filterMonth

      return matchesSearch && matchesUnit && matchesYear && matchesMonth
    })
  }, [colleagueReferences, searchQuery, selectedUnit, filterYear, filterMonth])

  const handleInitiateCopy = (ref: ColleagueReference) => {
    setSelectedRef(ref)
    setConfirmOpen(true)
  }

  const isDuplicate = React.useMemo(() => {
    if (!selectedRef || !targetIndicatorId || !currentMonthlyPeriod) return false
    return checkDuplicateAction(
      targetIndicatorId,
      currentMonthlyPeriod.id,
      selectedRef.actionDescription
    )
  }, [selectedRef, targetIndicatorId, currentMonthlyPeriod, checkDuplicateAction])

  const handleConfirmCopy = () => {
    if (!selectedRef || !targetIndicatorId) return

    const result = copyFromReference(targetIndicatorId, selectedRef)
    if (result.success) {
      setCopiedIds((prev) => [...prev, selectedRef.id])
      setConfirmOpen(false)
    }
  }

  return (
    <>
      <AppHeader breadcrumbs={[{ title: "Referensi Rekan", href: "/reference" }]} />

      <main className="flex-1 space-y-6 p-6 max-w-7xl mx-auto w-full">
        {/* Intro Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border bg-card shadow-xs">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Users className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Inspirasi & Referensi Rencana Aksi
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Jelajahi contoh penyusunan kalimat rencana aksi dan bukti dukung dari rekan sejawat di seluruh unit kerja untuk memudahkan pengisian SKP Anda.
              </p>
            </div>
          </div>

          <Link
            href="/monthly"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0 gap-1.5")}
          >
            <CalendarDays className="size-3.5" />
            <span>Kembali ke Pengisian Bulanan</span>
          </Link>
        </div>

        {/* Target Penempatan Aksi */}
        <div className="p-4 rounded-xl border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-foreground">Target Penempatan Hasil Salin:</span>
            <p className="text-muted-foreground mt-0.5">
              Rencana aksi yang Anda salin akan dimasukkan ke periode <strong>{targetMonthName} {selectedYear}</strong> pada IKI berikut:
            </p>
          </div>

          <div className="min-w-[280px]">
            <NativeSelect
              size="sm"
              value={targetIndicatorId}
              onChange={(e) => setTargetIndicatorId(e.target.value)}
              className="bg-background text-xs"
            >
              {indicators.map((ind) => (
                <NativeSelectOption key={ind.id} value={ind.id}>
                  {ind.indicatorName} ({ind.annualTarget} {ind.unit})
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        </div>

        {/* Filter Controls */}
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

        {/* Grid Kartu Referensi */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>Menemukan {filteredReferences.length} referensi aktivitas</span>
          </div>

          {filteredReferences.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground border rounded-xl bg-card">
              <p className="text-sm font-semibold">Tidak ada referensi yang sesuai filter</p>
              <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau ubah filter unit kerja.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReferences.map((ref) => (
                <ReferenceCard
                  key={ref.id}
                  reference={ref}
                  targetMonthName={targetMonthName}
                  targetYear={selectedYear}
                  isCopied={copiedIds.includes(ref.id)}
                  onCopy={handleInitiateCopy}
                />
              ))}
            </div>
          )}
        </div>

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
      </main>
    </>
  )
}
