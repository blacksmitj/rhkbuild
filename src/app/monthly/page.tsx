"use client"

import * as React from "react"
import { AppHeader } from "@/components/layout/app-header"
import { MonthSelector } from "@/components/monthly/month-selector"
import { MonthStatusBadge } from "@/components/monthly/month-status-badge"
import { MarkDoneButton } from "@/components/monthly/mark-done-button"
import { IkiGroupCard } from "@/components/monthly/iki-group-card"
import { AddActionDialog } from "@/components/monthly/add-action-dialog"
import { MoveActionDialog } from "@/components/monthly/move-action-dialog"
import { ReferenceSheet } from "@/components/reference/reference-sheet"
import { CopySourceSheet } from "@/components/copy/copy-source-sheet"
import { ActivityLogPanel } from "@/components/audit/activity-log-panel"
import { EmptyState } from "@/components/ui/empty-state"
import { useSkpStore, type ActionPlanWithEvidence } from "@/lib/stores/skp-store"
import { MONTH_NAMES, type SkpIndicator } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CalendarCheck, Sparkles } from "lucide-react"

export default function MonthlyPage() {
  const router = useRouter()
  const {
    indicators,
    selectedMonth,
    selectedYear,
    getCurrentMonthlyPeriod,
    deleteActionPlan,
  } = useSkpStore()

  const currentMonthlyPeriod = getCurrentMonthlyPeriod()
  const monthName = MONTH_NAMES[selectedMonth - 1]

  // Action Dialog States
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [activeIndicator, setActiveIndicator] = React.useState<SkpIndicator | null>(null)
  const [editingAction, setEditingAction] = React.useState<ActionPlanWithEvidence | null>(null)

  // Move Dialog States
  const [moveDialogOpen, setMoveDialogOpen] = React.useState(false)
  const [movingAction, setMovingAction] = React.useState<ActionPlanWithEvidence | null>(null)

  // Phase 3 & 4: Reference, Copy & Audit States
  const [referenceSheetOpen, setReferenceSheetOpen] = React.useState(false)
  const [copySourceSheetOpen, setCopySourceSheetOpen] = React.useState(false)
  const [auditLogOpen, setAuditLogOpen] = React.useState(false)
  const [referenceTargetIndicator, setReferenceTargetIndicator] = React.useState<SkpIndicator | null>(null)

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
    if (confirm("Apakah Anda yakin ingin menghapus rencana aksi ini?")) {
      deleteActionPlan(id)
    }
  }

  const handleOpenReference = (indicator: SkpIndicator) => {
    setReferenceTargetIndicator(indicator)
    setReferenceSheetOpen(true)
  }

  const handleOpenCopySource = (indicator: SkpIndicator) => {
    setReferenceTargetIndicator(indicator)
    setCopySourceSheetOpen(true)
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[{ title: "Pengisian Bulanan", href: "/monthly" }]}
        onOpenAuditLog={() => setAuditLogOpen(true)}
      />

      <main className="flex-1 space-y-6 p-6 max-w-7xl mx-auto w-full">
        {/* Top Bar: Selector Bulan & Status Pengisian */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Bulan {monthName} {selectedYear}
                </h2>
                {currentMonthlyPeriod && (
                  <MonthStatusBadge status={currentMonthlyPeriod.status} />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pilih tab bulan untuk melihat dan mengisi realisasi rencana aksi serta bukti dukung bulanan.
              </p>
            </div>

            {/* Tombol Tandai Selesai Diisi / Draft (BR-08) */}
            <div className="flex items-center gap-2">
              <MarkDoneButton />
            </div>
          </div>

          {/* Month Horizontal Selector */}
          <MonthSelector />
        </div>

        {/* Info Banner Periode */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-primary/5 border border-primary/15 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary shrink-0" />
            <span className="text-foreground">
              Pengisian dilakukan per <strong>Indikator Kinerja Individu (IKI)</strong>. Setiap rencana aksi memiliki tepat 1 tautan/berkas bukti dukung.
            </span>
          </div>
          <span className="text-muted-foreground font-medium shrink-0">
            {indicators.length} IKI Aktif
          </span>
        </div>

        {/* Content: List of IKI Cards or Empty State */}
        {indicators.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="Belum Ada Indikator Kinerja (IKI)"
            description="Anda belum memiliki sasaran kinerja tahunan. Buat RHK Pimpinan, RHK Individu, dan IKI terlebih dahulu di menu SKP Tahunan."
            actionLabel="Buka SKP Tahunan"
            onAction={() => router.push("/skp")}
          />
        ) : (
          <div className="space-y-4">
            {indicators
              .sort((a, b) => a.order - b.order)
              .map((indicator) => (
                <IkiGroupCard
                  key={indicator.id}
                  indicator={indicator}
                  monthlyPeriodId={currentMonthlyPeriod?.id || ""}
                  onAddAction={handleAddAction}
                  onEditAction={handleEditAction}
                  onMoveAction={handleMoveAction}
                  onDeleteAction={handleDeleteAction}
                  onOpenReference={handleOpenReference}
                  onOpenCopySource={handleOpenCopySource}
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

        {/* Sheet 1: Referensi Rekan Se-Instansi (Slide-over Kanan) */}
        <ReferenceSheet
          open={referenceSheetOpen}
          onOpenChange={setReferenceSheetOpen}
          targetIndicator={referenceTargetIndicator}
        />

        {/* Sheet 2: Dialog Modal 3 Pilihan Salin Rencana Aksi */}
        {referenceTargetIndicator && (
          <CopySourceSheet
            open={copySourceSheetOpen}
            onOpenChange={setCopySourceSheetOpen}
            targetIndicator={referenceTargetIndicator}
            onOpenColleagueReference={() => setReferenceSheetOpen(true)}
          />
        )}

        {/* Audit Log Panel */}
        <ActivityLogPanel open={auditLogOpen} onOpenChange={setAuditLogOpen} />
      </main>
    </>
  )
}
