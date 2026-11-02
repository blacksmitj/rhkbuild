import { z } from "zod"

export const actionPlanSchema = z.object({
  indicatorId: z.string().min(1, { message: "Indicator (IKI) is required" }),
  actionDescription: z
    .string()
    .min(5, { message: "Action plan description must be at least 5 characters" })
    .max(1000, { message: "Action plan description cannot exceed 1000 characters" }),
  realizationValue: z.number({ message: "Realization must be a number" }).min(0, { message: "Realization must be non-negative" }),
  evidenceName: z
    .string()
    .min(3, { message: "Evidence description/name must be at least 3 characters" })
    .max(300, { message: "Evidence name cannot exceed 300 characters" }),
  evidenceType: z.enum(["url", "file"]).default("url"),
  evidenceValue: z
    .string()
    .min(1, { message: "Evidence link or file identifier is required" }),
})

export type ActionPlanFormValues = z.infer<typeof actionPlanSchema>

export const moveActionPlanSchema = z.object({
  targetIndicatorId: z.string().min(1, { message: "Destination indicator is required" }),
})

export type MoveActionPlanFormValues = z.infer<typeof moveActionPlanSchema>

