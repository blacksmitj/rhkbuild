"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSkpStore } from "@/lib/stores/skp-store"
import type { SkpIndicator } from "@/lib/mock-data"
import { Target, MoreVertical, Edit2, Trash2 } from "lucide-react"

interface IkiItemProps {
  indicator: SkpIndicator
  onEdit: (indicator: SkpIndicator) => void
  onDelete: (id: string) => void
}

export function IkiItem({ indicator, onEdit, onDelete }: IkiItemProps) {
  const { getAccumulatedRealization } = useSkpStore()
  const realization = getAccumulatedRealization(indicator.id)
  const percentage = indicator.annualTarget > 0
    ? Math.min(100, Math.round((realization / indicator.annualTarget) * 100))
    : 0

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-3.5 rounded-lg border bg-card/60 hover:bg-card hover:border-primary/30 transition-all gap-4">
      {/* Detail IKI */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0 mt-0.5">
          <Target className="size-4" />
        </div>
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              IKI #{indicator.order}
            </span>
            <Badge variant="outline" className="text-xs font-mono font-medium">
              Target: {indicator.annualTarget} {indicator.unit}
            </Badge>
          </div>
          <p className="text-sm font-medium leading-snug break-words">
            {indicator.indicatorName}
          </p>
        </div>
      </div>

      {/* Akumulasi Realisasi Progress */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="w-44 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-foreground">
              {realization} {indicator.unit}
            </span>
            <span className="text-muted-foreground font-mono">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-1.5" />
          <span className="text-[10px] text-muted-foreground block text-right">
            dari {indicator.annualTarget} {indicator.unit}
          </span>
        </div>

        {/* Dropdown Action */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreVertical className="size-4" />
            </Button>
          } />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(indicator)} className="cursor-pointer">
              <Edit2 className="size-3.5 mr-2" />
              Edit IKI
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(indicator.id)}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <Trash2 className="size-3.5 mr-2" />
              Hapus IKI
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
