"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import type { MonthStatus } from "@/lib/mock-data"

interface MonthStatusBadgeProps {
  status: MonthStatus
  className?: string
}

export function MonthStatusBadge({ status, className }: MonthStatusBadgeProps) {
  switch (status) {
    case "selesai":
      return (
        <Badge
          variant="outline"
          className={`bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1 font-medium ${className || ""}`}
        >
          <CheckCircle2 className="size-3.5" />
          Selesai Diisi
        </Badge>
      )
    case "draft":
      return (
        <Badge
          variant="outline"
          className={`bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1 font-medium ${className || ""}`}
        >
          <Clock className="size-3.5" />
          Draft
        </Badge>
      )
    case "belum_diisi":
    default:
      return (
        <Badge
          variant="outline"
          className={`bg-slate-100 text-slate-600 border-slate-200 flex items-center gap-1 font-medium ${className || ""}`}
        >
          <AlertCircle className="size-3.5" />
          Belum Diisi
        </Badge>
      )
  }
}

