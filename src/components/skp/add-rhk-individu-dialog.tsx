"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { rhkIndividuSchema, type RhkIndividuFormValues } from "@/lib/schemas/skp-schema"
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
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { useSkpStore } from "@/lib/stores/skp-store"

interface AddRhkIndividuDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultLeadInterventionId?: string
  editData?: { id: string; leadInterventionId: string; title: string } | null
}

export function AddRhkIndividuDialog({
  open,
  onOpenChange,
  defaultLeadInterventionId,
  editData,
}: AddRhkIndividuDialogProps) {
  const { leadInterventions, addWorkPlan, updateWorkPlan } = useSkpStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RhkIndividuFormValues>({
    resolver: zodResolver(rhkIndividuSchema),
    defaultValues: {
      leadInterventionId: editData?.leadInterventionId || defaultLeadInterventionId || "",
      title: editData?.title || "",
    },
  })

  React.useEffect(() => {
    if (open) {
      reset({
        leadInterventionId: editData?.leadInterventionId || defaultLeadInterventionId || (leadInterventions[0]?.id || ""),
        title: editData?.title || "",
      })
    }
  }, [open, editData, defaultLeadInterventionId, leadInterventions, reset])

  const onSubmit = (data: RhkIndividuFormValues) => {
    if (editData) {
      updateWorkPlan(editData.id, data.title)
    } else {
      addWorkPlan(data.leadInterventionId, data.title)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit RHK Individu" : "Tambah RHK Individu"}
          </DialogTitle>
          <DialogDescription>
            Rencana Hasil Kerja (RHK) Individu pegawai yang selaras dengan rencana pimpinan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Select RHK Pimpinan */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              RHK Pimpinan yang Diintervensi <span className="text-destructive">*</span>
            </Label>
            <NativeSelect
              className="w-full"
              disabled={!!editData}
              {...register("leadInterventionId")}
            >
              {leadInterventions.map((lead, idx) => (
                <NativeSelectOption key={lead.id} value={lead.id}>
                  {idx + 1}. {lead.title}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {errors.leadInterventionId && (
              <p className="text-xs text-destructive">{errors.leadInterventionId.message}</p>
            )}
          </div>

          {/* Uraian RHK Individu */}
          <div className="space-y-2">
            <Label htmlFor="wp-title" className="text-sm font-medium">
              Uraian Rencana Kinerja Individu <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="wp-title"
              rows={4}
              placeholder="Contoh: Terlaksananya pelatihan kompetensi teknis bagi aparatur..."
              {...register("title")}
              className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
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
              {editData ? "Simpan Perubahan" : "Tambah RHK Individu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
