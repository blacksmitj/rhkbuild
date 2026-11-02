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
  mockColleagueReferences,
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
  type ColleagueReference,
} from "@/lib/mock-data"
import { initialActivityLogs, type ActivityLog } from "@/lib/utils/activity-logs"

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
  colleagueReferences: ColleagueReference[]
  activityLogs: ActivityLog[]

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
    sourceActionId?: string | null
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

  // Phase 3: Copy Action Plans
  copyFromPreviousMonth: (targetIndicatorId: string) => { count: number; duplicates: number }
  copyFromOtherMonth: (
    targetIndicatorId: string,
    sourceMonth: number,
    sourceYear: number
  ) => { count: number; duplicates: number }
  copyFromReference: (
    targetIndicatorId: string,
    reference: ColleagueReference
  ) => { success: boolean; isDuplicate: boolean }

  // Phase 4: Audit Log helper
  logActivity: (
    action: ActivityLog["action"],
    module: ActivityLog["module"],
    title: string,
    detail: string
  ) => void

  // Helpers / Selectors
  getActivePeriod: () => SkpPeriod | undefined
  getCurrentMonthlyPeriod: () => SkpMonthlyPeriod | undefined
  getIndicatorsByWorkPlan: (workPlanId: string) => SkpIndicator[]
  getWorkPlansByLead: (leadId: string) => SkpWorkPlan[]
  getAccumulatedRealization: (indicatorId: string) => number
  getActionPlansWithEvidenceByIndicator: (indicatorId: string, monthlyPeriodId: string) => ActionPlanWithEvidence[]
  checkDuplicateAction: (indicatorId: string, monthlyPeriodId: string, description: string) => boolean
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
  colleagueReferences: mockColleagueReferences,
  activityLogs: initialActivityLogs,

  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),

  logActivity: (action, module, title, detail) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      action,
      module,
      title,
      detail,
      timestamp: new Date().toISOString(),
    }
    set((st) => ({ activityLogs: [newLog, ...st.activityLogs] }))
  },

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
    get().logActivity("create", "rhk", "Tambah RHK Pimpinan", `Uraian: "${title.substring(0, 60)}..."`)
  },

  updateLeadIntervention: (id, title) => {
    set((state) => ({
      leadInterventions: state.leadInterventions.map((l) =>
        l.id === id ? { ...l, title } : l
      ),
    }))
    get().logActivity("update", "rhk", "Perbarui RHK Pimpinan", `Uraian: "${title.substring(0, 60)}..."`)
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
        error: "RHK Pimpinan tidak dapat dihapus karena memiliki IKI dengan histori rencana aksi/realisasi (BR-17).",
      }
    }

    set({
      leadInterventions: state.leadInterventions.filter((l) => l.id !== id),
      workPlans: state.workPlans.filter((wp) => wp.leadInterventionId !== id),
      indicators: state.indicators.filter((ind) => !relatedWpIds.includes(ind.workPlanId)),
    })
    get().logActivity("delete", "rhk", "Hapus RHK Pimpinan", `Menghapus RHK Pimpinan ID ${id}`)
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
    get().logActivity("create", "rhk", "Tambah RHK Individu", `Uraian: "${title.substring(0, 60)}..."`)
  },

  updateWorkPlan: (id, title) => {
    set((state) => ({
      workPlans: state.workPlans.map((wp) =>
        wp.id === id ? { ...wp, title } : wp
      ),
    }))
    get().logActivity("update", "rhk", "Perbarui RHK Individu", `Uraian: "${title.substring(0, 60)}..."`)
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
        error: "RHK Individu tidak dapat dihapus karena memiliki IKI dengan rencana aksi (BR-17).",
      }
    }

    set({
      workPlans: state.workPlans.filter((wp) => wp.id !== id),
      indicators: state.indicators.filter((i) => i.workPlanId !== id),
    })
    get().logActivity("delete", "rhk", "Hapus RHK Individu", `Menghapus RHK Individu ID ${id}`)
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
    get().logActivity("create", "iki", "Tambah IKI Baru", `${data.indicatorName} (Target: ${data.annualTarget} ${data.unit})`)
  },

  updateIndicator: (id, data) => {
    set((state) => ({
      indicators: state.indicators.map((ind) =>
        ind.id === id ? { ...ind, ...data } : ind
      ),
    }))
    get().logActivity("update", "iki", "Perbarui IKI", `Memperbarui target/satuan IKI ID ${id}`)
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
    get().logActivity("delete", "iki", "Hapus IKI", `Menghapus IKI ID ${id}`)
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
    sourceActionId = null,
  }) => {
    const currentMonth = get().getCurrentMonthlyPeriod()
    if (!currentMonth) return

    const now = new Date().toISOString()
    const actionPlanId = `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    const evidenceId = `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`

    const newActionPlan: SkpActionPlan = {
      id: actionPlanId,
      monthlyPeriodId: currentMonth.id,
      indicatorId,
      actionDescription,
      realizationValue,
      sourceActionId,
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

    get().logActivity(
      "create",
      "action_plan",
      "Tambah Rencana Aksi",
      `"${actionDescription.substring(0, 50)}..." (Realisasi: ${realizationValue})`
    )
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

    get().logActivity(
      "update",
      "action_plan",
      "Perbarui Rencana Aksi",
      `"${actionDescription.substring(0, 50)}..." (Realisasi: ${realizationValue})`
    )
  },

  deleteActionPlan: (id) => {
    set((state) => {
      const targetAct = state.actionPlans.find((a) => a.id === id)
      const remainingActs = state.actionPlans.filter((a) => a.id !== id)
      const remainingEvidences = state.evidences.filter((ev) => ev.actionPlanId !== id)

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

    get().logActivity("delete", "action_plan", "Hapus Rencana Aksi", `Menghapus rencana aksi ID ${id}`)
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

    get().logActivity(
      "move",
      "action_plan",
      "Pindahkan Rencana Aksi",
      `Dari IKI #${sourceIndicator.order} ke IKI #${targetIndicator.order}`
    )

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

    get().logActivity(
      "update",
      "status",
      "Ubah Status Pengisian Bulanan",
      `Bulan ${month} diubah menjadi: ${status === "selesai" ? "Selesai Diisi" : "Draft"}`
    )
  },

  // Phase 3: Copy Implementations
  copyFromPreviousMonth: (targetIndicatorId) => {
    const state = get()
    const currentMonth = state.getCurrentMonthlyPeriod()
    if (!currentMonth) return { count: 0, duplicates: 0 }

    const prevMonthNum = currentMonth.month - 1
    if (prevMonthNum < 1) return { count: 0, duplicates: 0 }

    const activePeriod = state.getActivePeriod()
    if (!activePeriod) return { count: 0, duplicates: 0 }

    const prevMonthlyPeriod = state.monthlyPeriods.find(
      (mp) => mp.skpPeriodId === activePeriod.id && mp.month === prevMonthNum
    )
    if (!prevMonthlyPeriod) return { count: 0, duplicates: 0 }

    const sourceActions = state.actionPlans.filter(
      (act) => act.indicatorId === targetIndicatorId && act.monthlyPeriodId === prevMonthlyPeriod.id
    )

    if (sourceActions.length === 0) return { count: 0, duplicates: 0 }

    let addedCount = 0
    let duplicateCount = 0

    const currentActs = state.actionPlans.filter(
      (act) => act.indicatorId === targetIndicatorId && act.monthlyPeriodId === currentMonth.id
    )

    sourceActions.forEach((src) => {
      const isDuplicate = currentActs.some(
        (c) => c.actionDescription.trim().toLowerCase() === src.actionDescription.trim().toLowerCase()
      )
      if (isDuplicate) {
        duplicateCount++
      }

      const srcEvidence = state.evidences.find((ev) => ev.actionPlanId === src.id)

      state.addActionPlan({
        indicatorId: targetIndicatorId,
        actionDescription: src.actionDescription,
        realizationValue: 0,
        evidenceName: srcEvidence ? `${srcEvidence.evidenceName} (Salinan)` : "Bukti Dukung",
        evidenceType: srcEvidence?.evidenceType || "url",
        evidenceValue: srcEvidence?.evidenceValue || "",
        sourceActionId: src.id,
      })
      addedCount++
    })

    get().logActivity(
      "copy",
      "action_plan",
      "Salin dari Bulan Sebelumnya",
      `Menyalin ${addedCount} aktivitas ke bulan ${currentMonth.month}`
    )

    return { count: addedCount, duplicates: duplicateCount }
  },

  copyFromOtherMonth: (targetIndicatorId, sourceMonth, sourceYear) => {
    const state = get()
    const currentMonth = state.getCurrentMonthlyPeriod()
    if (!currentMonth) return { count: 0, duplicates: 0 }

    const sourcePeriod = state.periods.find((p) => p.year === sourceYear)
    if (!sourcePeriod) return { count: 0, duplicates: 0 }

    const sourceMonthlyPeriod = state.monthlyPeriods.find(
      (mp) => mp.skpPeriodId === sourcePeriod.id && mp.month === sourceMonth
    )
    if (!sourceMonthlyPeriod) return { count: 0, duplicates: 0 }

    const sourceActions = state.actionPlans.filter(
      (act) => act.indicatorId === targetIndicatorId && act.monthlyPeriodId === sourceMonthlyPeriod.id
    )

    if (sourceActions.length === 0) return { count: 0, duplicates: 0 }

    let addedCount = 0
    let duplicateCount = 0

    const currentActs = state.actionPlans.filter(
      (act) => act.indicatorId === targetIndicatorId && act.monthlyPeriodId === currentMonth.id
    )

    sourceActions.forEach((src) => {
      const isDuplicate = currentActs.some(
        (c) => c.actionDescription.trim().toLowerCase() === src.actionDescription.trim().toLowerCase()
      )
      if (isDuplicate) {
        duplicateCount++
      }

      const srcEvidence = state.evidences.find((ev) => ev.actionPlanId === src.id)

      state.addActionPlan({
        indicatorId: targetIndicatorId,
        actionDescription: src.actionDescription,
        realizationValue: 0,
        evidenceName: srcEvidence ? `${srcEvidence.evidenceName} (Salinan)` : "Bukti Dukung",
        evidenceType: srcEvidence?.evidenceType || "url",
        evidenceValue: srcEvidence?.evidenceValue || "",
        sourceActionId: src.id,
      })
      addedCount++
    })

    get().logActivity(
      "copy",
      "action_plan",
      "Salin dari Bulan Lain",
      `Menyalin ${addedCount} aktivitas dari bulan ${sourceMonth}/${sourceYear}`
    )

    return { count: addedCount, duplicates: duplicateCount }
  },

  copyFromReference: (targetIndicatorId, reference) => {
    const state = get()
    const currentMonth = state.getCurrentMonthlyPeriod()
    if (!currentMonth) return { success: false, isDuplicate: false }

    const currentActs = state.actionPlans.filter(
      (act) => act.indicatorId === targetIndicatorId && act.monthlyPeriodId === currentMonth.id
    )

    const isDuplicate = currentActs.some(
      (c) => c.actionDescription.trim().toLowerCase() === reference.actionDescription.trim().toLowerCase()
    )

    state.addActionPlan({
      indicatorId: targetIndicatorId,
      actionDescription: reference.actionDescription,
      realizationValue: 0,
      evidenceName: `Ref: ${reference.evidenceName}`,
      evidenceType: "url",
      evidenceValue: reference.evidenceValue,
      sourceActionId: reference.id,
    })

    get().logActivity(
      "copy",
      "action_plan",
      "Salin dari Rekan Instansi",
      `Menyalin referensi milik ${reference.ownerName}`
    )

    return { success: true, isDuplicate }
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

  checkDuplicateAction: (indicatorId, monthlyPeriodId, description) => {
    const { actionPlans } = get()
    return actionPlans.some(
      (act) =>
        act.indicatorId === indicatorId &&
        act.monthlyPeriodId === monthlyPeriodId &&
        act.actionDescription.trim().toLowerCase() === description.trim().toLowerCase()
    )
  },
}))
