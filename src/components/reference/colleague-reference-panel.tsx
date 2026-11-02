"use client"

import * as React from "react"
import { CopyConfirmDialog } from "@/components/reference/copy-confirm-dialog"
import { CopyItemButton } from "@/components/monthly/copy-item-button"
import { useSkpStore } from "@/lib/stores/skp-store"
import { MONTH_NAMES, type ColleagueReference, type SkpIndicator } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Users,
  Search,
  X,
  ExternalLink,
  PlusCircle,
  Pin,
  PinOff,
} from "lucide-react"

interface ColleagueReferencePanelProps {
  isOpen: boolean
  onClose: () => void
  isPinned: boolean
  onTogglePin: () => void
  targetIndicator?: SkpIndicator | null
}

export function ColleagueReferencePanel({
  isOpen,
  onClose,
  isPinned,
  onTogglePin,
  targetIndicator,
}: ColleagueReferencePanelProps) {
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

  const currentMonthlyPeriod = getCurrentMonthlyPeriod()
  const targetMonthName = MONTH_NAMES[selectedMonth - 1]

  const availableUnits = React.useMemo(() => {
    return Array.from(new Set(colleagueReferences.map((ref) => ref.unitName)))
  }, [colleagueReferences])

  const filteredReferences = React.useMemo(() => {
    return colleagueReferences.filter((ref) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        ref.actionDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.indicatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.ownerName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesUnit = selectedUnit === "all" || ref.unitName === selectedUnit
      const matchesYear = filterYear === "all" || String(ref.periodYear) === filterYear
      const matchesMonth = filterMonth === "all" || String(ref.periodMonth) === filterMonth

      return matchesSearch && matchesUnit && matchesYear && matchesMonth
    })
  }, [colleagueReferences, searchQuery, selectedUnit, filterYear, filterMonth])

  const handleInitiateCopy = (reference: ColleagueReference) => {
    setSelectedRef(reference)
    setConfirmOpen(true)
  }

  const handleConfirmCopy = () => {
    if (!selectedRef || !targetIndicator) return
    copyFromReference(targetIndicator.id, selectedRef)
    setConfirmOpen(false)
  }

  const isDuplicate = React.useMemo(() => {
    if (!selectedRef || !targetIndicator || !currentMonthlyPeriod) return false
    return checkDuplicateAction(
      targetIndicator.id,
      currentMonthlyPeriod.id,
      selectedRef.actionDescription
    )
  }, [selectedRef, targetIndicator, currentMonthlyPeriod, checkDuplicateAction])

  if (!isOpen) return null

  return (
    <>
      <aside
        className={`bg-card flex flex-col transition-all duration-300 z-30 ${
          isPinned
            ? "w-full lg:w-[420px] shrink-0 h-auto sticky top-20 max-h-[calc(100vh-6rem)] rounded-xl border shadow-sm"
            : "fixed inset-y-0 right-0 w-full sm:w-[480px] shadow-2xl border-l"
        }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Referensi Rekan Kerja</h3>
              <p className="text-[11px] text-muted-foreground">
                Cek & salin rencana aksi atau link bukti
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onTogglePin}
              className="size-7 text-muted-foreground hover:text-foreground"
              title={isPinned ? "Lepaskan Pin (Mode Floating)" : "Sematkan Berdampingan (Pinned)"}
            >
              {isPinned ? <PinOff className="size-3.5" /> : <Pin className="size-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-7 text-muted-foreground hover:text-foreground"
              title="Tutup Panel"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Target Indicator Alert if available */}
        {targetIndicator && (
          <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-xs flex items-center justify-between gap-2">
            <span className="truncate text-emerald-800 dark:text-emerald-300">
              Target IKI: <strong>{targetIndicator.indicatorName}</strong>
            </span>
            <Badge variant="outline" className="text-[10px] py-0 border-emerald-500/30">
              Aktif
            </Badge>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="p-3 border-b space-y-2 bg-background/50">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Cari nama rekan, aksi, atau IKI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              aria-label="Filter Unit Kerja"
              className="h-7 text-xs bg-muted/40 border border-input rounded-md px-2 flex-1 truncate"
            >
              <option value="all">Semua Unit Kerja</option>
              {availableUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>

            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              aria-label="Filter Bulan"
              className="h-7 text-xs bg-muted/40 border border-input rounded-md px-2 w-28"
            >
              <option value="all">Semua Bulan</option>
              {MONTH_NAMES.map((m, idx) => (
                <option key={m} value={String(idx + 1)}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {filteredReferences.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-xs">
              Tidak ada referensi rekan yang cocok dengan pencarian.
            </div>
          ) : (
            filteredReferences.map((ref) => {
              const fullCopy = `${ref.actionDescription} | Bukti: ${ref.evidenceValue || ref.evidenceName} | ${ref.realizationValue} ${ref.unit}`

              return (
                <div
                  key={ref.id}
                  className="rounded-lg border bg-card p-3 text-xs space-y-2.5 shadow-xs hover:border-primary/40 transition-colors"
                >
                  {/* Pemilik / Rekan */}
                  <div className="flex items-start justify-between gap-2 border-b pb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                        {ref.ownerName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{ref.ownerName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{ref.unitName}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal shrink-0">
                      {MONTH_NAMES[ref.periodMonth - 1]} {ref.periodYear}
                    </Badge>
                  </div>

                  {/* Uraian Rencana Aksi */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-foreground leading-snug">
                        {ref.actionDescription}
                      </p>
                      <CopyItemButton
                        textToCopy={ref.actionDescription}
                        tooltip="Salin teks aksi ini untuk dipaste ke aplikasi utama"
                        size="xs"
                        label="Salin"
                        showText={false}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Target/Realisasi: {ref.realizationValue} {ref.unit}
                    </p>
                  </div>

                  {/* Bukti Dukung */}
                  <div className="bg-muted/30 rounded p-2 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[11px] truncate">{ref.evidenceName}</p>
                      {ref.evidenceValue?.startsWith("http") ? (
                        <a
                          href={ref.evidenceValue}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-primary hover:underline flex items-center gap-1 truncate"
                        >
                          <span className="truncate">{ref.evidenceValue}</span>
                          <ExternalLink className="size-2.5 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-muted-foreground truncate">
                          {ref.evidenceValue || "Berkas internal"}
                        </span>
                      )}
                    </div>

                    {ref.evidenceValue && (
                      <CopyItemButton
                        textToCopy={ref.evidenceValue}
                        tooltip="Salin URL Link Bukti Rekan"
                        size="xs"
                      />
                    )}
                  </div>

                  {/* Tombol Aksi Bawah */}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    <CopyItemButton
                      textToCopy={fullCopy}
                      label="Salin Semua"
                      tooltip="Salin teks aksi, bukti & target sekaligus"
                      variant="outline"
                      size="xs"
                      showText={true}
                    />

                    {targetIndicator && (
                      <Button
                        size="sm"
                        onClick={() => handleInitiateCopy(ref)}
                        className="h-6 text-[11px] px-2 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        title="Langsung masukkan sebagai item aksi di IKI Anda"
                      >
                        <PlusCircle className="size-3" />
                        <span>Masukkan ke IKI</span>
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </aside>

      {/* Confirmation Dialog saat klik 'Masukkan ke IKI' */}
      {selectedRef && targetIndicator && (
        <CopyConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          reference={selectedRef}
          targetMonthName={targetMonthName}
          targetYear={selectedYear}
          isDuplicate={isDuplicate}
          onConfirm={handleConfirmCopy}
        />
      )}
    </>
  )
}
