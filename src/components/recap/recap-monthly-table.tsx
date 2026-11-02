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
                  <td className="py-3 px-4 sticky left-0 bg-background/95 backdrop-blur-xs font-medium text-foreground">
                    <div className="line-clamp-2" title={item.indicator.indicatorName}>
                      {item.indicator.indicatorName}
                    </div>
                  </td>

                  {/* Target Tahunan */}
                  <td className="py-3 px-2 text-center text-muted-foreground whitespace-nowrap">
                    {item.annualTarget} <span className="text-[10px]">{item.unit}</span>
                  </td>

                  {/* 12 Bulan Realisasi */}
                  {item.monthlyBreakdown.map((mb) => (
                    <td
                      key={mb.month}
                      className={cn(
                        "py-3 px-2 text-center whitespace-nowrap",
                        mb.value > 0 ? "font-semibold text-foreground bg-primary/5" : "text-muted-foreground/40"
                      )}
                    >
                      {mb.value > 0 ? mb.value : "-"}
                    </td>
                  ))}

                  {/* Total Capaian Realisasi */}
                  <td className="py-3 px-3 text-center font-bold text-foreground bg-primary/5 whitespace-nowrap">
                    {item.totalRealization} <span className="text-[10px] font-normal">{item.unit}</span>
                  </td>

                  {/* Persentase Capaian */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-block px-1.5 py-0.5 rounded text-[11px] font-bold",
                        item.achievementPercentage >= 100
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : item.achievementPercentage >= 50
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
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
