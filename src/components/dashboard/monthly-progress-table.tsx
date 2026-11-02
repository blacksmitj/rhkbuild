"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { useSkpStore } from "@/lib/stores/skp-store"
import { MONTH_NAMES, type MonthStatus } from "@/lib/mock-data"
import { ArrowRight, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { cn } from "cn"

export function MonthlyProgressTable() {
  const { monthlyPeriods, actionPlans, setSelectedMonth } = useSkpStore()

  const getStatusBadge = (status: MonthStatus) => {
    switch (status) {
      case "selesai":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="size-3" />
            Selesai diisi
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <Clock className="size-3" />
            Draft
          </Badge>
        )
      case "belum_diisi":
      default:
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200 flex items-center gap-1">
            <AlertCircle className="size-3" />
            Belum diisi
          </Badge>
        )
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Progres Pengisian Bulanan</CardTitle>
          <CardDescription>
            Status kelengkapan rencana aksi dan realisasi setiap akhir bulan (PRD Bagian 6)
          </CardDescription>
        </div>
        <Link
          href="/bulanan"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex items-center gap-1.5")}
        >
          Buka Pengisian Bulanan
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground text-left text-xs uppercase tracking-wider">
                <th className="py-3 px-4 font-medium">Bulan</th>
                <th className="py-3 px-4 font-medium">Jumlah Rencana Aksi</th>
                <th className="py-3 px-4 font-medium">Status Pengisian</th>
                <th className="py-3 px-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {monthlyPeriods.map((period) => {
                const count = actionPlans.filter(
                  (act) => act.monthlyPeriodId === period.id
                ).length
                const monthName = MONTH_NAMES[period.month - 1]

                return (
                  <tr key={period.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-muted text-muted-foreground w-6 h-6 rounded flex items-center justify-center font-mono">
                          {period.month.toString().padStart(2, "0")}
                        </span>
                        {monthName}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {count > 0 ? (
                        <span className="font-semibold text-foreground">{count} Rencana Aksi</span>
                      ) : (
                        <span className="italic text-muted-foreground/70">Belum ada aktivitas</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(period.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/monthly"
                        onClick={() => setSelectedMonth(period.month)}
                        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs font-medium")}
                      >
                        {period.status === "selesai" ? "Lihat Data" : "Isi Bulan Ini"}
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
