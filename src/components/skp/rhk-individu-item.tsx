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
import { useSkpStore } from "@/lib/stores/skp-store"
import { IkiItem } from "@/components/skp/iki-item"
import type { SkpWorkPlan, SkpIndicator } from "@/lib/mock-data"
import { ChevronDown, ChevronRight, Plus, MoreVertical, Edit2, Trash2 } from "lucide-react"

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
  const { getIndicatorsByWorkPlan } = useSkpStore()
  const indicators = getIndicatorsByWorkPlan(workPlan.id)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-lg bg-card/80 shadow-xs transition-all"
    >
      {/* Header RHK Individu */}
      <div className="flex items-start justify-between p-4 gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground mt-0.5"
              >
                {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
              </Button>
            }
          />
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                RHK Individu #{workPlan.order}
              </span>
              <Badge variant="secondary" className="text-xs">
                {indicators.length} IKI
              </Badge>
            </div>
            <p className="text-sm font-semibold leading-relaxed break-words">
              {workPlan.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddIki(workPlan.id)}
            className="h-8 text-xs flex items-center gap-1"
          >
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">Tambah</span> IKI
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="size-4" />
              </Button>
            } />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditWp(workPlan)} className="cursor-pointer">
                <Edit2 className="size-3.5 mr-2" />
                Edit RHK Individu
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDeleteWp(workPlan.id)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="size-3.5 mr-2" />
                Hapus RHK Individu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Konten Daftar IKI di Bawah RHK Individu */}
      <CollapsibleContent className="px-4 pb-4 pt-1">
        <div className="space-y-2 border-t pt-3">
          {indicators.length === 0 ? (
            <div className="text-center py-6 px-4 border border-dashed rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground mb-2">
                Belum ada Indikator Kinerja Individu (IKI) untuk RHK ini.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddIki(workPlan.id)}
                className="text-xs h-7"
              >
                <Plus className="size-3 mr-1" />
                Tambah IKI Pertama
              </Button>
            </div>
          ) : (
            indicators.map((ind) => (
              <IkiItem
                key={ind.id}
                indicator={ind}
                onEdit={onEditIki}
                onDelete={onDeleteIki}
              />
            ))
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
