"use client"

import * as React from "react"
import { Plus, Check, X, Link2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSkpStore } from "@/lib/stores/skp-store"
import type { SkpIndicator } from "@/lib/mock-data"

interface InlineActionInputRowProps {
  indicator: SkpIndicator
  onFinished?: () => void
}

export function InlineActionInputRow({
  indicator,
  onFinished,
}: InlineActionInputRowProps) {
  const { addActionPlan } = useSkpStore()

  const [description, setDescription] = React.useState("")
  const [evidenceName, setEvidenceName] = React.useState("")
  const [evidenceUrl, setEvidenceUrl] = React.useState("")
  const [realization, setRealization] = React.useState<number | "">("")

  const [isExpanded, setIsExpanded] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleStartInput = () => {
    setIsExpanded(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 50)
  }

  const handleCancel = () => {
    setDescription("")
    setEvidenceName("")
    setEvidenceUrl("")
    setRealization("")
    setIsExpanded(false)
    onFinished?.()
  }

  const handleSave = () => {
    if (!description.trim()) {
      inputRef.current?.focus()
      return
    }

    // Default evidence name jika dikosongkan namun url diisi
    const finalEvidenceName = evidenceName.trim() || (evidenceUrl.trim() ? "Tautan Bukti Dukung" : "-")
    const finalEvidenceUrl = evidenceUrl.trim() || "-"
    const numRealization = realization === "" ? 1 : Number(realization)

    addActionPlan({
      indicatorId: indicator.id,
      actionDescription: description.trim(),
      realizationValue: numRealization,
      evidenceName: finalEvidenceName,
      evidenceType: "url",
      evidenceValue: finalEvidenceUrl,
    })

    // Reset input agar siap input item berikutnya (seamless rapid entry)
    setDescription("")
    setEvidenceName("")
    setEvidenceUrl("")
    setRealization("")
    inputRef.current?.focus()
    onFinished?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  if (!isExpanded) {
    return (
      <tr className="border-t border-dashed border-border/80 bg-muted/5 hover:bg-muted/20 transition-colors">
        <td colSpan={4} className="py-2.5 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStartInput}
            className="w-full justify-start text-xs text-muted-foreground hover:text-primary gap-2 h-8 font-normal"
          >
            <Plus className="size-3.5" />
            <span>Klik di sini untuk langsung ketik rencana aksi baru (tekan Enter untuk simpan)...</span>
          </Button>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-t border-primary/30 bg-primary/[0.02] transition-colors">
      {/* Kolom 1: Uraian Rencana Aksi */}
      <td className="py-2.5 px-4 align-top">
        <div className="space-y-1">
          <Input
            ref={inputRef}
            placeholder="Tulis rencana aksi (contoh: Menyusun draf laporan bulanan...)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 text-xs bg-background"
          />
          <span className="text-[10px] text-muted-foreground block">
            Tekan <kbd className="font-mono bg-muted px-1 rounded">Enter</kbd> untuk simpan & lanjut input.
          </span>
        </div>
      </td>

      {/* Kolom 2: Bukti Dukung (Nama & Link) */}
      <td className="py-2.5 px-4 align-top">
        <div className="space-y-1.5">
          <Input
            placeholder="Nama bukti (opsional: Lap. Kinerja)"
            value={evidenceName}
            onChange={(e) => setEvidenceName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-7 text-xs bg-background"
          />
          <div className="relative">
            <Link2 className="absolute left-2 top-2 size-3 text-muted-foreground" />
            <Input
              placeholder="https://drive.google.com/..."
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-7 text-xs pl-7 bg-background"
            />
          </div>
        </div>
      </td>

      {/* Kolom 3: Realisasi */}
      <td className="py-2.5 px-4 align-top">
        <div className="flex items-center gap-1.5">
          <Input
            type="number"
            min={0}
            step="any"
            placeholder="1"
            value={realization}
            onChange={(e) =>
              setRealization(e.target.value === "" ? "" : Number(e.target.value))
            }
            onKeyDown={handleKeyDown}
            className="h-8 w-20 text-xs bg-background"
          />
          <span className="text-xs text-muted-foreground font-medium">
            {indicator.unit}
          </span>
        </div>
      </td>

      {/* Kolom 4: Tombol Simpan / Batal */}
      <td className="py-2.5 px-4 align-top text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={!description.trim()}
            className="h-7 px-2.5 text-xs gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
            title="Simpan (Enter)"
          >
            <Check className="size-3" />
            <span>Simpan</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Batal (Esc)"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  )
}

