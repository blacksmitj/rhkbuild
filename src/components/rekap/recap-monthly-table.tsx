"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MONTH_NAMES } from "@/lib/mock-data"
import type { IndicatorRecap } from "@/lib/utils/recap-calculator"
import { cn } from "cn"

interface RecapMonthlyTableProps {
  recaps: IndicatorRecap[]
}

export function RecapMonthlyTable({ recaps }: RecapMonthlyTableProps) {
  const shortMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]

  return (
    <Card className="border shadow-xs overflow-hidden">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Matriks Realisasi Bulanan Seluruh IKI
        </CardTitle>
        <CardDescription className="text-xs">
          Rincian nilai realisasi yang diinput setiap bulan (Januari s.d. Desember) terhadap target tahunan.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 text-left font-semibold sticky left-0 bg-muted/90 backdrop-blur-xs min-w-[200px]">
                  Indikator Kinerja (IKI)
                </th>
                <th className="py-3 px-2 text-center font-semibold">Target</th>
                {shortMonths.map((m) => (
                  <th key={m} className="py-3 px-2 text-center font-medium min-w-[42px]">
                    {m}
                  </th>
                ))}
                <th className="py-3 px-3 text-center font-semibold bg-primary/5 text-primary min-w-[60px]">
                  Total
                </th>
                <th className="py-3 px-3 text-center font-semibold min-w-[50px]">
                  %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recaps.map((item) => (
                <tr key={item.indicator.id} className="hover:bg-muted/30 transition-colors">
                  {/* Nama IKI */}
                  <td className="py-3 px-4 font-medium text-foreground sticky left-0 bg-background/95 backdrop-blur-xs">
                    <div className="line-clamp-2" title={item.indicator.indicatorName}>
                      <span className="font-bold text-primary mr-1">#{item.indicator.order}</span>
                      {item.indicator.indicatorName}
                    </div>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      Satuan: {item.unit}
                    </span>
                  </td>

                  {/* Target Tahunan */}
                  <td className="py-3 px-2 text-center font-mono font-semibold text-foreground">
                    {item.annualTarget}
                  </td>

                  {/* 12 Bulan */}
                  {item.monthlyBreakdown.map((mb) => {
                    const hasVal = mb.value > 0
                    return (
                      <td
                        key={mb.month}
                        className={cn(
                          "py-3 px-2 text-center font-mono",
                          hasVal ? "font-bold text-foreground bg-primary/5" : "text-muted-foreground/40"
                        )}
                      >
                        {hasVal ? mb.value : "-"}
                      </td>
                    )
                  })}

                  {/* Total Realisasi */}
                  <td className="py-3 px-3 text-center font-mono font-bold bg-primary/5 text-primary">
                    {item.totalRealization}
                  </td>

                  {/* Persentase Capaian */}
                  <td className="py-3 px-3 text-center font-mono font-bold">
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[11px]",
                        item.achievementPercentage >= 100
                          ? "bg-emerald-100 text-emerald-800"
                          : item.achievementPercentage > 0
                          ? "bg-blue-50 text-blue-700"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.achievementPercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

