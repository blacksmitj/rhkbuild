"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { ColleagueReference } from "@/lib/mock-data"
import { Copy, AlertTriangle, ShieldCheck } from "lucide-react"

interface CopyConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reference: ColleagueReference | null
  targetMonthName: string
  targetYear: number
  isDuplicate: boolean
  onConfirm: () => void
}

export function CopyConfirmDialog({
  open,
  onOpenChange,
  reference,
  targetMonthName,
  targetYear,
  isDuplicate,
  onConfirm,
}: CopyConfirmDialogProps) {
  if (!reference) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Copy className="size-5" />
            <AlertDialogTitle>Konfirmasi Salin Rencana Aksi</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-xs text-muted-foreground">
            Aktivitas akan disalin sebagai record baru pada periode <strong>{targetMonthName} {targetYear}</strong> (BR-09).
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 py-2 text-xs">
          {/* Uraian Aktivitas yang disalin */}
          <div className="p-3 rounded-lg border bg-muted/40">
            <span className="font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Rencana Aksi Referensi:
            </span>
            <p className="font-medium text-foreground leading-relaxed">
              "{reference.actionDescription}"
            </p>
            <div className="mt-2 text-[11px] text-muted-foreground">
              Pemilik asal: {reference.ownerName} ({reference.unitName})
            </div>
          </div>

          {/* Ketentuan Bisnis PRD Bagian 4E */}
          <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/70 text-blue-900 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="size-4 text-blue-600 shrink-0" />
              <span>Aturan Penyalinan (PRD Bagian 4E & BR-16):</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-1">
              <li>Teks deskripsi rencana aksi dan nama bukti dukung akan disalin.</li>
              <li>Tautan bukti dukung ditandai sebagai <em>referensi</em> yang perlu Anda sesuaikan.</li>
              <li>Nilai realisasi <strong>dikosongkan (0)</strong> untuk diisi ulang sesuai pelaksanaan nyata.</li>
            </ul>
          </div>

          {/* Peringatan Duplikat Identik (PRD Bagian 4F) */}
          {isDuplicate && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900">
              <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Peringatan Duplikasi</strong>
                <span>
                  Rencana aksi dengan uraian serupa sudah ada di IKI dan bulan berjalan. Sistem mengizinkan aktivitas serupa, namun mohon pastikan aktivitasnya benar-benar berbeda.
                </span>
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Lanjutkan & Salin
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

