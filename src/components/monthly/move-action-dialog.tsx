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

  React.useEffect(() => {
    if (open && candidateIndicators.length > 0) {
      reset({ targetIndicatorId: candidateIndicators[0].id })
      setErrorMessage(null)
    }
  }, [open, reset])

  const onSubmit = (data: MoveActionPlanFormValues) => {
    if (!actionPlan) return

    const result = moveActionPlan(actionPlan.id, data.targetIndicatorId)
    if (!result.success) {
      setErrorMessage(result.error || "Gagal memindahkan rencana aksi")
      return
    }

    onOpenChange(false)
  }

  if (!actionPlan) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="size-5 text-primary" />
              <span>Pindahkan Rencana Aksi</span>
            </DialogTitle>
            <DialogDescription>
              Pindahkan uraian aksi dan bukti dukung ini ke Indikator Kinerja Individu (IKI) lainnya.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Pratinjau Rencana Aksi yang dipindah */}
            <div className="rounded-lg bg-muted/60 p-3 text-xs border space-y-1">
              <span className="font-semibold text-foreground">Rencana Aksi:</span>
              <p className="text-muted-foreground">{actionPlan.actionDescription}</p>
            </div>

            {/* Asal IKI */}
            <div className="space-y-1 text-xs">
              <span className="font-medium text-muted-foreground">Indikator Kinerja Asal:</span>
              <p className="font-semibold text-foreground">{currentIndicator?.indicatorName}</p>
            </div>

            {/* Target IKI Tujuan */}
            <div className="space-y-1.5 pt-2">
              <Label htmlFor="targetIndicatorId" className="text-sm font-semibold">
                Pilih Indikator Kinerja Tujuan <span className="text-destructive">*</span>
              </Label>
              {candidateIndicators.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  Tidak ada IKI lain yang tersedia dalam SKP Anda.
                </p>
              ) : (
                <NativeSelect id="targetIndicatorId" {...register("targetIndicatorId")}>
                  {candidateIndicators.map((ind) => (
                    <NativeSelectOption key={ind.id} value={ind.id}>
                      {ind.indicatorName} ({ind.annualTarget} {ind.unit})
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            </div>

            {/* Pesan Error (misal jika ada duplikasi) */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                <AlertTriangle className="size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={candidateIndicators.length === 0}
            >
              Pindahkan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

