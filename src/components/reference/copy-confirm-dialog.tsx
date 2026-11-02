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
          {/* Box Detail Sumber */}
          <div className="bg-muted/60 p-3 rounded-lg border space-y-1.5">
            <div>
              <span className="font-semibold text-foreground">Pemilik Asal:</span>{" "}
              <span className="text-muted-foreground">{reference.ownerName} ({reference.nip})</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">Rencana Aksi:</span>
              <p className="text-muted-foreground mt-0.5">{reference.actionDescription}</p>
            </div>
            <div>
              <span className="font-semibold text-foreground">Bukti Dukung Disalin:</span>{" "}
              <span className="text-muted-foreground">{reference.evidenceName}</span>
            </div>
          </div>

          {/* Warning / Duplikasi Notice */}
          {isDuplicate ? (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-xs">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Peringatan Duplikasi (BR-12)</p>
                <p className="text-[11px] mt-0.5">
                  Rencana aksi dengan deskripsi yang sama sudah ada pada IKI ini untuk periode yang dipilih. Anda tidak dapat menyalin rencana aksi yang sama persis.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs">
              <ShieldCheck className="size-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Validasi Lolos</p>
                <p className="text-[11px] mt-0.5">
                  Aksi ini unik dan dapat disalin langsung ke tabel pengisian bulanan Anda.
                </p>
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDuplicate}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Ya, Salin ke Rencana Aksi Saya
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
