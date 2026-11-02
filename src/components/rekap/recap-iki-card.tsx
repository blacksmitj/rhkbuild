"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { IndicatorRecap } from "@/lib/utils/recap-calculator"
import { Target, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"

interface RecapIkiCardProps {
  recap: IndicatorRecap
}

export function RecapIkiCard({ recap }: RecapIkiCardProps) {
  const { indicator, annualTarget, unit, totalRealization, achievementPercentage, remainingTarget } = recap

  const isAchieved = totalRealization >= annualTarget && annualTarget > 0

  return (
    <Card className="border shadow-xs overflow-hidden">
      <CardHeader className="bg-muted/20 p-4 border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0 mt-0.5">
              <Target className="size-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                IKI #{indicator.order}
              </span>
              <h4 className="text-sm font-semibold text-foreground line-clamp-2" title={indicator.indicatorName}>
                {indicator.indicatorName}
              </h4>
            </div>
          </div>

          <Badge
            variant={isAchieved ? "default" : "outline"}
            className={isAchieved ? "bg-emerald-600 shrink-0 text-xs" : "shrink-0 text-xs"}
          >
            {isAchieved ? "Target Tercapai" : `${achievementPercentage}%`}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Metrik 3 Kolom */}
        <div className="grid grid-cols-3 gap-2 text-center border-b pb-3">
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground block">Target Tahunan</span>
            <span className="text-base font-bold text-foreground">
              {annualTarget}
            </span>
            <span className="text-[10px] text-muted-foreground block">{unit}</span>
          </div>

          <div className="space-y-0.5 border-x">
            <span className="text-[11px] text-muted-foreground block">Total Realisasi</span>
            <span className="text-base font-bold text-primary">
              {totalRealization}
            </span>
            <span className="text-[10px] text-muted-foreground block">{unit}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground block">Sisa Target</span>
            <span className="text-base font-bold text-muted-foreground">
              {remainingTarget}
            </span>
            <span className="text-[10px] text-muted-foreground block">{unit}</span>
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="size-3.5 text-primary" />
              Tingkat Capaian
            </span>
            <span className="font-bold font-mono">{achievementPercentage}%</span>
          </div>
          <Progress
            value={Math.min(100, achievementPercentage)}
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  )
}

