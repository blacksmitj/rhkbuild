"use client"

import { AppHeader } from "@/components/layout/app-header"
import { RecapIkiCard } from "@/components/rekap/recap-iki-card"
import { RecapMonthlyTable } from "@/components/rekap/recap-monthly-table"
import { useSkpStore } from "@/lib/stores/skp-store"
import { calculateAnnualRecap } from "@/lib/utils/recap-calculator"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { PieChart, CalendarDays, TrendingUp, Info } from "lucide-react"

export default function RekapPage() {
  const { indicators, monthlyPeriods, actionPlans, selectedYear } = useSkpStore()

  const recaps = calculateAnnualRecap(indicators, monthlyPeriods, actionPlans)

  const totalTargetCount = recaps.reduce((acc, r) => acc + r.annualTarget, 0)
  const totalRealizationCount = recaps.reduce((acc, r) => acc + r.totalRealization, 0)
  const averageAchievement =
    recaps.length > 0
      ? Math.round(
          recaps.reduce((acc, r) => acc + r.achievementPercentage, 0) / recaps.length
        )
      : 0

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { title: "Rekapitulasi", href: "/rekap" },
          { title: `Tahun ${selectedYear}` },
        ]}
      />
      <main className="flex-1 space-y-6 p-6">
        {/* Header Rekap */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Rekapitulasi Capaian Tahunan {selectedYear}
            </h1>
            <p className="text-sm text-muted-foreground">
              Akumulasi otomatis seluruh rencana aksi bulanan dan evaluasi ketercapaian target IKI (PRD Bagian 5).
            </p>
          </div>

          <Link
            href="/bulanan"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex items-center gap-1.5")}
          >
            <CalendarDays className="size-4" />
            Buka Pengisian Bulanan
          </Link>
        </div>

        {/* Ringkasan Makro */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <PieChart className="size-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Rata-Rata Capaian IKI</span>
                <span className="text-2xl font-bold text-foreground">{averageAchievement}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                <TrendingUp className="size-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Total Realisasi Terinput</span>
                <span className="text-2xl font-bold text-foreground">{totalRealizationCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700">
                <Info className="size-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Jumlah Indikator (IKI)</span>
                <span className="text-2xl font-bold text-foreground">{indicators.length} IKI</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid Kartu Per IKI (PRD Bagian 5: Realisasi, Target, %, Sisa) */}
        <div>
          <h2 className="text-base font-semibold mb-3">Rincian Capaian Indikator Kinerja Individu</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {recaps.map((recap) => (
              <RecapIkiCard key={recap.indicator.id} recap={recap} />
            ))}
          </div>
        </div>

        {/* Tabel Matriks Bulanan 12 Bulan */}
        <RecapMonthlyTable recaps={recaps} />
      </main>
    </>
  )
}
