"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  actionPlanSchema,
  type ActionPlanFormValues,
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
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { useSkpStore, type ActionPlanWithEvidence } from "@/lib/stores/skp-store"
import { MONTH_NAMES, type SkpIndicator } from "@/lib/mock-data"
import { Link2, FileUp } from "lucide-react"

interface AddActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  indicator: SkpIndicator
  editData?: ActionPlanWithEvidence | null
}

export function AddActionDialog({
  open,
  onOpenChange,
  indicator,
  editData,
}: AddActionDialogProps) {
  const { addActionPlan, updateActionPlan, selectedMonth, selectedYear } = useSkpStore()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ActionPlanFormValues>({
    resolver: zodResolver(actionPlanSchema),
    defaultValues: {
      indicatorId: indicator.id,
      actionDescription: editData?.actionDescription || "",
      realizationValue: editData?.realizationValue || 1,
      evidenceName: editData?.evidence?.evidenceName || "",
      evidenceType: editData?.evidence?.evidenceType || "url",
      evidenceValue: editData?.evidence?.evidenceValue || "",
    },
  })

  const evidenceType = watch("evidenceType")

  React.useEffect(() => {
    if (open) {
      reset({
        indicatorId: indicator.id,
        actionDescription: editData?.actionDescription || "",
        realizationValue: editData?.realizationValue ?? 1,
        evidenceName: editData?.evidence?.evidenceName || "",
        evidenceType: editData?.evidence?.evidenceType || "url",
        evidenceValue: editData?.evidence?.evidenceValue || "",
      })
    }
  }, [open, indicator, editData, reset])

  const onSubmit = (data: ActionPlanFormValues) => {
    if (editData) {
      updateActionPlan({
        id: editData.id,
        actionDescription: data.actionDescription,
        realizationValue: Number(data.realizationValue),
        evidenceName: data.evidenceName,
        evidenceType: data.evidenceType,
        evidenceValue: data.evidenceValue,
      })
    } else {
      addActionPlan({
        indicatorId: indicator.id,
        actionDescription: data.actionDescription,
        realizationValue: Number(data.realizationValue),
        evidenceName: data.evidenceName,
        evidenceType: data.evidenceType,
        evidenceValue: data.evidenceValue,
      })
    }
    onOpenChange(false)
  }

  const monthLabel = MONTH_NAMES[selectedMonth - 1]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Rencana Aksi & Realisasi" : "Tambah Rencana Aksi"}
          </DialogTitle>
          <DialogDescription>
            Periode: <strong className="text-foreground">{monthLabel} {selectedYear}</strong> — Terkait IKI: {indicator.indicatorName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* IKI Readonly info */}
          <div className="p-3 bg-muted/40 rounded-lg border text-xs space-y-1">
            <span className="font-semibold text-muted-foreground uppercase tracking-wider block">
              Indikator Kinerja Individu (Terkunci)
            </span>
            <p className="font-medium text-foreground">{indicator.indicatorName}</p>
            <p className="text-muted-foreground">
              Target Tahunan: <strong>{indicator.annualTarget} {indicator.unit}</strong>
            </p>
          </div>

          {/* Action Description */}
          <div className="space-y-2">
            <Label htmlFor="actionDescription" className="text-sm font-medium">
              Uraian Rencana Aksi Bulan Ini <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="actionDescription"
              rows={3}
              placeholder="Contoh: Melaksanakan bimbingan teknis persiapan diklat pengadaan barang dan jasa tahap I..."
              {...register("actionDescription")}
              className={errors.actionDescription ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.actionDescription && (
              <p className="text-xs text-destructive">{errors.actionDescription.message}</p>
            )}
          </div>

          {/* Realisasi Bulan Ini (otomatis sesuai satuan IKI) */}
          <div className="space-y-2">
            <Label htmlFor="realizationValue" className="text-sm font-medium flex items-center justify-between">
              <span>Realisasi Bulan Ini <span className="text-destructive">*</span></span>
              <span className="text-xs font-normal text-muted-foreground">
                Satuan otomatis: <strong className="text-foreground">{indicator.unit}</strong>
              </span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="realizationValue"
                type="number"
                min="0"
                step="any"
                placeholder="4"
                {...register("realizationValue", { valueAsNumber: true })}
                className={errors.realizationValue ? "border-destructive focus-visible:ring-destructive flex-1" : "flex-1"}
              />
              <span className="text-sm font-medium text-muted-foreground min-w-16">
                {indicator.unit}
              </span>
            </div>
            {errors.realizationValue && (
              <p className="text-xs text-destructive">{errors.realizationValue.message}</p>
            )}
          </div>

          {/* Bukti Dukung (Maksimal 1 per BR-10) */}
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Bukti Dukung (Maksimal 1 Objek - BR-10) <span className="text-destructive">*</span>
              </Label>
              <div className="w-32">
                <NativeSelect size="sm" {...register("evidenceType")}>
                  <NativeSelectOption value="url">Tautan (URL)</NativeSelectOption>
                  <NativeSelectOption value="file">File Dokumen</NativeSelectOption>
                </NativeSelect>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Nama / Label Bukti Dukung (misal: Notulensi & Dokumentasi Foto Diklat)"
                {...register("evidenceName")}
                className={errors.evidenceName ? "border-destructive text-sm" : "text-sm"}
              />
              {errors.evidenceName && (
                <p className="text-xs text-destructive">{errors.evidenceName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                {evidenceType === "url" ? (
                  <Link2 className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                ) : (
                  <FileUp className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                )}
                <Input
                  className={`pl-9 text-sm ${errors.evidenceValue ? "border-destructive" : ""}`}
                  placeholder={
                    evidenceType === "url"
                      ? "https://drive.google.com/..."
                      : "file-laporan-kegiatan-final.pdf"
                  }
                  {...register("evidenceValue")}
                />
              </div>
              {errors.evidenceValue && (
                <p className="text-xs text-destructive">{errors.evidenceValue.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">
              {editData ? "Simpan Perubahan" : "Simpan Rencana Aksi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

