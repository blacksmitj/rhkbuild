"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ColleagueReference } from "@/lib/mock-data"
import { MONTH_NAMES } from "@/lib/mock-data"
import { Building, Copy, Calendar, ExternalLink, Link2 } from "lucide-react"

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
        {/* Hubungan IKI */}
        <div className="text-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-semibold">
            Terkait IKI:
          </span>
          <p className="font-medium text-foreground line-clamp-2 mt-0.5">
            {reference.indicatorName}
          </p>
        </div>

        {/* Deskripsi Aksi */}
        <div className="bg-muted/40 p-2.5 rounded-lg border text-xs">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">
            Rencana Aksi:
          </span>
          <p className="font-medium text-foreground mt-0.5 leading-relaxed">
            {reference.actionDescription}
          </p>
        </div>

        {/* Bukti Dukung */}
        <div className="text-xs flex items-center justify-between gap-2 border-t pt-2">
          <div className="flex items-center gap-1.5 text-muted-foreground truncate">
            <Link2 className="size-3 shrink-0 text-primary" />
            <span className="truncate text-[11px]" title={reference.evidenceName}>
              {reference.evidenceName}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-foreground whitespace-nowrap">
            {reference.realizationValue} {reference.unit}
          </span>
        </div>

        {/* Tombol Salin */}
        <Button
          size="sm"
          variant={isCopied ? "outline" : "default"}
          onClick={() => onCopy(reference)}
          className="w-full h-8 text-xs flex items-center justify-center gap-1.5 mt-1"
        >
          <Copy className="size-3.5" />
          <span>{isCopied ? "Telah Disalin" : "Salin ke Rencana Aksi Saya"}</span>
        </Button>
      </CardContent>
    </Card>
  )
}
