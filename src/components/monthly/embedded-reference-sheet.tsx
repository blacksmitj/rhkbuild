"use client"

import * as React from "react"
import { CopyConfirmDialog } from "@/components/reference/copy-confirm-dialog"
import { CopyItemButton } from "@/components/monthly/copy-item-button"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useSkpStore } from "@/lib/stores/skp-store"
import { MONTH_NAMES, type ColleagueReference, type SkpIndicator } from "@/lib/mock-data"
import {
  Users,
  Search,
  ExternalLink,
  PlusCircle,
  History,
  Copy,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Layers,
} from "lucide-react"

interface EmbeddedReferenceSheetProps {
  targetIndicator?: SkpIndicator | null
  onSelectTargetIndicator?: (indicator: SkpIndicator) => void
  activeTab?: "colleague" | "copy"
  onTabChange?: (tab: "colleague" | "copy") => void
}

export function EmbeddedReferenceSheet({
  targetIndicator,
  onSelectTargetIndicator,
  activeTab: controlledActiveTab,
  onTabChange,
}: EmbeddedReferenceSheetProps) {
  const {
    indicators,
    colleagueReferences,
    selectedMonth,
    selectedYear,
    copyFromReference,
    copyFromPreviousMonth,
    copyFromOtherMonth,
    checkDuplicateAction,
    getCurrentMonthlyPeriod,
  } = useSkpStore()

  // Internal tab state if uncontrolled
  const [internalTab, setInternalTab] = React.useState<"colleague" | "copy">("colleague")
  const currentTab = controlledActiveTab ?? internalTab

  const handleTabSwitch = (tab: "colleague" | "copy") => {
    if (onTabChange) {
      onTabChange(tab)
    } else {
      setInternalTab(tab)
    }
  }

  // --- State untuk Referensi Rekan ---
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedUnit, setSelectedUnit] = React.useState("all")
  const [filterYear, setFilterYear] = React.useState("all")
  const [filterMonth, setFilterMonth] = React.useState("all")
  const [selectedRef, setSelectedRef] = React.useState<ColleagueReference | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false)

  // --- State untuk Salin Periode ---
  const [copyMode, setCopyMode] = React.useState<"previous" | "other">("previous")
  const [sourceMonth, setSourceMonth] = React.useState<number>(selectedMonth > 1 ? selectedMonth - 1 : 12)
  const [sourceYear, setSourceYear] = React.useState<number>(selectedMonth > 1 ? selectedYear : selectedYear - 1)
  const [copyFeedback, setCopyFeedback] = React.useState<{ message: string; type: "success" | "warning" | "error" } | null>(null)

  const prevMonthName = selectedMonth > 1 ? MONTH_NAMES[selectedMonth - 2] : "Desember (Tahun Lalu)"
  const currentMonthName = MONTH_NAMES[selectedMonth - 1]

  // Filter daftar unit kerja unik
  const units = React.useMemo(() => {
    const list = Array.from(new Set(colleagueReferences.map((r) => r.unitName)))
    return list.sort()
  }, [colleagueReferences])

  // Filtered references
  const filteredReferences = React.useMemo(() => {
    return colleagueReferences.filter((ref) => {
      const matchSearch =
        searchQuery === "" ||
        ref.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.indicatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.actionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.rhkName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchUnit = selectedUnit === "all" || ref.unitName === selectedUnit
      const matchYear = filterYear === "all" || ref.year.toString() === filterYear
      const matchMonth = filterMonth === "all" || ref.month.toString() === filterMonth

      return matchSearch && matchUnit && matchYear && matchMonth
    })
  }, [colleagueReferences, searchQuery, selectedUnit, filterYear, filterMonth])

  // Aksi Salin dari Referensi Rekan
  const handleInitiateCopy = (ref: ColleagueReference) => {
    setSelectedRef(ref)
    setConfirmDialogOpen(true)
  }

  const handleConfirmCopy = (targetId: string) => {
    if (!selectedRef) return
    copyFromReference(selectedRef, targetId)
    setConfirmDialogOpen(false)
    setSelectedRef(null)
  }

  // Aksi Salin dari Bulan Lalu
  const handleCopyPrevious = () => {
    if (!targetIndicator) return
    const result = copyFromPreviousMonth(targetIndicator.id)
    if (result.count === 0) {
      setCopyFeedback({
        message: `Tidak ada rencana aksi pada ${prevMonthName} untuk IKI "${targetIndicator.indicatorName}".`,
        type: "warning",
      })
    } else {
      setCopyFeedback({
        message: `Berhasil menyalin ${result.count} rencana aksi dari ${prevMonthName}. ${
          result.duplicates > 0 ? `(${result.duplicates} aktivitas terdeteksi mirip)` : ""
        }`,
        type: "success",
      })
      setTimeout(() => setCopyFeedback(null), 4000)
    }
  }

  // Aksi Salin dari Bulan Tertentu
  const handleCopyOtherMonth = () => {
    if (!targetIndicator) return
    const result = copyFromOtherMonth(targetIndicator.id, Number(sourceMonth), Number(sourceYear))
    const srcMonthLabel = MONTH_NAMES[Number(sourceMonth) - 1]
    if (result.count === 0) {
      setCopyFeedback({
        message: `Tidak ditemukan rencana aksi pada ${srcMonthLabel} ${sourceYear} untuk IKI ini.`,
        type: "warning",
      })
    } else {
      setCopyFeedback({
        message: `Berhasil menyalin ${result.count} rencana aksi dari ${srcMonthLabel} ${sourceYear}.`,
        type: "success",
      })
      setTimeout(() => setCopyFeedback(null), 4000)
    }
  }

  const currentPeriod = getCurrentMonthlyPeriod()

  return (
    <aside className="w-full flex flex-col bg-card border rounded-xl shadow-xs overflow-hidden h-[calc(100vh-140px)] min-h-[580px] sticky top-20">
      {/* Header Panel Sematan */}
      <div className="p-3.5 border-b bg-muted/40">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Layers className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Referensi & Salin</h3>
              <p className="text-[11px] text-muted-foreground">Panel rujukan dan salin cepat instan</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-muted rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => handleTabSwitch("colleague")}
            className={`py-1.5 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              currentTab === "colleague"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-3.5" />
            <span>Referensi Rekan ({filteredReferences.length})</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch("copy")}
            className={`py-1.5 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              currentTab === "copy"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="size-3.5" />
            <span>Salin Periode</span>
          </button>
        </div>
      </div>

      {/* Target IKI Selector / Status Info */}
      <div className="px-3.5 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 shrink-0">
            Target IKI:
          </span>
          {indicators.length > 0 ? (
            <div className="relative min-w-0 flex-1">
              <select
                className="w-full text-xs font-semibold text-foreground bg-transparent border-none p-0 pr-4 truncate cursor-pointer focus:outline-none focus:ring-0"
                value={targetIndicator?.id || indicators[0]?.id}
                onChange={(e) => {
                  const found = indicators.find((ind) => ind.id === e.target.value)
                  if (found && onSelectTargetIndicator) {
                    onSelectTargetIndicator(found)
                  }
                }}
              >
                {indicators.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.indicatorName}
                  </option>
                ))}
              </select>
              <ChevronDown className="size-3 text-muted-foreground absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          ) : (
            <span className="text-muted-foreground italic">Belum ada IKI</span>
          )}
        </div>
        <Badge variant="outline" className="text-[10px] shrink-0 py-0 border-emerald-500/30">
          Aktif
        </Badge>
      </div>

      {/* ================= TAB 1: REFERENSI REKAN ================= */}
      {currentTab === "colleague" && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Filter Bar */}
          <div className="p-3 border-b space-y-2 bg-background">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Cari nama rekan, aksi, atau IKI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <NativeSelect
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="h-8 text-xs"
              >
                <NativeSelectOption value="all">Semua Unit</NativeSelectOption>
                {units.map((unit) => (
                  <NativeSelectOption key={unit} value={unit}>
                    {unit}
                  </NativeSelectOption>
                ))}
              </NativeSelect>

              <NativeSelect
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="h-8 text-xs"
              >
                <NativeSelectOption value="all">Semua Bulan</NativeSelectOption>
                {MONTH_NAMES.map((name, index) => (
                  <NativeSelectOption key={name} value={(index + 1).toString()}>
                    {name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          </div>

          {/* Reference Cards List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-border/40">
            {filteredReferences.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <Users className="size-8 mx-auto mb-2 opacity-30" />
                <p>Tidak ada referensi yang sesuai dengan pencarian Anda.</p>
              </div>
            ) : (
              filteredReferences.map((ref) => {
                const targetId = targetIndicator?.id || indicators[0]?.id || ""
                const isDupe = currentPeriod
                  ? checkDuplicateAction(ref.actionTitle, targetId, currentPeriod.id)
                  : false

                return (
                  <div key={ref.id} className="pt-2.5 first:pt-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-foreground text-xs">
                            {ref.employeeName}
                          </span>
                          <span className="text-[10px] text-muted-foreground">({ref.position})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                          <span className="truncate max-w-[150px]">{ref.unitName}</span>
                          <span>•</span>
                          <span>
                            {MONTH_NAMES[ref.month - 1]} {ref.year}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleInitiateCopy(ref)}
                        className="h-7 px-2 text-xs shrink-0 text-primary hover:bg-primary/10 hover:text-primary gap-1"
                        title="Salin rencana aksi ini ke SKP Anda"
                      >
                        <PlusCircle className="size-3.5" />
                        <span>Ambil</span>
                      </Button>
                    </div>

                    {/* Konten Rencana Aksi */}
                    <div className="p-2 rounded-lg bg-muted/40 border border-muted-foreground/10 text-xs space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-foreground leading-snug">
                          {ref.actionTitle}
                        </p>
                        <CopyItemButton text={ref.actionTitle} label="Aksi" />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                        <span>
                          Target: <strong>{ref.target} {ref.unit}</strong>
                        </span>
                        {ref.evidenceLink && (
                          <a
                            href={ref.evidenceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <span>Bukti</span>
                            <ExternalLink className="size-2.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {isDupe && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                        ⚠️ Mirip dengan aksi yang sudah Anda miliki di bulan ini
                      </p>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: SALIN PERIODE ================= */}
      {currentTab === "copy" && (
        <div className="flex flex-col flex-1 p-3.5 overflow-y-auto space-y-4 text-xs">
          {/* Sub Tab Pemilihan */}
          <div className="grid grid-cols-2 p-1 bg-muted rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setCopyMode("previous")
                setCopyFeedback(null)
              }}
              className={`py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                copyMode === "previous"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <History className="size-3" />
              <span>Bulan Sebelumnya</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCopyMode("other")
                setCopyFeedback(null)
              }}
              className={`py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                copyMode === "other"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="size-3" />
              <span>Bulan Lainnya</span>
            </button>
          </div>

          {/* Feedback Alert */}
          {copyFeedback && (
            <div
              className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                copyFeedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {copyFeedback.type === "success" ? (
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <span>{copyFeedback.message}</span>
            </div>
          )}

          {copyMode === "previous" ? (
            <div className="space-y-3">
              <Card className="border-dashed bg-muted/20">
                <CardContent className="p-3.5 space-y-2">
                  <span className="font-semibold text-foreground text-xs block">
                    Salin dari {prevMonthName}
                  </span>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    Menyalin semua rencana aksi pada IKI <strong>&quot;{targetIndicator?.indicatorName || "Terpilih"}&quot;</strong> dari {prevMonthName} ke {currentMonthName} {selectedYear}.
                  </p>
                  <div className="text-[10px] text-muted-foreground bg-muted p-2 rounded">
                    * Catatan: Nilai realisasi tidak disalin dan wajib diisi ulang per aturan SKP.
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleCopyPrevious}
                disabled={!targetIndicator}
                className="w-full flex items-center justify-center gap-1.5 h-8 text-xs"
              >
                <Copy className="size-3.5" />
                <span>Salin dari {prevMonthName}</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="font-medium text-foreground text-[11px]">Bulan Sumber</span>
                  <NativeSelect
                    className="w-full h-8 text-xs"
                    value={sourceMonth.toString()}
                    onChange={(e) => setSourceMonth(Number(e.target.value))}
                  >
                    {MONTH_NAMES.map((name, idx) => (
                      <NativeSelectOption key={name} value={(idx + 1).toString()}>
                        {name}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>

                <div className="space-y-1">
                  <span className="font-medium text-foreground text-[11px]">Tahun Sumber</span>
                  <NativeSelect
                    className="w-full h-8 text-xs"
                    value={sourceYear.toString()}
                    onChange={(e) => setSourceYear(Number(e.target.value))}
                  >
                    <NativeSelectOption value="2026">2026</NativeSelectOption>
                    <NativeSelectOption value="2025">2025</NativeSelectOption>
                  </NativeSelect>
                </div>
              </div>

              <Button
                onClick={handleCopyOtherMonth}
                disabled={!targetIndicator}
                className="w-full flex items-center justify-center gap-1.5 h-8 text-xs"
              >
                <Copy className="size-3.5" />
                <span>Salin dari Periode Terpilih</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Dialog Konfirmasi saat menyalin dari referensi rekan */}
      {selectedRef && (
        <CopyConfirmDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          reference={selectedRef}
          onConfirm={handleConfirmCopy}
        />
      )}
    </aside>
  )
}

