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
      actionDescription: "",
      realizationValue: 1,
      evidenceName: "",
      evidenceType: "url",
      evidenceValue: "",
    },
  })

  const evidenceType = watch("evidenceType")

  React.useEffect(() => {
    if (open) {
      if (editData) {
        reset({
          indicatorId: indicator.id,
          actionDescription: editData.actionDescription,
          realizationValue: editData.realizationValue,
          evidenceName: editData.evidence?.evidenceName || "",
          evidenceType: editData.evidence?.evidenceType || "url",
          evidenceValue: editData.evidence?.evidenceValue || "",
        })
      } else {
        reset({
          indicatorId: indicator.id,
          actionDescription: "",
          realizationValue: 1,
          evidenceName: "",
          evidenceType: "url",
          evidenceValue: "",
        })
      }
    }
  }, [open, editData, indicator.id, reset])

  const onSubmit = (data: ActionPlanFormValues) => {
    if (editData) {
      updateActionPlan({
        id: editData.id,
        actionDescription: data.actionDescription,
        realizationValue: data.realizationValue,
        evidenceName: data.evidenceName,
        evidenceType: data.evidenceType,
        evidenceValue: data.evidenceValue,
      })
    } else {
      addActionPlan({
        indicatorId: indicator.id,
        actionDescription: data.actionDescription,
        realizationValue: data.realizationValue,
        evidenceName: data.evidenceName,
        evidenceType: data.evidenceType,
        evidenceValue: data.evidenceValue,
      })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {editData ? "Edit Rencana Aksi Bulanan" : "Tambah Rencana Aksi Bulanan"}
            </DialogTitle>
            <DialogDescription>
              Periode {MONTH_NAMES[selectedMonth - 1]} {selectedYear} &bull; Target:{" "}
              {indicator.annualTarget} {indicator.unit}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Konteks IKI */}
            <div className="rounded-lg bg-muted/60 p-3 text-xs border">
              <span className="font-semibold text-foreground">Indikator Kinerja Individu (IKI):</span>
              <p className="mt-0.5 text-muted-foreground">{indicator.indicatorName}</p>
            </div>

            {/* Uraian Rencana Aksi */}
            <div className="space-y-1.5">
              <Label htmlFor="actionDescription">
                Rencana Aksi <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="actionDescription"
                rows={3}
                placeholder="Contoh: Menyusun draf pedoman teknis pengelolaan arsip kepegawaian..."
                {...register("actionDescription")}
              />
              {errors.actionDescription && (
                <p className="text-xs text-destructive">{errors.actionDescription.message}</p>
              )}
            </div>

            {/* Realisasi Angka */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="realizationValue">
                  Realisasi Capaian <span className="text-destructive">*</span>
                </Label>
                <span className="text-xs text-muted-foreground">Satuan: {indicator.unit}</span>
              </div>
              <Input
                id="realizationValue"
                type="number"
                step="any"
                min="0"
                {...register("realizationValue", { valueAsNumber: true })}
              />
              {errors.realizationValue && (
                <p className="text-xs text-destructive">{errors.realizationValue.message}</p>
              )}
            </div>

            {/* Bukti Dukung (Tepat 1 Bukti per BR-10) */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Bukti Dukung (Evidence)
                </span>
                <span className="text-[11px] text-muted-foreground">(Wajib 1 bukti)</span>
              </div>

              {/* Nama/Deskripsi Bukti Dukung */}
              <div className="space-y-1.5">
                <Label htmlFor="evidenceName" className="text-xs">
                  Nama / Keterangan Bukti <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="evidenceName"
                  placeholder="Contoh: Laporan Kegiatan Tahap 1 / Notula Rapat"
                  {...register("evidenceName")}
                />
                {errors.evidenceName && (
                  <p className="text-xs text-destructive">{errors.evidenceName.message}</p>
                )}
              </div>

              {/* Tipe Bukti Dukung */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="evidenceType" className="text-xs">
                    Tipe Bukti
                  </Label>
                  <NativeSelect id="evidenceType" {...register("evidenceType")}>
                    <NativeSelectOption value="url">Tautan (URL Link)</NativeSelectOption>
                    <NativeSelectOption value="file">Unggah Berkas (Mock File)</NativeSelectOption>
                  </NativeSelect>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="evidenceValue" className="text-xs">
                    {evidenceType === "url" ? "Alamat Tautan (URL)" : "Nama Berkas / ID Berkas"}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="evidenceValue"
                      placeholder={
                        evidenceType === "url"
                          ? "https://drive.google.com/..."
                          : "dokumen-laporan.pdf"
                      }
                      className="pl-8"
                      {...register("evidenceValue")}
                    />
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {evidenceType === "url" ? (
                        <Link2 className="size-4" />
                      ) : (
                        <FileUp className="size-4" />
                      )}
                    </div>
                  </div>
                  {errors.evidenceValue && (
                    <p className="text-xs text-destructive">{errors.evidenceValue.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">
              {editData ? "Simpan Perubahan" : "Tambah Rencana Aksi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

