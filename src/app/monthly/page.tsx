"use client"

import * as React from "react"
import { AppHeader } from "@/components/layout/app-header"
import { MonthSelector } from "@/components/monthly/month-selector"
import { MonthStatusBadge } from "@/components/monthly/month-status-badge"
import { MarkDoneButton } from "@/components/monthly/mark-done-button"
import { IkiGroupCard } from "@/components/monthly/iki-group-card"
import { AddActionDialog } from "@/components/monthly/add-action-dialog"
import { MoveActionDialog } from "@/components/monthly/move-action-dialog"
import { EmbeddedReferenceSheet } from "@/components/monthly/embedded-reference-sheet"
import { ActivityLogPanel } from "@/components/audit/activity-log-panel"
import { EmptyState } from "@/components/ui/empty-state"
import { useSkpStore, type ActionPlanWithEvidence } from "@/lib/stores/skp-store"
import { MONTH_NAMES, type SkpIndicator } from "@/lib/mock-data"
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

  // Reference Panel & Copy Source States
  const [referenceTargetIndicator, setReferenceTargetIndicator] = React.useState<SkpIndicator | null>(null)
  const [activeRightTab, setActiveRightTab] = React.useState<"colleague" | "copy">("colleague")
  const [auditLogOpen, setAuditLogOpen] = React.useState(false)

  // Inisialisasi indicator pertama sebagai target awal jika belum ada
  React.useEffect(() => {
    if (indicators.length > 0 && !referenceTargetIndicator) {
      setReferenceTargetIndicator(indicators[0])
    }
  }, [indicators, referenceTargetIndicator])

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

  const handleOpenReference = (indicator?: SkpIndicator) => {
    if (indicator) {
      setReferenceTargetIndicator(indicator)
    }
    setActiveRightTab("colleague")
  }

  const handleOpenCopySource = (indicator: SkpIndicator) => {
    setReferenceTargetIndicator(indicator)
    setActiveRightTab("copy")
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[{ title: "Pengisian Bulanan", href: "/monthly" }]}
        onOpenAuditLog={() => setAuditLogOpen(true)}
      />

      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-5">
        {/* Top Bar: Selector Bulan & Status Pengisian */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                Fokus input langsung, salin per item ke aplikasi utama, dan cek referensi rekan kerja.
              </p>
            </div>

            {/* Quick Action Top Bar */}
            <div className="flex items-center gap-2">
              <MarkDoneButton />
            </div>
          </div>

          {/* Month Horizontal Selector */}
          <MonthSelector />
        </div>

        {/* Info Petunjuk Cepat */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 text-primary shrink-0" />
            <span className="text-foreground">
              <strong>Tips Cepat:</strong> Ketik langsung di baris input bawah tabel untuk menambah aksi. Gunakan tombol ikon <strong>Salin</strong> di sebelah kanan teks atau link bukti untuk paste instan ke aplikasi utama.
            </span>
          </div>
          <span className="text-muted-foreground font-medium shrink-0 ml-4 hidden sm:inline">
            {indicators.length} IKI Aktif
          </span>
        </div>

        {/* Content Area: Fixed 2-Kolom Sematan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Kolom Kiri: Main List of IKI Cards (lg:col-span-7 atau 8) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-4 min-w-0 w-full">
            {indicators.length === 0 ? (
              <EmptyState
                icon={CalendarCheck}
                title="Belum Ada Indikator Kinerja (IKI)"
                description="Anda belum memiliki sasaran kinerja tahunan. Buat RHK Pimpinan, RHK Individu, dan IKI terlebih dahulu di menu SKP Tahunan."
                actionLabel="Buka SKP Tahunan"
                onAction={() => router.push("/skp")}
              />
            ) : (
              indicators
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
                ))
            )}
          </div>

          {/* Kolom Kanan: Sematan Sheet Referensi & Salin Periode (lg:col-span-5) */}
          <div className="lg:col-span-5 xl:col-span-5 w-full">
            <EmbeddedReferenceSheet
              targetIndicator={referenceTargetIndicator}
              onSelectTargetIndicator={(ind) => setReferenceTargetIndicator(ind)}
              activeTab={activeRightTab}
              onTabChange={(tab) => setActiveRightTab(tab)}
            />
          </div>
        </div>

        {/* Form Dialog Tambah / Edit Rencana Aksi (Fallback jika butuh form detail) */}
        {activeIndicator && (
          <AddActionDialog
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            indicator={activeIndicator}
            editData={editingAction}
          />
        )}

        {/* Form Dialog Pindahkan Rencana Aksi */}
        <MoveActionDialog
          open={moveDialogOpen}
          onOpenChange={setMoveDialogOpen}
          actionPlan={movingAction}
        />

        {/* Audit Log Panel */}
        <ActivityLogPanel open={auditLogOpen} onOpenChange={setAuditLogOpen} />
      </main>
    </>
  )
}
