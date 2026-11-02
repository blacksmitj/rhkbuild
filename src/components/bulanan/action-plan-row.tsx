"use client"

import type { SkpIndicator } from "@/lib/mock-data"
import type { ActionPlanWithEvidence } from "@/lib/stores/skp-store"
import { ActionPlanMenu } from "@/components/bulanan/action-plan-menu"
import { Badge } from "@/components/ui/badge"
import { Link2, FileText, ExternalLink } from "lucide-react"

interface ActionPlanRowProps {
  actionPlan: ActionPlanWithEvidence
  indicator: SkpIndicator
  onEdit: (actionPlan: ActionPlanWithEvidence) => void
  onMove: (actionPlan: ActionPlanWithEvidence) => void
  onDelete: (id: string) => void
}

export function ActionPlanRow({
  actionPlan,
  indicator,
  onEdit,
  onMove,
  onDelete,
}: ActionPlanRowProps) {
  const evidence = actionPlan.evidence

  return (
    <tr className="hover:bg-muted/40 transition-colors group">
      {/* Kolom 1: Uraian Rencana Aksi */}
      <td className="py-3.5 px-4 align-top">
        <p className="text-sm font-medium text-foreground leading-relaxed">
          {actionPlan.actionDescription}
        </p>
        {actionPlan.sourceActionId && (
          <span className="inline-block mt-1 text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
            Disalin dari referensi
          </span>
        )}
      </td>

      {/* Kolom 2: Bukti Dukung (Max 1 per BR-10) */}
      <td className="py-3.5 px-4 align-top">
        {evidence ? (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              {evidence.evidenceType === "url" ? (
                <Link2 className="size-3.5 text-primary shrink-0" />
              ) : (
                <FileText className="size-3.5 text-emerald-600 shrink-0" />
              )}
              <span className="truncate max-w-[200px]" title={evidence.evidenceName}>
                {evidence.evidenceName}
              </span>
            </div>
            {evidence.evidenceType === "url" ? (
              <a
                href={evidence.evidenceValue}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-primary hover:underline flex items-center gap-1 truncate max-w-[220px]"
              >
                <span className="truncate">{evidence.evidenceValue}</span>
                <ExternalLink className="size-3 shrink-0" />
              </a>
            ) : (
              <span className="text-[11px] text-muted-foreground font-mono truncate max-w-[220px] block">
                {evidence.evidenceValue}
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">Belum ada bukti</span>
        )}
      </td>

      {/* Kolom 3: Realisasi Bulan Ini */}
      <td className="py-3.5 px-4 align-top whitespace-nowrap">
        <div className="flex items-baseline gap-1">
          <span className="text-base font-bold text-foreground">
            {actionPlan.realizationValue}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {indicator.unit}
          </span>
        </div>
      </td>

      {/* Kolom 4: Menu Aksi */}
      <td className="py-3.5 px-4 align-top text-right">
        <ActionPlanMenu
          actionPlan={actionPlan}
          onEdit={onEdit}
          onMove={onMove}
          onDelete={onDelete}
        />
      </td>
    </tr>
  )
}

