"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  moveActionPlanSchema,
  type MoveActionPlanFormValues,
} from "@/lib/schemas/action-plan-schema"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { useSkpStore, type ActionPlanWithEvidence } from "@/lib/stores/skp-store"
import { ArrowRightLeft, AlertTriangle } from "lucide-react"

interface MoveActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actionPlan: ActionPlanWithEvidence | null
}

export function MoveActionDialog({
  open,
  onOpenChange,
  actionPlan,
}: MoveActionDialogProps) {
  const { indicators, moveActionPlan } = useSkpStore()
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const currentIndicator = indicators.find((i) => i.id === actionPlan?.indicatorId)

  // Calon IKI target (selain yang sekarang)
  const candidateIndicators = indicators.filter((i) => i.id !== actionPlan?.indicatorId)

  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm<MoveActionPlanFormValues>({
    resolver: zodResolver(moveActionPlanSchema),
    defaultValues: {
      targetIndicatorId: candidateIndicators[0]?.id || "",
    },
  })

  const selectedTargetId = watch("targetIndicatorId")
  const targetIndicator = indicators.find((i) => i.id === selectedTargetId)

  // Deteksi perbedaan satuan secara live
  const hasUnitMismatch =
    currentIndicator &&
    targetIndicator &&
    currentIndicator.unit.toLowerCase() !== targetIndicator.unit.toLowerCase()

  React.useEffect(() => {
    if (open) {
      setErrorMessage(null)
      reset({
        targetIndicatorId: candidateIndicators[0]?.id || "",
      })
    }
  }, [open, actionPlan, reset])

  const onSubmit = (data: MoveActionPlanFormValues) => {
    if (!actionPlan) return
    const res = moveActionPlan(actionPlan.id, data.targetIndicatorId)
    if (!res.success && res.error) {
      setErrorMessage(res.error)
      return
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="size-5 text-primary" />
            <DialogTitle>Pindahkan Rencana Aksi ke IKI Lain</DialogTitle>
          </div>
          <DialogDescription>
            Rencana aksi beserta realisasi dan bukti dukungnya akan dipindahkan ke IKI tujuan (BR-15).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Rencana Aksi Preview */}
          <div className="p-3 bg-muted/40 rounded-lg border text-xs space-y-1">
            <span className="text-muted-foreground uppercase tracking-wider font-semibold">
              Rencana Aksi Yang Dipindahkan:
            </span>
            <p className="font-medium text-foreground line-clamp-2">
              "{actionPlan?.actionDescription}"
            </p>
            <div className="flex items-center gap-2 text-muted-foreground pt-1">
              <span>Realisasi: <strong>{actionPlan?.realizationValue} {currentIndicator?.unit}</strong></span>
              <span>•</span>
              <span>Bukti: {actionPlan?.evidence?.evidenceName || "-"}</span>
            </div>
          </div>

          {/* IKI Asal */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">IKI Asal Saat Ini</Label>
            <div className="p-2.5 rounded-md border bg-background text-xs font-medium">
              {currentIndicator?.indicatorName} ({currentIndicator?.unit})
            </div>
          </div>

          {/* Pilih IKI Tujuan */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Pilih IKI Tujuan <span className="text-destructive">*</span>
            </Label>
            <NativeSelect className="w-full" {...register("targetIndicatorId")}>
              {candidateIndicators.map((ind) => (
                <NativeSelectOption key={ind.id} value={ind.id}>
                  {ind.indicatorName} (Satuan: {ind.unit})
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          {/* Warning Perbedaan Satuan (BR-15 Guard) */}
          {hasUnitMismatch && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs">
              <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Peringatan Ketidakcocokan Satuan!</strong>
                <span>
                  Satuan IKI asal (<strong>{currentIndicator?.unit}</strong>) berbeda dengan satuan IKI tujuan (<strong>{targetIndicator?.unit}</strong>). Sesuai aturan BR-15, pemindahan dilarang jika satuannya tidak sesuai tanpa aturan konversi.
                </span>
              </div>
            </div>
          )}

          {/* Error Message dari Store */}
          {errorMessage && (
            <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs">
              {errorMessage}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={hasUnitMismatch}>
              Konfirmasi Pindahkan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

