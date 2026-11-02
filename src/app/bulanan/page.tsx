"use client"

import * as React from "react"
import { AppHeader } from "@/components/layout/app-header"
import { MonthSelector } from "@/components/bulanan/month-selector"
import { MonthStatusBadge } from "@/components/bulanan/month-status-badge"
import { MarkDoneButton } from "@/components/bulanan/mark-done-button"
import { IkiGroupCard } from "@/components/bulanan/iki-group-card"
import { AddActionDialog } from "@/components/bulanan/add-action-dialog"
import { MoveActionDialog } from "@/components/bulanan/move-action-dialog"
import { ReferenceSheet } from "@/components/referensi/reference-sheet"
import { CopySourceSheet } from "@/components/copy/copy-source-sheet"
import { ActivityLogPanel } from "@/components/audit/activity-log-panel"
import { EmptyState } from "@/components/ui/empty-state"
import { useSkpStore, type ActionPlanWithEvidence } from "@/lib/stores/skp-store"
import { MONTH_NAMES, type SkpIndicator } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CalendarCheck, Sparkles } from "lucide-react"

export default function BulananPage() {
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
    deleteActionPlan(id)
  }

  // Phase 3 Trigger Handlers
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
        breadcrumbs={[
          { title: "Pengisian Bulanan", href: "/bulanan" },
          { title: `${monthName} ${selectedYear}` },
        ]}
        onOpenAuditLog={() => setAuditLogOpen(true)}
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
              Input rencana aksi, bukti dukung, dan realisasi. Anda juga dapat menyalin aktivitas dari bulan lalu atau referensi rekan se-instansi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setReferenceTargetIndicator(indicators[0] || null)
                setReferenceSheetOpen(true)
              }}
              className="flex items-center gap-1.5 h-9"
            >
              <Sparkles className="size-4 text-primary" />
              <span>Cari Referensi Instansi</span>
            </Button>
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
          <EmptyState
            icon={CalendarCheck}
            title="Belum Ada Struktur IKI"
            description="Silakan buat struktur RHK dan IKI terlebih dahulu di menu SKP Tahunan sebelum mengisi rencana aksi bulanan."
            actionLabel="Buka SKP Tahunan"
            onAction={() => router.push("/skp")}
            actionIcon={CalendarCheck}
          />
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
