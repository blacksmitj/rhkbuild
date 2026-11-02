"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ColleagueReference } from "@/lib/mock-data"
import { MONTH_NAMES } from "@/lib/mock-data"
import { User, Building, Copy, Calendar, ExternalLink, Link2 } from "lucide-react"

interface ReferenceCardProps {
  reference: ColleagueReference
  targetMonthName: string
  targetYear: number
  isCopied?: boolean
  onCopy: (reference: ColleagueReference) => void
}

export function ReferenceCard({
  reference,
  targetMonthName,
  targetYear,
  isCopied,
  onCopy,
}: ReferenceCardProps) {
  const sourcePeriod = `${MONTH_NAMES[reference.periodMonth - 1]} ${reference.periodYear}`

  return (
    <Card className="border shadow-xs hover:border-primary/40 transition-all bg-card">
      <CardHeader className="p-3.5 pb-2 bg-muted/20 border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
              {reference.ownerName.charAt(0)}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-foreground truncate block">
                {reference.ownerName}
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                <Building className="size-3 shrink-0" />
                {reference.unitName}
              </span>
            </div>
          </div>

          <Badge variant="outline" className="text-[10px] shrink-0 font-medium">
            <Calendar className="size-3 mr-1 text-muted-foreground" />
            {sourcePeriod}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 space-y-3">
        {/* IKI Referensi */}
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Indikator Kinerja (IKI):
          </span>
          <p className="text-xs font-medium text-foreground line-clamp-2">
            {reference.indicatorName}
          </p>
        </div>

        {/* Uraian Rencana Aksi */}
        <div className="p-2.5 rounded-md bg-muted/40 border text-xs">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Uraian Aktivitas:
          </span>
          <p className="font-normal text-foreground leading-relaxed">
            "{reference.actionDescription}"
          </p>
        </div>

        {/* Bukti Dukung & Realisasi Sumber */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
          <div className="flex items-center gap-1.5 truncate max-w-[200px]" title={reference.evidenceName}>
            <Link2 className="size-3.5 text-primary shrink-0" />
            <span className="truncate text-[11px] font-medium">{reference.evidenceName}</span>
          </div>
          <span className="text-[11px] font-mono font-semibold text-foreground shrink-0">
            {reference.realizationValue} {reference.unit}
          </span>
        </div>

        {/* Action Button: Salin ke Periode Berjalan */}
        <Button
          size="sm"
          variant={isCopied ? "outline" : "default"}
          onClick={() => onCopy(reference)}
          disabled={isCopied}
          className="w-full text-xs h-8 flex items-center justify-center gap-1.5"
        >
          <Copy className="size-3.5" />
          <span>
            {isCopied
              ? "Tersalin ke Bulan Ini"
              : `Salin ke ${targetMonthName} ${targetYear}`}
          </span>
        </Button>
      </CardContent>
    </Card>
  )
}

