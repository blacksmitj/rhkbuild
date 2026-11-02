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
import { RhkIndividuItem } from "@/components/skp/rhk-individu-item"
import type { SkpLeadIntervention, SkpWorkPlan, SkpIndicator } from "@/lib/mock-data"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  FolderTree,
} from "lucide-react"

interface RhkPimpinanItemProps {
  lead: SkpLeadIntervention
  onAddWorkPlan: (leadId: string) => void
  onEditLead: (lead: SkpLeadIntervention) => void
  onDeleteLead: (leadId: string) => void
  onAddIki: (workPlanId: string) => void
  onEditWp: (workPlan: SkpWorkPlan) => void
  onDeleteWp: (workPlanId: string) => void
  onEditIki: (indicator: SkpIndicator) => void
  onDeleteIki: (indicatorId: string) => void
}

export function RhkPimpinanItem({
  lead,
  onAddWorkPlan,
  onEditLead,
  onDeleteLead,
  onAddIki,
  onEditWp,
  onDeleteWp,
  onEditIki,
  onDeleteIki,
}: RhkPimpinanItemProps) {
  const [isOpen, setIsOpen] = React.useState(true)
  const { getWorkPlansByLead, getIndicatorsByWorkPlan, organization, selectedYear } = useSkpStore()

  const workPlans = getWorkPlansByLead(lead.id)
  const totalIki = workPlans.reduce(
    (sum, wp) => sum + getIndicatorsByWorkPlan(wp.id).length,
    0
  )

  const leaderInitials =
    (organization?.unitName || organization?.name || "Pimpinan")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "KP"

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-3">
      {/* Level 1: Row RHK Pimpinan (Top Parent) */}
      <div className="group relative flex items-center justify-between rounded-xl border border-border/80 bg-card p-3.5 shadow-xs hover:border-emerald-500/50 hover:shadow-sm transition-all gap-4">
        {/* Kolom Kiri: Chevron, Icon, Title & Meta */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Chevron Collapse */}
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 text-muted-foreground hover:text-foreground rounded-md p-0"
              >
                {isOpen ? (
                  <ChevronDown className="size-4 text-foreground" />
                ) : (
                  <ChevronRight className="size-4 text-foreground" />
                )}
              </Button>
            }
          />

          {/* Emerald Icon Box (ala referensi) */}
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
            <FolderTree className="size-5" />
          </div>

          {/* Title & Metadata */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base font-bold text-foreground tracking-tight line-clamp-1">
                {lead.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="font-semibold text-foreground/80">Tahun {selectedYear}</span>
              <span>•</span>
              <span>{workPlans.length} RHK Individu</span>
              <span>•</span>
              <span>{totalIki} IKI</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pill Ringkasan, Avatar Pimpinan & Dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          <Badge
            variant="outline"
            className="hidden sm:inline-flex bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 font-semibold px-3 py-1 rounded-full text-xs"
          >
            {totalIki} IKI dalam {workPlans.length} RHK
          </Badge>

          {/* Avatar Pimpinan */}
          <Avatar size="sm" className="hidden sm:inline-flex ring-1 ring-border">
            <AvatarFallback className="text-[10px] bg-emerald-600 text-white font-bold">
              {leaderInitials}
            </AvatarFallback>
          </Avatar>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                >
                  <MoreVertical className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => onAddWorkPlan(lead.id)} className="cursor-pointer">
                <Plus className="size-3.5 mr-2 text-emerald-600" />
                Tambah RHK Individu
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditLead(lead)} className="cursor-pointer">
                <Edit2 className="size-3.5 mr-2" />
                Edit RHK Pimpinan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDeleteLead(lead.id)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="size-3.5 mr-2" />
                Hapus RHK Pimpinan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Level 2: Children (RHK Individu) with Tree Indentation Line */}
      <CollapsibleContent className="space-y-3 pl-6 md:pl-10 relative before:absolute before:left-3.5 md:before:left-5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-border/60">
        {workPlans.length === 0 ? (
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-dashed border-border/70 bg-muted/20 text-xs text-muted-foreground">
            <span>Belum ada RHK Individu untuk intervensi ini.</span>
            <Button
              size="xs"
              variant="outline"
              onClick={() => onAddWorkPlan(lead.id)}
              className="gap-1 text-xs"
            >
              <Plus className="size-3" /> Tambah RHK Individu
            </Button>
          </div>
        ) : (
          workPlans.map((wp) => (
            <RhkIndividuItem
              key={wp.id}
              workPlan={wp}
              onAddIki={onAddIki}
              onEditWp={onEditWp}
              onDeleteWp={onDeleteWp}
              onEditIki={onEditIki}
              onDeleteIki={onDeleteIki}
            />
          ))
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
