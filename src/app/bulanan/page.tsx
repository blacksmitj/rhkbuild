"use client"

import * as React from "react"
import { AppHeader } from "@/components/layout/app-header"
import { MonthSelector } from "@/components/bulanan/month-selector"
import { MonthStatusBadge } from "@/components/bulanan/month-status-badge"
import { MarkDoneButton } from "@/components/bulanan/mark-done-button"
import { IkiGroupCard } from "@/components/bulanan/iki-group-card"
import { AddActionDialog } from "@/components/bulanan/add-action-dialog"
import { MoveActionDialog } from "@/components/bulanan/move-action-dialog"
import { useSkpStore, type ActionPlanWithEvidence } from "@/lib/stores/skp-store"
import { MONTH_NAMES, type SkpIndicator } from "@/lib/mock-data"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { CalendarCheck, Info } from "lucide-react"

export default function BulananPage() {
  const {
    indicators,
    selectedMonth,
    selectedYear,
    getCurrentMonthlyPeriod,
    deleteActionPlan,
  } = useSkpStore()

  const currentMonthlyPeriod = getCurrentMonthlyPeriod()
  const monthName = MONTH_NAMES[selectedMonth - 1]

  // Dialog States
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [activeIndicator, setActiveIndicator] = React.useState<SkpIndicator | null>(null)
  const [editingAction, setEditingAction] = React.useState<ActionPlanWithEvidence | null>(null)

  const [moveDialogOpen, setMoveDialogOpen] = React.useState(false)
  const [movingAction, setMovingAction] = React.useState<ActionPlanWithEvidence | null>(null)

  // Open Handlers
  const handleAddAction = (indicator: SkpIndicator) => {
    setActiveIndicator(indicator)
    setEditingAction(null)
    setAddDialogOpen(true)
  }

  const handleEditAction = (actionPlan: ActionPlanWithEvidence, indicator: SkpIndicator) => {
    setActiveIndicator(indicator)
    setEditingAction(actionPlan)
    setAddDialogOpen(true)
  }

  const handleMoveAction = (actionPlan: ActionPlanWithEvidence) => {
    setMovingAction(actionPlan)
    setMoveDialogOpen(true)
  }

  const handleDeleteAction = (id: string) => {
    deleteActionPlan(id)
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { title: "Pengisian Bulanan", href: "/bulanan" },
          { title: `${monthName} ${selectedYear}` },
        ]}
      />
      <main className="flex-1 space-y-6 p-6">
        {/* Header Title & Month Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">
                Pengisian Bulanan — {monthName} {selectedYear}
              </h1>
              {currentMonthlyPeriod && (
                <MonthStatusBadge status={currentMonthlyPeriod.status} />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Input rencana aksi, bukti dukung, dan nilai realisasi bulan berjalan yang terhubung langsung ke IKI tahunan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <MarkDoneButton />
          </div>
        </div>

        {/* Tab Selector Bulan Jan - Des */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pilih Bulan Pengisian:
          </div>
          <MonthSelector />
        </div>

        {/* List IKI Cards (Grup Rencana Aksi per IKI) */}
        {indicators.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl bg-card p-6">
            <Info className="size-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-base mb-1">Belum Ada Struktur IKI</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Silakan buat struktur RHK dan IKI terlebih dahulu di menu SKP Tahunan sebelum mengisi rencana aksi bulanan.
            </p>
            <Link
              href="/skp"
              className={cn(buttonVariants({ size: "sm" }), "flex items-center gap-1.5")}
            >
              <CalendarCheck className="size-4" />
              Buka SKP Tahunan
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {currentMonthlyPeriod &&
              indicators.map((indicator) => (
                <IkiGroupCard
                  key={indicator.id}
                  indicator={indicator}
                  monthlyPeriodId={currentMonthlyPeriod.id}
                  onAddAction={handleAddAction}
                  onEditAction={handleEditAction}
                  onMoveAction={handleMoveAction}
                  onDeleteAction={handleDeleteAction}
                />
              ))}
          </div>
        )}

        {/* Form Dialog Tambah / Edit Rencana Aksi */}
        {activeIndicator && (
          <AddActionDialog
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            indicator={activeIndicator}
            editData={editingAction}
          />
        )}

        {/* Form Dialog Pindahkan Rencana Aksi (BR-15) */}
        <MoveActionDialog
          open={moveDialogOpen}
          onOpenChange={setMoveDialogOpen}
          actionPlan={movingAction}
        />
      </main>
    </>
  )
}
