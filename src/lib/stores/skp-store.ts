import { create } from "zustand"
import {
  mockCurrentUser,
  mockOrganization,
  mockPeriods,
  mockLeadInterventions,
  mockWorkPlans,
  mockIndicators,
  mockMonthlyPeriods,
  mockActionPlans,
  mockEvidences,
  mockMasterUnits,
  type User,
  type Organization,
  type SkpPeriod,
  type SkpLeadIntervention,
  type SkpWorkPlan,
  type SkpIndicator,
  type SkpMonthlyPeriod,
  type SkpActionPlan,
  type SkpEvidence,
  type MonthStatus,
} from "@/lib/mock-data"

export interface ActionPlanWithEvidence extends SkpActionPlan {
  evidence?: SkpEvidence
}

interface SkpState {
  // Current session context
  currentUser: User
  organization: Organization
  selectedYear: number
  selectedMonth: number // 1 to 12
  masterUnits: string[]

  // Entities state
  periods: SkpPeriod[]
  leadInterventions: SkpLeadIntervention[]
  workPlans: SkpWorkPlan[]
  indicators: SkpIndicator[]
  monthlyPeriods: SkpMonthlyPeriod[]
  actionPlans: SkpActionPlan[]
  evidences: SkpEvidence[]

  // Setters
  setSelectedYear: (year: number) => void
  setSelectedMonth: (month: number) => void

  // CRUD RHK Pimpinan
  addLeadIntervention: (title: string) => void
  updateLeadIntervention: (id: string, title: string) => void
  deleteLeadIntervention: (id: string) => { success: boolean; error?: string }

  // CRUD RHK Individu
  addWorkPlan: (leadInterventionId: string, title: string) => void
  updateWorkPlan: (id: string, title: string) => void
  deleteWorkPlan: (id: string) => { success: boolean; error?: string }

  // CRUD IKI
  addIndicator: (data: Omit<SkpIndicator, "id" | "order">) => void
  updateIndicator: (id: string, data: Partial<Omit<SkpIndicator, "id">>) => void
  deleteIndicator: (id: string) => { success: boolean; error?: string }

  // CRUD Action Plan & Evidence (Phase 2)
  addActionPlan: (params: {
    indicatorId: string
    actionDescription: string
    realizationValue: number
    evidenceName: string
    evidenceType: "url" | "file"
    evidenceValue: string
  }) => void
  updateActionPlan: (params: {
    id: string
    actionDescription: string
    realizationValue: number
    evidenceName: string
    evidenceType: "url" | "file"
    evidenceValue: string
  }) => void
  deleteActionPlan: (id: string) => void
  moveActionPlan: (id: string, targetIndicatorId: string) => { success: boolean; error?: string }
  setMonthStatus: (month: number, status: MonthStatus) => void

  // Helpers / Selectors
  getActivePeriod: () => SkpPeriod | undefined
  getCurrentMonthlyPeriod: () => SkpMonthlyPeriod | undefined
  getIndicatorsByWorkPlan: (workPlanId: string) => SkpIndicator[]
  getWorkPlansByLead: (leadId: string) => SkpWorkPlan[]
  getAccumulatedRealization: (indicatorId: string) => number
  getActionPlansWithEvidenceByIndicator: (indicatorId: string, monthlyPeriodId: string) => ActionPlanWithEvidence[]
}

export const useSkpStore = create<SkpState>((set, get) => ({
  currentUser: mockCurrentUser,
  organization: mockOrganization,
  selectedYear: 2026,
  selectedMonth: 3, // Default Maret 2026
  masterUnits: mockMasterUnits,

  periods: mockPeriods,
  leadInterventions: mockLeadInterventions,
  workPlans: mockWorkPlans,
  indicators: mockIndicators,
  monthlyPeriods: mockMonthlyPeriods,
  actionPlans: mockActionPlans,
  evidences: mockEvidences,

  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),

  // RHK Pimpinan
  addLeadIntervention: (title) => {
    const activePeriod = get().getActivePeriod()
    if (!activePeriod) return
    const newId = `lead-${Date.now()}`
    const nextOrder = get().leadInterventions.length + 1
    const newLead: SkpLeadIntervention = {
      id: newId,
      periodId: activePeriod.id,
      title,
      order: nextOrder,
    }
    set((state) => ({
      leadInterventions: [...state.leadInterventions, newLead],
    }))
  },

  updateLeadIntervention: (id, title) => {
    set((state) => ({
      leadInterventions: state.leadInterventions.map((l) =>
        l.id === id ? { ...l, title } : l
      ),
    }))
  },

  deleteLeadIntervention: (id) => {
    const state = get()
    const relatedWp = state.workPlans.filter((wp) => wp.leadInterventionId === id)
    const relatedWpIds = relatedWp.map((wp) => wp.id)
    const relatedIndicators = state.indicators.filter((ind) =>
      relatedWpIds.includes(ind.workPlanId)
    )
    const relatedIndicatorIds = relatedIndicators.map((i) => i.id)

    const hasActions = state.actionPlans.some((act) =>
      relatedIndicatorIds.includes(act.indicatorId)
    )

    if (hasActions) {
      return {
        success: false,
        error: "RHK Pimpinan tidak dapat dihapus karena memiliki IKI dengan histori rencana aksi/realisasi.",
      }
    }

    set({
      leadInterventions: state.leadInterventions.filter((l) => l.id !== id),
      workPlans: state.workPlans.filter((wp) => wp.leadInterventionId !== id),
      indicators: state.indicators.filter((ind) => !relatedWpIds.includes(ind.workPlanId)),
    })
    return { success: true }
  },

  // RHK Individu
  addWorkPlan: (leadInterventionId, title) => {
    const nextOrder = get().workPlans.filter((wp) => wp.leadInterventionId === leadInterventionId).length + 1
    const newWp: SkpWorkPlan = {
      id: `wp-${Date.now()}`,
      leadInterventionId,
      title,
      order: nextOrder,
    }
    set((state) => ({
      workPlans: [...state.workPlans, newWp],
    }))
  },

  updateWorkPlan: (id, title) => {
    set((state) => ({
      workPlans: state.workPlans.map((wp) =>
        wp.id === id ? { ...wp, title } : wp
      ),
    }))
  },

  deleteWorkPlan: (id) => {
    const state = get()
    const relatedIndicators = state.indicators.filter((i) => i.workPlanId === id)
    const indicatorIds = relatedIndicators.map((i) => i.id)

    const hasActions = state.actionPlans.some((act) =>
      indicatorIds.includes(act.indicatorId)
    )

    if (hasActions) {
      return {
        success: false,
        error: "RHK Individu tidak dapat dihapus karena memiliki IKI dengan rencana aksi.",
      }
    }

    set({
      workPlans: state.workPlans.filter((wp) => wp.id !== id),
      indicators: state.indicators.filter((i) => i.workPlanId !== id),
    })
    return { success: true }
  },

  // IKI
  addIndicator: (data) => {
    const nextOrder = get().indicators.filter((i) => i.workPlanId === data.workPlanId).length + 1
    const newIndicator: SkpIndicator = {
      ...data,
      id: `iki-${Date.now()}`,
      order: nextOrder,
    }
    set((state) => ({
      indicators: [...state.indicators, newIndicator],
    }))
  },

  updateIndicator: (id, data) => {
    set((state) => ({
      indicators: state.indicators.map((ind) =>
        ind.id === id ? { ...ind, ...data } : ind
      ),
    }))
  },

  deleteIndicator: (id) => {
    const state = get()
    const hasActions = state.actionPlans.some((act) => act.indicatorId === id)
    if (hasActions) {
      return {
        success: false,
        error: "Indikator Kinerja Individu (IKI) ini telah memiliki riwayat rencana aksi dan realisasi, sehingga tidak dapat dihapus (BR-17).",
      }
    }

    set({
      indicators: state.indicators.filter((ind) => ind.id !== id),
    })
    return { success: true }
  },

  // Phase 2: Action Plans & Evidences CRUD
  addActionPlan: ({
    indicatorId,
    actionDescription,
    realizationValue,
    evidenceName,
    evidenceType,
    evidenceValue,
  }) => {
    const currentMonth = get().getCurrentMonthlyPeriod()
    if (!currentMonth) return

    const now = new Date().toISOString()
    const actionPlanId = `act-${Date.now()}`
    const evidenceId = `ev-${Date.now()}`

    const newActionPlan: SkpActionPlan = {
      id: actionPlanId,
      monthlyPeriodId: currentMonth.id,
      indicatorId,
      actionDescription,
      realizationValue,
      sourceActionId: null,
      createdAt: now,
      updatedAt: now,
    }

    const newEvidence: SkpEvidence = {
      id: evidenceId,
      actionPlanId,
      evidenceName,
      evidenceType,
      evidenceValue,
      createdAt: now,
    }

    set((state) => ({
      actionPlans: [newActionPlan, ...state.actionPlans],
      evidences: [newEvidence, ...state.evidences],
      monthlyPeriods: state.monthlyPeriods.map((mp) =>
        mp.id === currentMonth.id && mp.status === "belum_diisi"
          ? { ...mp, status: "draft" }
          : mp
      ),
    }))
  },

  updateActionPlan: ({
    id,
    actionDescription,
    realizationValue,
    evidenceName,
    evidenceType,
    evidenceValue,
  }) => {
    const now = new Date().toISOString()
    set((state) => {
      const updatedActionPlans = state.actionPlans.map((act) =>
        act.id === id
          ? { ...act, actionDescription, realizationValue, updatedAt: now }
          : act
      )

      const existingEvidence = state.evidences.find((ev) => ev.actionPlanId === id)
      let updatedEvidences: SkpEvidence[]

      if (existingEvidence) {
        updatedEvidences = state.evidences.map((ev) =>
          ev.actionPlanId === id
            ? { ...ev, evidenceName, evidenceType, evidenceValue }
            : ev
        )
      } else {
        const newEvidence: SkpEvidence = {
          id: `ev-${Date.now()}`,
          actionPlanId: id,
          evidenceName,
          evidenceType,
          evidenceValue,
          createdAt: now,
        }
        updatedEvidences = [...state.evidences, newEvidence]
      }

      return {
        actionPlans: updatedActionPlans,
        evidences: updatedEvidences,
      }
    })
  },

  deleteActionPlan: (id) => {
    set((state) => {
      const targetAct = state.actionPlans.find((a) => a.id === id)
      const remainingActs = state.actionPlans.filter((a) => a.id !== id)
      const remainingEvidences = state.evidences.filter((ev) => ev.actionPlanId !== id)

      // Cek apakah bulan tersebut masih ada rencana aksi tersisa
      let updatedMonthlyPeriods = state.monthlyPeriods
      if (targetAct) {
        const actsInMonth = remainingActs.filter(
          (a) => a.monthlyPeriodId === targetAct.monthlyPeriodId
        )
        if (actsInMonth.length === 0) {
          updatedMonthlyPeriods = state.monthlyPeriods.map((mp) =>
            mp.id === targetAct.monthlyPeriodId ? { ...mp, status: "belum_diisi" } : mp
          )
        }
      }

      return {
        actionPlans: remainingActs,
        evidences: remainingEvidences,
        monthlyPeriods: updatedMonthlyPeriods,
      }
    })
  },

  moveActionPlan: (id, targetIndicatorId) => {
    const state = get()
    const targetAct = state.actionPlans.find((a) => a.id === id)
    if (!targetAct) return { success: false, error: "Rencana aksi tidak ditemukan." }

    const sourceIndicator = state.indicators.find((ind) => ind.id === targetAct.indicatorId)
    const targetIndicator = state.indicators.find((ind) => ind.id === targetIndicatorId)

    if (!sourceIndicator || !targetIndicator) {
      return { success: false, error: "Indikator asal atau tujuan tidak valid." }
    }

    // BR-15 Validation: Validasi kesesuaian satuan
    if (sourceIndicator.unit.toLowerCase() !== targetIndicator.unit.toLowerCase()) {
      return {
        success: false,
        error: `Satuan indikator tidak cocok! Asal: "${sourceIndicator.unit}", Tujuan: "${targetIndicator.unit}". Konversi otomatis dilarang (BR-15). Silakan sesuaikan atau pilih IKI dengan satuan yang sama.`,
      }
    }

    const now = new Date().toISOString()
    set((st) => ({
      actionPlans: st.actionPlans.map((a) =>
        a.id === id ? { ...a, indicatorId: targetIndicatorId, updatedAt: now } : a
      ),
    }))

    return { success: true }
  },

  setMonthStatus: (month, status) => {
    const activePeriod = get().getActivePeriod()
    if (!activePeriod) return
    const completedAt = status === "selesai" ? new Date().toISOString() : undefined

    set((state) => ({
      monthlyPeriods: state.monthlyPeriods.map((mp) =>
        mp.skpPeriodId === activePeriod.id && mp.month === month
          ? { ...mp, status, completedAt }
          : mp
      ),
    }))
  },

  // Helpers
  getActivePeriod: () => {
    const { periods, selectedYear } = get()
    return periods.find((p) => p.year === selectedYear)
  },

  getCurrentMonthlyPeriod: () => {
    const activePeriod = get().getActivePeriod()
    if (!activePeriod) return undefined
    const { monthlyPeriods, selectedMonth } = get()
    return monthlyPeriods.find(
      (mp) => mp.skpPeriodId === activePeriod.id && mp.month === selectedMonth
    )
  },

  getWorkPlansByLead: (leadId) => {
    return get().workPlans.filter((wp) => wp.leadInterventionId === leadId)
  },

  getIndicatorsByWorkPlan: (workPlanId) => {
    return get().indicators.filter((ind) => ind.workPlanId === workPlanId)
  },

  getAccumulatedRealization: (indicatorId) => {
    return get()
      .actionPlans.filter((act) => act.indicatorId === indicatorId)
      .reduce((sum, act) => sum + (Number(act.realizationValue) || 0), 0)
  },

  getActionPlansWithEvidenceByIndicator: (indicatorId, monthlyPeriodId) => {
    const { actionPlans, evidences } = get()
    return actionPlans
      .filter((act) => act.indicatorId === indicatorId && act.monthlyPeriodId === monthlyPeriodId)
      .map((act) => ({
        ...act,
        evidence: evidences.find((ev) => ev.actionPlanId === act.id),
      }))
  },
}))
