"use client"

import * as React from "react"
import { AppHeader } from "@/components/layout/app-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { MonthlyProgressTable } from "@/components/dashboard/monthly-progress-table"
import { ActivityLogPanel } from "@/components/audit/activity-log-panel"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, CalendarCheck, Sparkles } from "lucide-react"
import { cn } from "cn"

export default function DashboardPage() {
  const [auditLogOpen, setAuditLogOpen] = React.useState(false)

  return (
    <>
      <AppHeader
        breadcrumbs={[{ title: "Dashboard" }]}
        onOpenAuditLog={() => setAuditLogOpen(true)}
      />
      <main className="flex-1 space-y-6 p-6">
        {/* Welcome Banner */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard SKP</h1>
              <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Sparkles className="size-3" />
                Sistem Terpadu
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Pantau progres tahunan, struktur RHK-IKI, dan kelengkapan pengisian bulanan Sasaran Kinerja Pegawai.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/skp"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex items-center gap-1.5")}
            >
              <CalendarCheck className="size-4" />
              Kelola Struktur SKP
            </Link>
            <Link
              href="/monthly"
              className={cn(buttonVariants({ size: "sm" }), "flex items-center gap-1.5")}
            >
              <PlusCircle className="size-4" />
              Input Rencana Aksi
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Monthly Progress */}
        <MonthlyProgressTable />

        {/* Audit Log Panel */}
        <ActivityLogPanel open={auditLogOpen} onOpenChange={setAuditLogOpen} />
      </main>
    </>
  )
}
