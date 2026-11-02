"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSkpStore } from "@/lib/stores/skp-store"
import type { SkpIndicator } from "@/lib/mock-data"
import { Target, MoreVertical, Edit2, Trash2 } from "lucide-react"

interface IkiItemProps {
  indicator: SkpIndicator
  onEdit: (indicator: SkpIndicator) => void
  onDelete: (id: string) => void
}

export function IkiItem({ indicator, onEdit, onDelete }: IkiItemProps) {
  const { getAccumulatedRealization, currentUser } = useSkpStore()
  const realization = getAccumulatedRealization(indicator.id)
  const percentage =
    indicator.annualTarget > 0
      ? Math.min(100, Math.round((realization / indicator.annualTarget) * 100))
      : 0

  const userInitials =
    currentUser.name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "ASN"

  return (
    <div className="group relative flex items-center justify-between rounded-xl border border-border/60 bg-background/90 px-3.5 py-3 shadow-xs hover:border-emerald-500/30 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 transition-all gap-4">
      {/* Kolom Kiri: Ikon, Judul IKI, Aspek & Target */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Placeholder spacer level 3 */}
        <div className="size-4 shrink-0" />

        {/* Emerald Icon Pill */}
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100/70 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
          <Target className="size-4" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-foreground/90 break-words leading-tight line-clamp-2 md:line-clamp-1">
              {indicator.indicatorName}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
            <span className="capitalize font-medium text-emerald-700 dark:text-emerald-400">
              {indicator.measurementType || "kuantitatif"}
            </span>
            <span>•</span>
            <span>
              Target: <strong className="text-foreground">{indicator.annualTarget}</strong> {indicator.unit}
            </span>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Status Progress Pill, Avatar & Menu Aksi */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Progress Pill Bar Hijau Minimalist ala Referensi */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 dark:bg-emerald-950/40 dark:border-emerald-800/50">
          <div className="w-16 bg-emerald-200 dark:bg-emerald-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 dark:bg-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200 font-mono">
            {realization} of {indicator.annualTarget} {indicator.unit}
          </span>
        </div>

        {/* Avatar Pegawai */}
        <Avatar size="sm" className="hidden sm:inline-flex ring-1 ring-border">
          <AvatarFallback className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-bold">
            {userInitials}
          </AvatarFallback>
        </Avatar>

        {/* Menu Aksi */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <MoreVertical className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(indicator)} className="cursor-pointer">
              <Edit2 className="size-3.5 mr-2" />
              Edit IKI
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(indicator.id)}
              className="cursor-pointer text-destructive focus:text-destructive"
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
