"use client"

import * as React from "react"
import { AppHeader } from "@/components/layout/app-header"
import { ReferenceFilterBar } from "@/components/referensi/reference-filter-bar"
import { ReferenceCard } from "@/components/referensi/reference-card"
import { CopyConfirmDialog } from "@/components/referensi/copy-confirm-dialog"
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
  const [selectedUnit, setSelectedUnit] = React.useState("ALL")
  const [filterYear, setFilterYear] = React.useState("ALL")
  const [filterMonth, setFilterMonth] = React.useState("ALL")
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
    if (!selectedRef || !targetIndicatorId) return

    copyFromReference(targetIndicatorId, selectedRef)
    setCopiedIds((prev) => [...prev, selectedRef.id])
    setConfirmOpen(false)
  }

  const isDuplicate = Boolean(
    selectedRef &&
      targetIndicatorId &&
      currentMonthlyPeriod &&
      checkDuplicateAction(
        targetIndicatorId,
        currentMonthlyPeriod.id,
        selectedRef.actionDescription
      )
  )

  return (
    <>
      <AppHeader breadcrumbs={[{ title: "Referensi Rekan Se-Instansi" }]} />
      <main className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">
                Bank Referensi Rencana Aksi Instansi
              </h1>
              <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                <Sparkles className="size-3" />
                Satu Instansi (BR-13)
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Jelajahi contoh rencana aksi rekan kerja pada instansi Anda, lalu salin langsung ke SKP periode {targetMonthName} {selectedYear}.
            </p>
          </div>

          <Link
            href="/bulanan"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex items-center gap-1.5")}
          >
            <CalendarDays className="size-4" />
            Ke Pengisian Bulanan
          </Link>
        </div>

        {/* Pilih IKI Tujuan Salin */}
        <div className="p-4 rounded-xl border bg-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Pilih IKI Anda Sebagai Target Salin:
            </span>
            <p className="text-xs text-muted-foreground">
              Aktivitas yang disalin akan masuk ke IKI ini pada bulan {targetMonthName} {selectedYear}.
            </p>
          </div>
          <div className="w-full md:w-96">
            <NativeSelect
              className="w-full text-xs font-medium"
              value={targetIndicatorId}
              onChange={(e) => setTargetIndicatorId(e.target.value)}
            >
              {indicators.map((ind) => (
                <NativeSelectOption key={ind.id} value={ind.id}>
                  #{ind.order} {ind.indicatorName} ({ind.unit})
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        </div>

        {/* Filter Bar */}
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

        {/* Grid List Referensi */}
        {filteredReferences.length === 0 ? (
          <div className="text-center py-16 px-4 border-2 border-dashed rounded-xl bg-card">
            <Users className="size-10 text-muted-foreground mx-auto mb-2" />
            <h3 className="font-semibold text-base mb-1">Tidak Ada Referensi yang Cocok</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Cobalah mengganti kata kunci atau reset filter pencarian ke "Semua Unit" atau "Semua Tahun".
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

        {/* Confirmation Modal */}
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
