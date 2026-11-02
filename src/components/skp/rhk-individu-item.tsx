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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSkpStore } from "@/lib/stores/skp-store"
import { IkiItem } from "@/components/skp/iki-item"
import type { SkpWorkPlan, SkpIndicator } from "@/lib/mock-data"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Award,
} from "lucide-react"

interface RhkIndividuItemProps {
  workPlan: SkpWorkPlan
  onAddIki: (workPlanId: string) => void
  onEditWp: (workPlan: SkpWorkPlan) => void
  onDeleteWp: (workPlanId: string) => void
  onEditIki: (indicator: SkpIndicator) => void
  onDeleteIki: (indicatorId: string) => void
}

export function RhkIndividuItem({
  workPlan,
  onAddIki,
  onEditWp,
  onDeleteWp,
  onEditIki,
  onDeleteIki,
}: RhkIndividuItemProps) {
  const [isOpen, setIsOpen] = React.useState(true)
  const { getIndicatorsByWorkPlan, currentUser } = useSkpStore()
  const indicators = getIndicatorsByWorkPlan(workPlan.id)

  const userInitials =
    currentUser.name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "ASN"

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      {/* Level 2: Row RHK Individu */}
      <div className="group relative flex items-center justify-between rounded-xl border border-border/70 bg-card px-3.5 py-3 shadow-xs hover:border-emerald-500/40 hover:bg-muted/30 transition-all gap-4">
        {/* Kolom Kiri: Chevron, Icon, Judul & Subtitle */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Chevron Collapse */}
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-6 shrink-0 text-muted-foreground hover:text-foreground rounded-md p-0"
              >
                {isOpen ? (
                  <ChevronDown className="size-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="size-4 text-muted-foreground" />
                )}
              </Button>
            }
          />

          {/* Mint Icon Box */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-100/70 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
            <Award className="size-4" />
          </div>

          {/* Title & Metadata */}
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground tracking-tight line-clamp-1">
                {workPlan.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="font-medium text-teal-700 dark:text-teal-400">
                {(workPlan as any).type === "tambahan" ? "Kinerja Tambahan" : "Kinerja Utama"}
              </span>
              <span>•</span>
              <span>{indicators.length} Indikator Kinerja (IKI)</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pill Status Kategori, Avatar & Aksi */}
        <div className="flex items-center gap-3 shrink-0">
          <Badge
            variant="outline"
            className="hidden sm:inline-flex bg-teal-50 text-teal-800 border-teal-200/70 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/50 text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            {indicators.length} IKI terhubung
          </Badge>

          {/* Avatar Pegawai */}
          <Avatar size="sm" className="hidden sm:inline-flex ring-1 ring-border">
            <AvatarFallback className="text-[10px] bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 font-bold">
              {userInitials}
            </AvatarFallback>
          </Avatar>

          {/* Dropdown Menu */}
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
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onAddIki(workPlan.id)} className="cursor-pointer">
                <Plus className="size-3.5 mr-2 text-emerald-600" />
                Tambah IKI
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditWp(workPlan)} className="cursor-pointer">
                <Edit2 className="size-3.5 mr-2" />
                Edit RHK Individu
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDeleteWp(workPlan.id)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="size-3.5 mr-2" />
                Hapus RHK Individu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Level 3: Children (IKIs) with Tree Indentation */}
      <CollapsibleContent className="space-y-2 pl-6 md:pl-10 relative before:absolute before:left-3.5 md:before:left-5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-border/60">
        {indicators.length === 0 ? (
          <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-border/70 bg-muted/20 text-xs text-muted-foreground">
            <span>Belum ada Indikator Kinerja Individu (IKI).</span>
            <Button
              size="xs"
              variant="outline"
              onClick={() => onAddIki(workPlan.id)}
              className="gap-1 text-xs"
            >
              <Plus className="size-3" /> Tambah IKI
            </Button>
          </div>
        ) : (
          indicators.map((indicator) => (
            <IkiItem
              key={indicator.id}
              indicator={indicator}
              onEdit={onEditIki}
              onDelete={onDeleteIki}
            />
          ))
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
