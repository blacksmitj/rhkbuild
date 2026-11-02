"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ActionPlanRow } from "@/components/monthly/action-plan-row"
import { InlineActionInputRow } from "@/components/monthly/inline-action-input-row"
import type { SkpIndicator } from "@/lib/mock-data"
import { useSkpStore, type ActionPlanWithEvidence } from "@/lib/stores/skp-store"
import { Target, Plus, Search, Copy } from "lucide-react"

interface IkiGroupCardProps {
  indicator: SkpIndicator
  monthlyPeriodId: string
  onAddAction: (indicator: SkpIndicator) => void
  onEditAction: (actionPlan: ActionPlanWithEvidence, indicator: SkpIndicator) => void
  onMoveAction: (actionPlan: ActionPlanWithEvidence) => void
  onDeleteAction: (id: string) => void
  onOpenReference?: (indicator: SkpIndicator) => void
  onOpenCopySource?: (indicator: SkpIndicator) => void
}

export function IkiGroupCard({
  indicator,
  monthlyPeriodId,
  onAddAction,
  onEditAction,
  onMoveAction,
  onDeleteAction,
  onOpenReference,
  onOpenCopySource,
}: IkiGroupCardProps) {
  const { getActionPlansWithEvidenceByIndicator } = useSkpStore()
  const actionPlans = getActionPlansWithEvidenceByIndicator(indicator.id, monthlyPeriodId)

  return (
    <Card className="border shadow-xs overflow-hidden">
      {/* Header IKI Bersih Tanpa Rekap / Progress Bar */}
      <CardHeader className="bg-muted/30 border-b px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
              <Target className="size-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  IKI
                </span>
                <Badge variant="outline" className="text-[10px] font-normal py-0 px-1.5 h-4 capitalize">
                  {indicator.measurementType}
                </Badge>
                <span className="text-[11px] text-muted-foreground font-normal">
                  ({actionPlans.length} item rencana aksi)
                </span>
              </div>
              <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-1" title={indicator.indicatorName}>
                {indicator.indicatorName}
              </h3>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            {/* Salin dari Bulan Lalu */}
            {onOpenCopySource && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenCopySource(indicator)}
                className="h-7 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
                title="Salin rencana aksi dari bulan sebelumnya"
              >
                <Copy className="size-3" />
                <span>Salin Bulan Lalu</span>
              </Button>
            )}

            {/* Cek Referensi Teman */}
            {onOpenReference && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenReference(indicator)}
                className="h-7 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground border-primary/20 bg-primary/5 hover:bg-primary/10"
                title="Buka referensi rekan se-instansi"
              >
                <Search className="size-3 text-primary" />
                <span className="text-primary font-medium">Cek Teman</span>
              </Button>
            )}

            {/* Tambah Aksi Modal Dialog (jika butuh form lengkap) */}
            <Button
              size="sm"
              onClick={() => onAddAction(indicator)}
              variant="secondary"
              className="h-7 text-xs flex items-center gap-1"
              title="Form tambah aksi dengan upload berkas"
            >
              <Plus className="size-3" />
              <span>Dialog Form</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/20 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b">
              <tr>
                <th className="py-2 px-4 w-[46%]">Rencana Aksi (Salin Teks)</th>
                <th className="py-2 px-4 w-[30%]">Bukti Dukung (Salin Link)</th>
                <th className="py-2 px-4 w-[12%]">Realisasi</th>
                <th className="py-2 px-4 w-[12%] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {actionPlans.map((action) => (
                <ActionPlanRow
                  key={action.id}
                  actionPlan={action}
                  indicator={indicator}
                  onEdit={(act) => onEditAction(act, indicator)}
                  onMove={onMoveAction}
                  onDelete={onDeleteAction}
                />
              ))}

              {/* Input Cepat Sebaris (Excel/Notion style) */}
              <InlineActionInputRow indicator={indicator} />
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
