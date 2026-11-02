"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useSkpStore } from "@/lib/stores/skp-store"
import { Target, Layers, FileText, CheckCircle2 } from "lucide-react"

export function StatsCards() {
  const { leadInterventions, workPlans, indicators, actionPlans, selectedYear, periods } = useSkpStore()

  const currentPeriod = periods.find((p) => p.year === selectedYear)

  // Total Realisasi vs Total Target (pada IKI kuantitatif)
  const totalTarget = indicators.reduce((sum, ind) => sum + (ind.annualTarget || 0), 0)
  const totalRealisasi = actionPlans.reduce((sum, act) => sum + (Number(act.realizationValue) || 0), 0)
  const percentage = totalTarget > 0 ? Math.min(100, Math.round((totalRealisasi / totalTarget) * 100)) : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Kartu Status SKP */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">SKP Periode {selectedYear}</CardTitle>
          <span className="flex h-6 items-center rounded-full bg-emerald-500/10 px-2 text-xs font-medium text-emerald-600 capitalize">
            {currentPeriod?.status || "Aktif"}
          </span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{leadInterventions.length} RHK Pimpinan</div>
          <p className="text-xs text-muted-foreground mt-1">
            Mengintervensi {workPlans.length} RHK Individu pegawai
          </p>
        </CardContent>
      </Card>

      {/* Kartu Total IKI */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total IKI (Indikator)</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{indicators.length} Indikator</div>
          <p className="text-xs text-muted-foreground mt-1">
            Indikator Kinerja Individu tahun {selectedYear}
          </p>
        </CardContent>
      </Card>

      {/* Kartu Rencana Aksi */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rencana Aksi</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{actionPlans.length} Aktivitas</div>
          <p className="text-xs text-muted-foreground mt-1">
            Tercatat sepanjang tahun berjalan
          </p>
        </CardContent>
      </Card>

      {/* Kartu Akumulasi Capaian */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progres Akumulasi</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-2xl font-bold">{percentage}%</span>
            <span className="text-xs text-muted-foreground">
              {totalRealisasi} / {totalTarget}
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
        </CardContent>
      </Card>
    </div>
  )
}

