"use client"

import * as React from "react"
import { useSkpStore } from "@/lib/stores/skp-store"
import { RhkPimpinanItem } from "@/components/skp/rhk-pimpinan-item"
import { AddRhkPimpinanDialog } from "@/components/skp/add-rhk-pimpinan-dialog"
import { AddRhkIndividuDialog } from "@/components/skp/add-rhk-individu-dialog"
import { AddIkiDialog } from "@/components/skp/add-iki-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { SkpLeadIntervention, SkpWorkPlan, SkpIndicator } from "@/lib/mock-data"
import { Plus, ShieldAlert } from "lucide-react"

export function SkpTree() {
  const {
    leadInterventions,
    selectedYear,
    deleteLeadIntervention,
    deleteWorkPlan,
    deleteIndicator,
  } = useSkpStore()

  // Modal Dialog States
  const [rhkPimpinanOpen, setRhkPimpinanOpen] = React.useState(false)
  const [editingLead, setEditingLead] = React.useState<SkpLeadIntervention | null>(null)

  const [rhkIndividuOpen, setRhkIndividuOpen] = React.useState(false)
  const [targetLeadId, setTargetLeadId] = React.useState<string | undefined>()
  const [editingWp, setEditingWp] = React.useState<SkpWorkPlan | null>(null)

  const [ikiOpen, setIkiOpen] = React.useState(false)
  const [targetWorkPlanId, setTargetWorkPlanId] = React.useState<string | undefined>()
  const [editingIki, setEditingIki] = React.useState<SkpIndicator | null>(null)

  // Error Alert Dialog State (untuk guard BR-17)
  const [alertError, setAlertError] = React.useState<string | null>(null)

  // Handlers RHK Pimpinan
  const handleAddLead = () => {
    setEditingLead(null)
    setRhkPimpinanOpen(true)
  }

  const handleEditLead = (lead: SkpLeadIntervention) => {
    setEditingLead(lead)
    setRhkPimpinanOpen(true)
  }

  const handleDeleteLead = (id: string) => {
    const res = deleteLeadIntervention(id)
    if (!res.success && res.error) {
      setAlertError(res.error)
    }
  }

  // Handlers RHK Individu
  const handleAddWorkPlan = (leadId: string) => {
    setTargetLeadId(leadId)
    setEditingWp(null)
    setRhkIndividuOpen(true)
  }

  const handleEditWorkPlan = (wp: SkpWorkPlan) => {
    setEditingWp(wp)
    setRhkIndividuOpen(true)
  }

  const handleDeleteWorkPlan = (id: string) => {
    const res = deleteWorkPlan(id)
    if (!res.success && res.error) {
      setAlertError(res.error)
    }
  }

  // Handlers IKI
  const handleAddIki = (workPlanId: string) => {
    setTargetWorkPlanId(workPlanId)
    setEditingIki(null)
    setIkiOpen(true)
  }

  const handleEditIki = (indicator: SkpIndicator) => {
    setEditingIki(indicator)
    setIkiOpen(true)
  }

  const handleDeleteIki = (id: string) => {
    const res = deleteIndicator(id)
    if (!res.success && res.error) {
      setAlertError(res.error)
    }
  }

  return (
    <div className="space-y-4">
      {/* Action Header Tree */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Hierarki Kinerja Pegawai Tahun {selectedYear}
          </h2>
          <p className="text-xs text-muted-foreground">
            Struktur RHK Pimpinan yang diintervensi → RHK Individu → Indikator Kinerja Individu (IKI).
          </p>
        </div>
        <Button onClick={handleAddLead} size="sm" className="flex items-center gap-1.5">
          <Plus className="size-4" />
          Tambah RHK Pimpinan
        </Button>
      </div>

      {/* List RHK Pimpinan */}
      {leadInterventions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-card">
          <h3 className="font-semibold text-base mb-1">Belum Ada Struktur SKP</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Mulailah dengan menambahkan RHK Pimpinan yang akan diintervensi untuk periode tahun {selectedYear}.
          </p>
          <Button onClick={handleAddLead} size="sm">
            <Plus className="size-4 mr-1.5" />
            Tambah RHK Pimpinan Pertama
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {leadInterventions.map((lead) => (
            <RhkPimpinanItem
              key={lead.id}
              lead={lead}
              onAddWorkPlan={handleAddWorkPlan}
              onEditLead={handleEditLead}
              onDeleteLead={handleDeleteLead}
              onAddIki={handleAddIki}
              onEditWp={handleEditWorkPlan}
              onDeleteWp={handleDeleteWorkPlan}
              onEditIki={handleEditIki}
              onDeleteIki={handleDeleteIki}
            />
          ))}
        </div>
      )}

      {/* Dialog Forms */}
      <AddRhkPimpinanDialog
        open={rhkPimpinanOpen}
        onOpenChange={setRhkPimpinanOpen}
        editData={editingLead}
      />

      <AddRhkIndividuDialog
        open={rhkIndividuOpen}
        onOpenChange={setRhkIndividuOpen}
        defaultLeadInterventionId={targetLeadId}
        editData={editingWp}
      />

      <AddIkiDialog
        open={ikiOpen}
        onOpenChange={setIkiOpen}
        defaultWorkPlanId={targetWorkPlanId}
        editData={editingIki}
      />

      {/* Alert Error Dialog (Guard BR-17) */}
      <AlertDialog open={!!alertError} onOpenChange={(open) => !open && setAlertError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-1">
              <ShieldAlert className="size-5" />
              <AlertDialogTitle>Perlindungan Histori Kinerja</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm leading-relaxed text-foreground">
              {alertError}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertError(null)}>
              Mengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

