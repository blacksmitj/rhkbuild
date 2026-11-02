"use client"

import type { SkpIndicator } from "@/lib/mock-data"
import type { ActionPlanWithEvidence } from "@/lib/stores/skp-store"
import { ActionPlanMenu } from "@/components/monthly/action-plan-menu"
import { CopyItemButton } from "@/components/monthly/copy-item-button"
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

  // Format teks lengkap untuk paste berurutan/komplit
  const fullItemText = `${actionPlan.actionDescription} | Bukti: ${
    evidence?.evidenceValue || "-"
  } | Realisasi: ${actionPlan.realizationValue} ${indicator.unit}`

  return (
    <tr className="hover:bg-muted/40 transition-colors group">
      {/* Kolom 1: Uraian Rencana Aksi + Tombol 1-klik Salin Teks */}
      <td className="py-3 px-4 align-top">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {actionPlan.actionDescription}
            </p>
            {actionPlan.sourceActionId && (
              <span className="inline-block mt-1 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-normal">
                Disalin dari referensi
              </span>
            )}
          </div>
          <div className="shrink-0 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <CopyItemButton
              textToCopy={actionPlan.actionDescription}
              tooltip="Salin teks uraian aksi"
              size="xs"
              label="Salin Aksi"
            />
          </div>
        </div>
      </td>

      {/* Kolom 2: Bukti Dukung (Max 1) + Tombol 1-klik Salin Link */}
      <td className="py-3 px-4 align-top">
        {evidence ? (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              {evidence.evidenceType === "url" ? (
                <Link2 className="size-3.5 text-primary shrink-0" />
              ) : (
                <FileText className="size-3.5 text-emerald-600 shrink-0" />
              )}
              <span className="truncate max-w-[180px]" title={evidence.evidenceName}>
                {evidence.evidenceName}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {evidence.evidenceType === "url" ? (
                <a
                  href={evidence.evidenceValue}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-primary hover:underline flex items-center gap-1 truncate max-w-[170px]"
                >
                  <span className="truncate">{evidence.evidenceValue}</span>
                  <ExternalLink className="size-2.5 shrink-0" />
                </a>
              ) : (
                <p className="text-[11px] text-muted-foreground truncate max-w-[170px]">
                  File: {evidence.evidenceValue}
                </p>
              )}

              {/* Tombol Copy Link Bukti Langsung */}
              {evidence.evidenceValue && evidence.evidenceValue !== "-" && (
                <CopyItemButton
                  textToCopy={evidence.evidenceValue}
                  tooltip="Salin link / nilai bukti"
                  size="icon"
                  className="size-6 text-muted-foreground hover:text-primary"
                />
              )}
            </div>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">Tidak ada bukti</span>
        )}
      </td>

      {/* Kolom 3: Realisasi Nilai */}
      <td className="py-3 px-4 align-top whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-foreground">
            {actionPlan.realizationValue}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              {indicator.unit}
            </span>
          </div>
          <CopyItemButton
            textToCopy={String(actionPlan.realizationValue)}
            tooltip="Salin nilai realisasi"
            size="icon"
            className="size-5 text-muted-foreground"
          />
        </div>
      </td>

      {/* Kolom 4: Aksi & Menu */}
      <td className="py-3 px-4 align-top text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <CopyItemButton
            textToCopy={fullItemText}
            tooltip="Salin lengkap (Aksi, Bukti & Realisasi)"
            size="icon"
            className="size-7"
          />
          <ActionPlanMenu
            actionPlan={actionPlan}
            onEdit={onEdit}
            onMove={onMove}
            onDelete={onDelete}
          />
        </div>
      </td>
    </tr>
  )
}
