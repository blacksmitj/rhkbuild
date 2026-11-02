"use client"

import * as React from "react"
import { AppHeader } from "@/components/layout/app-header"
import { RecapIkiCard } from "@/components/recap/recap-iki-card"
import { RecapMonthlyTable } from "@/components/recap/recap-monthly-table"
import { ActivityLogPanel } from "@/components/audit/activity-log-panel"
import { useSkpStore } from "@/lib/stores/skp-store"
import { calculateAnnualRecap } from "@/lib/utils/recap-calculator"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { PieChart, CalendarDays, TrendingUp, Info } from "lucide-react"
import { cn } from "cn"

export default function RecapPage() {
  const { indicators, monthlyPeriods, actionPlans, selectedYear } = useSkpStore()
  const [auditLogOpen, setAuditLogOpen] = React.useState(false)

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
          { title: "Rekapitulasi", href: "/recap" },
          { title: `Tahun ${selectedYear}` },
        ]}
        onOpenAuditLog={() => setAuditLogOpen(true)}
      />
      <main className="flex-1 space-y-6 p-6">
        {/* Header Rekap */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Rekapitulasi Capaian Tahunan {selectedYear}
            </h1>
            <p className="text-sm text-muted-foreground">
              Akumulasi otomatis seluruh rencana aksi bulanan dan evaluasi ketercapaian target IKI.
            </p>
          </div>
          <Link
            href="/monthly"
            className={cn(buttonVariants({ variant: "outline" }), "flex items-center gap-2")}
          >
            <CalendarDays className="size-4" />
            <span>Ke Pengisian Bulanan</span>
          </Link>
        </div>

        {/* Highlight Cards Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border shadow-xs bg-linear-to-br from-primary/5 via-card to-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <PieChart className="size-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Indikator (IKI)</p>
                <p className="text-2xl font-bold text-foreground">{recaps.length}</p>
                <p className="text-[11px] text-muted-foreground">Sasaran Kinerja Aktif</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-xs bg-linear-to-br from-emerald-500/5 via-card to-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
                <TrendingUp className="size-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Rata-rata Capaian</p>
                <p className="text-2xl font-bold text-foreground">{averageAchievement}%</p>
                <p className="text-[11px] text-emerald-600 font-medium">Ketercapaian Kumulatif</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-xs bg-linear-to-br from-blue-500/5 via-card to-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
                <Info className="size-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Realisasi</p>
                <p className="text-2xl font-bold text-foreground">{totalRealizationCount}</p>
                <p className="text-[11px] text-muted-foreground">Dari total target {totalTargetCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Matriks Realisasi 12 Bulan */}
        <section className="space-y-3">
          <RecapMonthlyTable recaps={recaps} />
        </section>

        {/* Kartu Detail Per IKI */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight">
              Status Per Indikator Kinerja Individu (IKI)
            </h2>
            <span className="text-xs text-muted-foreground">
              Menampilkan {recaps.length} indikator
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recaps.map((item) => (
              <RecapIkiCard key={item.indicator.id} recap={item} />
            ))}
          </div>
        </section>

        {/* Panel Audit Log */}
        <ActivityLogPanel open={auditLogOpen} onOpenChange={setAuditLogOpen} />
      </main>
    </>
  )
}

