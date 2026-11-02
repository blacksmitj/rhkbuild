"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ActionPlanWithEvidence } from "@/lib/stores/skp-store"
import { MoreVertical, Edit2, ArrowRightLeft, Trash2 } from "lucide-react"

interface ActionPlanMenuProps {
  actionPlan: ActionPlanWithEvidence
  onEdit: (actionPlan: ActionPlanWithEvidence) => void
  onMove: (actionPlan: ActionPlanWithEvidence) => void
  onDelete: (id: string) => void
}

export function ActionPlanMenu({
  actionPlan,
  onEdit,
  onMove,
  onDelete,
}: ActionPlanMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onEdit(actionPlan)}
          className="cursor-pointer"
        >
          <Edit2 className="size-3.5 mr-2" />
          Edit Rencana Aksi
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onMove(actionPlan)}
          className="cursor-pointer"
        >
          <ArrowRightLeft className="size-3.5 mr-2" />
          Pindahkan ke IKI Lain
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => onDelete(actionPlan.id)}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <Trash2 className="size-3.5 mr-2" />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

