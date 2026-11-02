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
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SkpLeadIntervention, SkpWorkPlan, SkpIndicator } from "@/lib/mock-data"
import { Plus, ShieldAlert, Search, Layers, Filter } from "lucide-react"

export function SkpTree() {
  const {
    leadInterventions,
    workPlans,
    indicators,
    selectedYear,
    deleteLeadIntervention,
    deleteWorkPlan,
    deleteIndicator,
  } = useSkpStore()

  // Filter & Search State
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeTab, setActiveTab] = React.useState<"all" | "utama" | "tambahan">("all")

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

  // Filter items sesuai search dan tab
  const filteredLeads = leadInterventions.filter((lead) => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true

    const matchLead = lead.title.toLowerCase().includes(query)
    const childWps = workPlans.filter((wp) => wp.leadInterventionId === lead.id)
    const matchWp = childWps.some((wp) => wp.title.toLowerCase().includes(query))
    const matchIki = indicators.some(
      (iki) =>
        childWps.some((wp) => wp.id === iki.workPlanId) &&
        iki.indicatorName.toLowerCase().includes(query)
    )

    return matchLead || matchWp || matchIki
  })

  const totalUtama = workPlans.filter((w) => (w as any).type !== "tambahan").length
  const totalTambahan = workPlans.filter((w) => (w as any).type === "tambahan").length

  return (
    <div className="space-y-5">
      {/* Top Bar Filter & Actions ala Mockup */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
        {/* Pills / Tabs Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "all"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Semua
            <span className="text-[10px] px-1.5 py-0.2 bg-muted rounded-full">
              {leadInterventions.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("utama")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "utama"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Kinerja Utama
            <span className="text-[10px] px-1.5 py-0.2 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full">
              {totalUtama}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tambahan")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "tambahan"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Kinerja Tambahan
            <span className="text-[10px] px-1.5 py-0.2 bg-muted rounded-full">
              {totalTambahan}
            </span>
          </button>
        </div>

        {/* Search & Add Action */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari RHK atau IKI..."
              className="pl-9 h-9 text-xs rounded-xl bg-background"
            />
          </div>

          <Button
            onClick={handleAddLead}
            size="sm"
            className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 text-xs font-semibold"
          >
            <Plus className="size-4" />
            <span>Tambah RHK</span>
          </Button>
        </div>
      </div>

      {/* List RHK Pimpinan Tree Items */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-card/60">
          <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Layers className="size-6" />
          </div>
          <h3 className="font-semibold text-base mb-1">
            {searchQuery ? "Tidak ditemukan hasil pencarian" : "Belum Ada Struktur SKP"}
          </h3>
          <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">
            {searchQuery
              ? `Kata kunci "${searchQuery}" tidak cocok dengan RHK atau IKI manapun.`
              : `Mulailah dengan menambahkan RHK Pimpinan yang diintervensi pada tahun ${selectedYear}.`}
          </p>
          {!searchQuery && (
            <Button
              onClick={handleAddLead}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="size-4 mr-1.5" />
              Tambah RHK Pimpinan Pertama
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
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
