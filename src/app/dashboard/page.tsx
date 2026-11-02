"use client"

import { AppHeader } from "@/components/layout/app-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { MonthlyProgressTable } from "@/components/dashboard/monthly-progress-table"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, CalendarCheck } from "lucide-react"
import { cn } from "cn"

export default function DashboardPage() {
  return (
    <>
      <AppHeader breadcrumbs={[{ title: "Dashboard" }]} />
      <main className="flex-1 space-y-6 p-6">
        {/* Welcome Banner */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard SKP</h1>
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
              href="/bulanan"
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
      </main>
    </>
  )
}
