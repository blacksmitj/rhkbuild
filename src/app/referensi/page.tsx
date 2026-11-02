"use client"

import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { Users, ArrowRight } from "lucide-react"
import { cn } from "cn"

export default function ReferensiPlaceholderPage() {
  return (
    <>
      <AppHeader breadcrumbs={[{ title: "Referensi Rekan" }]} />
      <main className="flex-1 p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="max-w-md text-center p-6 border-dashed">
          <CardHeader className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
              <Users className="size-6" />
            </div>
            <CardTitle>Referensi Rekan Se-Instansi (Fase 3)</CardTitle>
            <CardDescription>
              Modul pencarian referensi rencana aksi lintas pegawai dalam satu instansi dan copy record baru.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ size: "sm" }), "flex items-center gap-1.5")}
            >
              Kembali ke Dashboard
              <ArrowRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
