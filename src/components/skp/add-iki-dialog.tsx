"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ikiSchema, type IkiFormValues } from "@/lib/schemas/skp-schema"
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
import { useSkpStore } from "@/lib/stores/skp-store"
import type { SkpIndicator } from "@/lib/mock-data"

interface AddIkiDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultWorkPlanId?: string
  editData?: SkpIndicator | null
}

export function AddIkiDialog({
  open,
  onOpenChange,
  defaultWorkPlanId,
  editData,
}: AddIkiDialogProps) {
  const { workPlans, masterUnits, addIndicator, updateIndicator } = useSkpStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IkiFormValues>({
    resolver: zodResolver(ikiSchema),
    defaultValues: {
      workPlanId: editData?.workPlanId || defaultWorkPlanId || "",
      indicatorName: editData?.indicatorName || "",
      annualTarget: editData?.annualTarget || 1,
      unit: editData?.unit || "JPL",
      measurementType: editData?.measurementType || "kuantitatif",
    },
  })

  React.useEffect(() => {
    if (open) {
      reset({
        workPlanId: editData?.workPlanId || defaultWorkPlanId || (workPlans[0]?.id || ""),
        indicatorName: editData?.indicatorName || "",
        annualTarget: editData?.annualTarget || 1,
        unit: editData?.unit || "JPL",
        measurementType: editData?.measurementType || "kuantitatif",
      })
    }
  }, [open, editData, defaultWorkPlanId, workPlans, reset])

  const onSubmit = (data: IkiFormValues) => {
    if (editData) {
      updateIndicator(editData.id, {
        indicatorName: data.indicatorName,
        annualTarget: Number(data.annualTarget),
        unit: data.unit,
        measurementType: data.measurementType,
      })
    } else {
      addIndicator({
        workPlanId: data.workPlanId,
        indicatorName: data.indicatorName,
        annualTarget: Number(data.annualTarget),
        unit: data.unit,
        measurementType: data.measurementType,
      })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Indikator Kinerja Individu (IKI)" : "Tambah IKI Baru"}
          </DialogTitle>
          <DialogDescription>
            Tentukan tolak ukur keberhasilan tahunan beserta target dan satuan terstandarisasi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* RHK Individu Induk */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              RHK Individu Terkait <span className="text-destructive">*</span>
            </Label>
            <NativeSelect
              className="w-full"
              disabled={!!editData}
              {...register("workPlanId")}
            >
              {workPlans.map((wp, idx) => (
                <NativeSelectOption key={wp.id} value={wp.id}>
                  {idx + 1}. {wp.title}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {errors.workPlanId && (
              <p className="text-xs text-destructive">{errors.workPlanId.message}</p>
            )}
          </div>

          {/* Nama IKI */}
          <div className="space-y-2">
            <Label htmlFor="iki-name" className="text-sm font-medium">
              Indikator Kinerja Individu (IKI) <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="iki-name"
              rows={3}
              placeholder="Contoh: Jumlah Jam Pelajaran pelatihan kompetensi yang terlaksana..."
              {...register("indicatorName")}
              className={errors.indicatorName ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.indicatorName && (
              <p className="text-xs text-destructive">{errors.indicatorName.message}</p>
            )}
          </div>

          {/* Target Tahunan & Satuan */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annualTarget" className="text-sm font-medium">
                Target Tahunan <span className="text-destructive">*</span>
              </Label>
              <Input
                id="annualTarget"
                type="number"
                min="0.1"
                step="any"
                placeholder="20"
                {...register("annualTarget", { valueAsNumber: true })}
                className={errors.annualTarget ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.annualTarget && (
                <p className="text-xs text-destructive">{errors.annualTarget.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Satuan <span className="text-destructive">*</span>
              </Label>
              <NativeSelect
                className="w-full"
                {...register("unit")}
              >
                {masterUnits.map((u) => (
                  <NativeSelectOption key={u} value={u}>
                    {u}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {errors.unit && (
                <p className="text-xs text-destructive">{errors.unit.message}</p>
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
              {editData ? "Simpan Perubahan" : "Tambah IKI"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
