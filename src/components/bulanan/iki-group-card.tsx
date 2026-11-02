"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ActionPlanRow } from "@/components/bulanan/action-plan-row"
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
  const { getActionPlansWithEvidenceByIndicator, getAccumulatedRealization } = useSkpStore()

  const actionPlans = getActionPlansWithEvidenceByIndicator(indicator.id, monthlyPeriodId)

  // Realisasi bulan ini khusus IKI ini
  const currentMonthRealization = actionPlans.reduce(
    (sum, act) => sum + (Number(act.realizationValue) || 0),
    0
  )

  // Akumulasi total tahunan sampai saat ini
  const totalAccumulation = getAccumulatedRealization(indicator.id)
  const percentage =
    indicator.annualTarget > 0
      ? Math.min(100, Math.round((totalAccumulation / indicator.annualTarget) * 100))
      : 0

  return (
    <Card className="overflow-hidden border-2 border-border/70 shadow-xs">
      {/* Header Grup IKI */}
      <CardHeader className="bg-muted/40 p-4 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Info IKI */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
              <Target className="size-4" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  IKI #{indicator.order}
                </span>
                <Badge variant="outline" className="text-xs bg-background">
                  Target: {indicator.annualTarget} {indicator.unit}
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-foreground leading-snug break-words">
                {indicator.indicatorName}
              </h3>
            </div>
          </div>

          {/* Akumulasi & Progres Stat */}
          <div className="flex items-center gap-4 shrink-0 flex-wrap">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Realisasi Bulan Ini</div>
              <div className="text-sm font-bold text-foreground">
                {currentMonthRealization} {indicator.unit}
              </div>
            </div>

            <div className="w-32 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Akumulasi</span>
                <span className="font-semibold">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-1.5" />
              <div className="text-[10px] text-muted-foreground text-right font-mono">
                {totalAccumulation} / {indicator.annualTarget} {indicator.unit}
              </div>
            </div>

            {/* Aksi Tambah, Salin & Referensi (Phase 3) */}
            <div className="flex items-center gap-1.5 pl-2 border-l">
              {onOpenCopySource && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenCopySource(indicator)}
                  className="h-8 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  title="Salin rencana aksi dari bulan lalu, bulan lain, atau rekan"
                >
                  <Copy className="size-3.5" />
                  <span className="hidden sm:inline">Salin</span>
                </Button>
              )}

              {onOpenReference && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenReference(indicator)}
                  className="h-8 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  title="Cari referensi dari rekan se-instansi"
                >
                  <Search className="size-3.5" />
                  <span className="hidden sm:inline">Referensi</span>
                </Button>
              )}

              <Button
                size="sm"
                onClick={() => onAddAction(indicator)}
                className="h-8 text-xs flex items-center gap-1"
              >
                <Plus className="size-3.5" />
                <span>Rencana Aksi</span>
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Tabel Rencana Aksi Bulan Berjalan */}
      <CardContent className="p-0">
        {actionPlans.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <p className="text-xs text-muted-foreground mb-3">
              Belum ada rencana aksi yang dicatat untuk IKI ini pada bulan terpilih.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenCopySource?.(indicator)}
                className="text-xs h-7"
              >
                <Copy className="size-3 mr-1" />
                Salin dari Bulan Lalu / Rekan
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onAddAction(indicator)}
                className="text-xs h-7"
              >
                <Plus className="size-3 mr-1" />
                Tambah Baru
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/20 text-muted-foreground text-left text-xs uppercase tracking-wider">
                  <th className="py-2.5 px-4 font-medium w-1/2">Rencana Aksi</th>
                  <th className="py-2.5 px-4 font-medium w-1/4">Bukti Dukung</th>
                  <th className="py-2.5 px-4 font-medium">Realisasi</th>
                  <th className="py-2.5 px-4 font-medium text-right w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {actionPlans.map((act) => (
                  <ActionPlanRow
                    key={act.id}
                    actionPlan={act}
                    indicator={indicator}
                    onEdit={(a) => onEditAction(a, indicator)}
                    onMove={onMoveAction}
                    onDelete={onDeleteAction}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
