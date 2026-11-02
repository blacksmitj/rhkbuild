"use client"

import { AppHeader } from "@/components/layout/app-header"
import { SkpTree } from "@/components/skp/skp-tree"
import { useSkpStore } from "@/lib/stores/skp-store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarCheck, ShieldCheck } from "lucide-react"

export default function SkpPage() {
  const { selectedYear, currentUser, organization, periods } = useSkpStore()
  const currentPeriod = periods.find((p) => p.year === selectedYear)

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { title: "SKP Tahunan", href: "/skp" },
          { title: `Tahun ${selectedYear}` },
        ]}
      />
      <main className="flex-1 space-y-6 p-6">
        {/* Header Profile & Periode */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">
                Struktur SKP Tahunan {selectedYear}
              </h1>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {currentPeriod?.status === "aktif" ? "Periode Aktif" : "Arsip / Selesai"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentUser.name} ({currentUser.position}) — {organization.unitName}
            </p>
          </div>

          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-3 flex items-center gap-3 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              <span>
                Diisi sekali setahun. Validasi otomatis melindungi IKI yang sudah memiliki rencana aksi bulanan.
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Tree Component */}
        <SkpTree />
      </main>
    </>
  )
}

