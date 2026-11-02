"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ActionPlanRow } from "@/components/monthly/action-plan-row"
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
    <Card className="border shadow-xs overflow-hidden">
      {/* Header Grup IKI */}
      <CardHeader className="bg-muted/30 border-b px-5 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 mt-0.5">
              <Target className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Indikator Kinerja Individu
                </span>
                <Badge variant="outline" className="text-[11px] font-normal capitalize">
                  {indicator.measurementType}
                </Badge>
              </div>
              <h3 className="font-semibold text-foreground text-sm mt-0.5 leading-snug">
                {indicator.indicatorName}
              </h3>
            </div>
          </div>

          {/* Quick Metrics Header */}
          <div className="flex items-center gap-6 shrink-0 text-right self-end md:self-center">
            <div>
              <p className="text-[11px] text-muted-foreground">Realisasi Bulan Ini</p>
              <p className="text-sm font-bold text-foreground">
                {currentMonthRealization} {indicator.unit}
              </p>
            </div>
            <div className="border-l pl-4">
              <p className="text-[11px] text-muted-foreground">Akumulasi / Target</p>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-foreground">{totalAccumulation}</span>
                <span className="text-xs text-muted-foreground">/ {indicator.annualTarget} {indicator.unit}</span>
                <span className="text-[11px] font-medium text-emerald-600 ml-1">
                  ({percentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar visual */}
        <div className="mt-3 w-full">
          <Progress value={percentage} className="h-1.5" />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Toolbar & Action Buttons */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-muted/10 border-b gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium">
              {actionPlans.length} Rencana Aksi terdaftar
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Salin dari Bulan Lalu / Bulan Lain */}
            {onOpenCopySource && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenCopySource(indicator)}
                className="h-8 text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Copy className="size-3.5" />
                <span>Salin dari Bulan Lalu</span>
              </Button>
            )}

            {/* Referensi Rekan */}
            {onOpenReference && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenReference(indicator)}
                className="h-8 text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Search className="size-3.5" />
                <span>Cari Referensi</span>
              </Button>
            )}

            {/* Tambah Aksi Baru */}
            <Button
              size="sm"
              onClick={() => onAddAction(indicator)}
              className="h-8 text-xs flex items-center gap-1.5"
            >
              <Plus className="size-3.5" />
              <span>Tambah Aksi</span>
            </Button>
          </div>
        </div>

        {/* Table of Action Plans */}
        {actionPlans.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p className="text-xs">Belum ada rencana aksi untuk indikator ini pada bulan berjalan.</p>
            <Button
              variant="link"
              size="sm"
              onClick={() => onAddAction(indicator)}
              className="text-xs mt-1 text-primary"
            >
              + Tambah Rencana Aksi Pertama
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b">
                <tr>
                  <th className="py-2.5 px-4 w-[45%]">Rencana Aksi</th>
                  <th className="py-2.5 px-4 w-[30%]">Bukti Dukung</th>
                  <th className="py-2.5 px-4 w-[15%]">Realisasi</th>
                  <th className="py-2.5 px-4 w-[10%] text-right">Aksi</th>
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
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

