"use client"

import * as React from "react"
import { AppHeader } from "@/components/layout/app-header"
import { SkpTree } from "@/components/skp/skp-tree"
import { ActivityLogPanel } from "@/components/audit/activity-log-panel"
import { useSkpStore } from "@/lib/stores/skp-store"
import { Badge } from "@/components/ui/badge"

export default function SkpPage() {
  const { selectedYear, currentUser, organization, periods } = useSkpStore()
  const [auditLogOpen, setAuditLogOpen] = React.useState(false)
  const currentPeriod = periods.find((p) => p.year === selectedYear)

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { title: "SKP Tahunan", href: "/skp" },
          { title: `Tahun ${selectedYear}` },
        ]}
        onOpenAuditLog={() => setAuditLogOpen(true)}
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
        </div>

        {/* Tree Component */}
        <SkpTree />

        {/* Audit Log Panel */}
        <ActivityLogPanel open={auditLogOpen} onOpenChange={setAuditLogOpen} />
      </main>
    </>
  )
}
