import { z } from "zod"

export const rhkPimpinanSchema = z.object({
  title: z
    .string()
    .min(5, { message: "RHK Pimpinan minimal 5 karakter" })
    .max(500, { message: "RHK Pimpinan maksimal 500 karakter" }),
})

export type RhkPimpinanFormValues = z.infer<typeof rhkPimpinanSchema>

export const rhkIndividuSchema = z.object({
  leadInterventionId: z.string().min(1, { message: "Pilih RHK Pimpinan yang diintervensi" }),
  title: z
    .string()
    .min(5, { message: "RHK Individu minimal 5 karakter" })
    .max(500, { message: "RHK Individu maksimal 500 karakter" }),
})

export type RhkIndividuFormValues = z.infer<typeof rhkIndividuSchema>

export const ikiSchema = z.object({
  workPlanId: z.string().min(1, { message: "Pilih RHK Individu" }),
  indicatorName: z
    .string()
    .min(5, { message: "Nama IKI minimal 5 karakter" })
    .max(500, { message: "Nama IKI maksimal 500 karakter" }),
  annualTarget: z.number({ message: "Target harus berupa angka" }).positive({ message: "Target harus lebih dari 0" }),
  unit: z.string().min(1, { message: "Satuan wajib diisi atau dipilih" }),
  measurementType: z.enum(["kuantitatif", "kualitatif"]),
})

export type IkiFormValues = z.infer<typeof ikiSchema>
