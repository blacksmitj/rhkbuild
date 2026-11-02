"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { useSkpStore } from "@/lib/stores/skp-store"
import { MONTH_NAMES, type SkpIndicator } from "@/lib/mock-data"
import { Copy, History, Calendar, Users, AlertCircle, CheckCircle2 } from "lucide-react"

interface CopySourceSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetIndicator: SkpIndicator
  onOpenColleagueReference: () => void
}

export function CopySourceSheet({
  open,
  onOpenChange,
  targetIndicator,
  onOpenColleagueReference,
}: CopySourceSheetProps) {
  const {
    selectedMonth,
    selectedYear,
    copyFromPreviousMonth,
    copyFromOtherMonth,
  } = useSkpStore()

  const [activeTab, setActiveTab] = React.useState<"previous" | "other" | "colleague">("previous")
  const [sourceMonth, setSourceMonth] = React.useState<number>(selectedMonth > 1 ? selectedMonth - 1 : 12)
  const [sourceYear, setSourceYear] = React.useState<number>(selectedMonth > 1 ? selectedYear : selectedYear - 1)
  const [copyFeedback, setCopyFeedback] = React.useState<{ message: string; type: "success" | "warning" | "error" } | null>(null)

  const prevMonthName = selectedMonth > 1 ? MONTH_NAMES[selectedMonth - 2] : "Desember (Tahun Lalu)"
  const currentMonthName = MONTH_NAMES[selectedMonth - 1]

  React.useEffect(() => {
    if (open) {
      setCopyFeedback(null)
      setActiveTab("previous")
      setSourceMonth(selectedMonth > 1 ? selectedMonth - 1 : 12)
      setSourceYear(selectedMonth > 1 ? selectedYear : selectedYear - 1)
    }
  }, [open, selectedMonth, selectedYear])

  // Eksekusi Salin dari Bulan Sebelumnya
  const handleCopyPrevious = () => {
    const result = useSkpStore.getState().copyFromPreviousMonth(targetIndicator.id)
    if (result.count === 0) {
      setCopyFeedback({
        message: `Tidak ada rencana aksi pada ${prevMonthName} untuk IKI "${targetIndicator.indicatorName}".`,
        type: "warning",
      })
    } else {
      setCopyFeedback({
        message: `Berhasil menyalin ${result.count} aktivitas dari ${prevMonthName} ke ${currentMonthName}. ${
          result.duplicates > 0 ? `(${result.duplicates} aktivitas memiliki kemiripan uraian)` : ""
        }`,
        type: "success",
      })
      setTimeout(() => onOpenChange(false), 1400)
    }
  }

  // Eksekusi Salin dari Bulan Tertentu
  const handleCopyOtherMonth = () => {
    const result = useSkpStore.getState().copyFromOtherMonth(
      targetIndicator.id,
      Number(sourceMonth),
      Number(sourceYear)
    )
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
      setTimeout(() => onOpenChange(false), 1400)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Copy className="size-5" />
            <DialogTitle>Salin Rencana Aksi (PRD Bagian 4F)</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Salin pekerjaan sebelumnya atau referensi rekan ke periode{" "}
            <strong>{currentMonthName} {selectedYear}</strong> untuk IKI: {targetIndicator.indicatorName}.
          </DialogDescription>
        </DialogHeader>

        {/* 3 Sumber Tab Selection */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setActiveTab("previous")
              setCopyFeedback(null)
            }}
            className={`py-2 px-2.5 rounded-lg transition-all flex flex-col items-center gap-1 ${
              activeTab === "previous"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="size-4" />
            <span className="truncate">Bulan Lalu</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("other")
              setCopyFeedback(null)
            }}
            className={`py-2 px-2.5 rounded-lg transition-all flex flex-col items-center gap-1 ${
              activeTab === "other"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="size-4" />
            <span className="truncate">Bulan Lainnya</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("colleague")
              setCopyFeedback(null)
            }}
            className={`py-2 px-2.5 rounded-lg transition-all flex flex-col items-center gap-1 ${
              activeTab === "colleague"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-4" />
            <span className="truncate">Rekan Kerja</span>
          </button>
        </div>

        {/* Tab 1: Bulan Sebelumnya */}
        {activeTab === "previous" && (
          <div className="space-y-4 py-2 text-xs">
            <Card className="border-dashed bg-muted/20">
              <CardContent className="p-4 space-y-2">
                <span className="font-semibold text-foreground text-sm block">
                  Salin dari {prevMonthName}
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  Menyalin semua rencana aksi pada IKI ini dari bulan {prevMonthName} ke bulan {currentMonthName} {selectedYear}.
                </p>
                <div className="text-[11px] text-muted-foreground bg-muted p-2 rounded">
                  * Catatan: Sesuai aturan BR-16, nilai realisasi tidak disalin dan wajib diisi ulang.
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleCopyPrevious} className="w-full flex items-center justify-center gap-1.5">
              <Copy className="size-4" />
              <span>Salin dari {prevMonthName}</span>
            </Button>
          </div>
        )}

        {/* Tab 2: Bulan Lainnya */}
        {activeTab === "other" && (
          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="font-medium text-foreground">Pilih Bulan Sumber</span>
                <NativeSelect
                  className="w-full"
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
                <span className="font-medium text-foreground">Pilih Tahun Sumber</span>
                <NativeSelect
                  className="w-full"
                  value={sourceYear.toString()}
                  onChange={(e) => setSourceYear(Number(e.target.value))}
                >
                  <NativeSelectOption value="2026">2026</NativeSelectOption>
                  <NativeSelectOption value="2025">2025</NativeSelectOption>
                </NativeSelect>
              </div>
            </div>

            <Button onClick={handleCopyOtherMonth} className="w-full flex items-center justify-center gap-1.5">
              <Copy className="size-4" />
              <span>Salin dari Periode Terpilih</span>
            </Button>
          </div>
        )}

        {/* Tab 3: Referensi Pegawai */}
        {activeTab === "colleague" && (
          <div className="space-y-4 py-2 text-xs">
            <Card className="border bg-primary/5 border-primary/20">
              <CardContent className="p-4 space-y-2">
                <span className="font-semibold text-foreground text-sm block">
                  Cari Referensi Pegawai Se-Instansi
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  Cari dan telaah rencana aksi rekan kerja pada IKI yang relevan melalui panel filter interaktif, lalu salin dengan satu klik.
                </p>
              </CardContent>
            </Card>

            <Button
              onClick={() => {
                onOpenChange(false)
                onOpenColleagueReference()
              }}
              className="w-full flex items-center justify-center gap-1.5"
            >
              <Users className="size-4" />
              <span>Buka Panel Referensi Pegawai</span>
            </Button>
          </div>
        )}

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
      </DialogContent>
    </Dialog>
  )
}

