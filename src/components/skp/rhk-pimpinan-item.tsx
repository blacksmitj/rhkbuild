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
import { RhkIndividuItem } from "@/components/skp/rhk-individu-item"
import type { SkpLeadIntervention, SkpWorkPlan, SkpIndicator } from "@/lib/mock-data"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Building,
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
  const { getWorkPlansByLead, getIndicatorsByWorkPlan } = useSkpStore()

  const workPlans = getWorkPlansByLead(lead.id)
  const totalIki = workPlans.reduce(
    (sum, wp) => sum + getIndicatorsByWorkPlan(wp.id).length,
    0
  )

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-2 border-border/70 rounded-xl bg-card shadow-xs overflow-hidden"
    >
      {/* Level 1: RHK Pimpinan Header */}
      <div className="flex items-start justify-between p-4 bg-muted/40 gap-3 border-b">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground mt-0.5"
              >
                {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
              </Button>
            }
          />
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                <Building className="size-3.5" />
                RHK Pimpinan #{lead.order}
              </span>
              <Badge variant="outline" className="text-xs bg-background">
                {workPlans.length} RHK Individu
              </Badge>
              <Badge variant="outline" className="text-xs bg-background">
                {totalIki} IKI
              </Badge>
            </div>
            <h3 className="text-sm md:text-base font-semibold leading-relaxed break-words text-foreground">
              {lead.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="default"
            size="sm"
            onClick={() => onAddWorkPlan(lead.id)}
            className="h-8 text-xs flex items-center gap-1 shadow-xs"
          >
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">Tambah RHK Individu</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="size-4" />
              </Button>
            } />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditLead(lead)} className="cursor-pointer">
                <Edit2 className="size-3.5 mr-2" />
                Edit RHK Pimpinan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDeleteLead(lead.id)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="size-3.5 mr-2" />
                Hapus RHK Pimpinan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Level 2: Konten RHK Individu */}
      <CollapsibleContent className="p-4 space-y-3 bg-muted/10">
        {workPlans.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-lg bg-card">
            <p className="text-sm text-muted-foreground mb-3">
              Belum ada Rencana Kinerja Individu yang mengintervensi RHK Pimpinan ini.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddWorkPlan(lead.id)}
              className="text-xs"
            >
              <Plus className="size-3.5 mr-1" />
              Tambah RHK Individu Sekarang
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
