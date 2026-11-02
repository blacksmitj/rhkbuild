"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { rhkPimpinanSchema, type RhkPimpinanFormValues } from "@/lib/schemas/skp-schema"
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
import { useSkpStore } from "@/lib/stores/skp-store"

interface AddRhkPimpinanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editData?: { id: string; title: string } | null
}

export function AddRhkPimpinanDialog({
  open,
  onOpenChange,
  editData,
}: AddRhkPimpinanDialogProps) {
  const { addLeadIntervention, updateLeadIntervention } = useSkpStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RhkPimpinanFormValues>({
    resolver: zodResolver(rhkPimpinanSchema),
    defaultValues: {
      title: editData?.title || "",
    },
  })

  React.useEffect(() => {
    if (open) {
      reset({ title: editData?.title || "" })
    }
  }, [open, editData, reset])

  const onSubmit = (data: RhkPimpinanFormValues) => {
    if (editData) {
      updateLeadIntervention(editData.id, data.title)
    } else {
      addLeadIntervention(data.title)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit RHK Pimpinan" : "Tambah RHK Pimpinan"}
          </DialogTitle>
          <DialogDescription>
            Rencana Hasil Kerja (RHK) Pimpinan yang akan diintervensi oleh kinerja pegawai.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Uraian RHK Pimpinan yang Diintervensi <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="title"
              rows={4}
              placeholder="Contoh: Meningkatnya kualitas dan akuntabilitas penyelenggaraan pelatihan teknis ASN..."
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
              {editData ? "Simpan Perubahan" : "Tambah RHK"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

