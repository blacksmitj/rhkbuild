export interface Organization {
  id: string
  name: string
  unitName: string
}

export interface User {
  id: string
  name: string
  nip: string
  role: "pegawai" | "admin"
  organizationId: string
  position: string
  avatar?: string
}

export interface SkpPeriod {
  id: string
  userId: string
  year: number
  status: "draft" | "aktif" | "selesai"
  createdAt: string
  updatedAt: string
}

export interface SkpLeadIntervention {
  id: string
  periodId: string
  title: string // RHK Pimpinan yang diintervensi
  order: number
}

export interface SkpWorkPlan {
  id: string
  leadInterventionId: string
  title: string // RHK Individu
  order: number
}

export interface SkpIndicator {
  id: string
  workPlanId: string
  indicatorName: string // IKI
  annualTarget: number
  unit: string // e.g. "JPL", "Dokumen", "Kegiatan", "Laporan"
  measurementType: "kuantitatif" | "kualitatif"
  order: number
}

export type MonthStatus = "belum_diisi" | "draft" | "selesai"

export interface SkpMonthlyPeriod {
  id: string
  skpPeriodId: string
  month: number // 1 to 12
  status: MonthStatus
  completedAt?: string
}

export interface SkpActionPlan {
  id: string
  monthlyPeriodId: string
  indicatorId: string
  actionDescription: string
  realizationValue: number
  sourceActionId?: string | null
  createdAt: string
  updatedAt: string
}

export interface SkpEvidence {
  id: string
  actionPlanId: string
  evidenceName: string
  evidenceType: "url" | "file"
  evidenceValue: string // URL atau file link
  createdAt: string
}

// ---------------------------------------------------------------------------
// DATA MOCK TERPUSAT
// ---------------------------------------------------------------------------

export const mockOrganization: Organization = {
  id: "org-1",
  name: "Badan Kepegawaian dan Pengembangan SDM",
  unitName: "Bidang Pengembangan Kompetensi Aparatur",
}

export const mockCurrentUser: User = {
  id: "usr-1",
  name: "Budi Santoso, S.STP, M.Si",
  nip: "198803152010011002",
  role: "pegawai",
  organizationId: "org-1",
  position: "Analis Kebijakan Ahli Muda",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
}

export const mockColleagues: User[] = [
  {
    id: "usr-2",
    name: "Siti Rahmawati, S.Sos",
    nip: "199105202015022001",
    role: "pegawai",
    organizationId: "org-1",
    position: "Pranata Komputer Ahli Pertama",
  },
  {
    id: "usr-3",
    name: "Agus Pratama, M.Kom",
    nip: "198511122008011003",
    role: "pegawai",
    organizationId: "org-1",
    position: "Widyaiswara Ahli Muda",
  },
  {
    id: "usr-4",
    name: "Dewi Lestari, S.Psi",
    nip: "199308142019032008",
    role: "pegawai",
    organizationId: "org-1",
    position: "Pengelola Penyelenggaraan Pelatihan",
  },
]

export const mockMasterUnits = [
  "JPL",
  "Dokumen",
  "Kegiatan",
  "Laporan",
  "Orang",
  "Paket",
  "Sertifikat",
]

export const mockPeriods: SkpPeriod[] = [
  {
    id: "period-2025",
    userId: "usr-1",
    year: 2025,
    status: "selesai",
    createdAt: "2025-01-02T08:00:00Z",
    updatedAt: "2025-12-31T17:00:00Z",
  },
  {
    id: "period-2026",
    userId: "usr-1",
    year: 2026,
    status: "aktif",
    createdAt: "2026-01-05T09:00:00Z",
    updatedAt: "2026-03-31T17:00:00Z",
  },
]

export const mockLeadInterventions: SkpLeadIntervention[] = [
  {
    id: "lead-1",
    periodId: "period-2026",
    title: "Meningkatnya kualitas dan akuntabilitas penyelenggaraan pelatihan teknis dan fungsional ASN",
    order: 1,
  },
  {
    id: "lead-2",
    periodId: "period-2026",
    title: "Terwujudnya tata kelola administrasi kepegawaian yang adaptif dan berbasis teknologi informasi",
    order: 2,
  },
]

export const mockWorkPlans: SkpWorkPlan[] = [
  {
    id: "wp-1",
    leadInterventionId: "lead-1",
    title: "Pelaksanaan program pelatihan kompetensi teknis bagi aparatur pemerintah daerah",
    order: 1,
  },
  {
    id: "wp-2",
    leadInterventionId: "lead-1",
    title: "Penyusunan kurikulum dan modul ajar pelatihan berbasis blended learning",
    order: 2,
  },
  {
    id: "wp-3",
    leadInterventionId: "lead-2",
    title: "Penyusunan laporan evaluasi dampak pelatihan dan rekomendasi tindak lanjut",
    order: 1,
  },
]

export const mockIndicators: SkpIndicator[] = [
  {
    id: "iki-1",
    workPlanId: "wp-1",
    indicatorName: "Jumlah Jam Pelajaran (JPL) pelatihan kompetensi yang terlaksana sesuai kalender pelatihan",
    annualTarget: 24,
    unit: "JPL",
    measurementType: "kuantitatif",
    order: 1,
  },
  {
    id: "iki-2",
    workPlanId: "wp-1",
    indicatorName: "Jumlah peserta ASN yang menyelesaikan pelatihan teknis dan bersertifikat",
    annualTarget: 120,
    unit: "Orang",
    measurementType: "kuantitatif",
    order: 2,
  },
  {
    id: "iki-3",
    workPlanId: "wp-2",
    indicatorName: "Jumlah modul ajar dan bahan tayang materi pelatihan yang dimutakhirkan",
    annualTarget: 6,
    unit: "Dokumen",
    measurementType: "kuantitatif",
    order: 1,
  },
  {
    id: "iki-4",
    workPlanId: "wp-3",
    indicatorName: "Jumlah laporan evaluasi berkala pelaksanaan pelatihan",
    annualTarget: 4,
    unit: "Laporan",
    measurementType: "kuantitatif",
    order: 1,
  },
]

// 12 bulan 2026
export const mockMonthlyPeriods: SkpMonthlyPeriod[] = [
  { id: "m-2026-1", skpPeriodId: "period-2026", month: 1, status: "selesai", completedAt: "2026-01-31T15:00:00Z" },
  { id: "m-2026-2", skpPeriodId: "period-2026", month: 2, status: "selesai", completedAt: "2026-02-28T16:00:00Z" },
  { id: "m-2026-3", skpPeriodId: "period-2026", month: 3, status: "draft" },
  { id: "m-2026-4", skpPeriodId: "period-2026", month: 4, status: "belum_diisi" },
  { id: "m-2026-5", skpPeriodId: "period-2026", month: 5, status: "belum_diisi" },
  { id: "m-2026-6", skpPeriodId: "period-2026", month: 6, status: "belum_diisi" },
  { id: "m-2026-7", skpPeriodId: "period-2026", month: 7, status: "belum_diisi" },
  { id: "m-2026-8", skpPeriodId: "period-2026", month: 8, status: "belum_diisi" },
  { id: "m-2026-9", skpPeriodId: "period-2026", month: 9, status: "belum_diisi" },
  { id: "m-2026-10", skpPeriodId: "period-2026", month: 10, status: "belum_diisi" },
  { id: "m-2026-11", skpPeriodId: "period-2026", month: 11, status: "belum_diisi" },
  { id: "m-2026-12", skpPeriodId: "period-2026", month: 12, status: "belum_diisi" },
]

export const mockActionPlans: SkpActionPlan[] = [
  // Januari 2026
  {
    id: "act-1",
    monthlyPeriodId: "m-2026-1",
    indicatorId: "iki-1",
    actionDescription: "Melaksanakan bimbingan teknis persiapan diklat pengadaan barang dan jasa tahap I",
    realizationValue: 4,
    sourceActionId: null,
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-01-28T14:00:00Z",
  },
  {
    id: "act-2",
    monthlyPeriodId: "m-2026-1",
    indicatorId: "iki-2",
    actionDescription: "Verifikasi administrasi pendaftaran dan kelulusan peserta bimtek pengadaan",
    realizationValue: 30,
    sourceActionId: null,
    createdAt: "2026-01-22T09:00:00Z",
    updatedAt: "2026-01-28T14:00:00Z",
  },
  {
    id: "act-3",
    monthlyPeriodId: "m-2026-1",
    indicatorId: "iki-3",
    actionDescription: "Penyusunan draft modul ajar pengantar manajemen ASN",
    realizationValue: 1,
    sourceActionId: null,
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-01-29T11:00:00Z",
  },
  // Februari 2026
  {
    id: "act-4",
    monthlyPeriodId: "m-2026-2",
    indicatorId: "iki-1",
    actionDescription: "Melaksanakan pelatihan teknis penyusunan Renstra dan Renja angkatan pertama",
    realizationValue: 6,
    sourceActionId: null,
    createdAt: "2026-02-14T09:00:00Z",
    updatedAt: "2026-02-25T15:00:00Z",
  },
  {
    id: "act-5",
    monthlyPeriodId: "m-2026-2",
    indicatorId: "iki-2",
    actionDescription: "Pelaksanaan evaluasi akhir dan penerbitan sertifikat peserta pelatihan Renstra",
    realizationValue: 35,
    sourceActionId: null,
    createdAt: "2026-02-20T10:00:00Z",
    updatedAt: "2026-02-26T16:00:00Z",
  },
  // Maret 2026
  {
    id: "act-6",
    monthlyPeriodId: "m-2026-3",
    indicatorId: "iki-1",
    actionDescription: "Melaksanakan workshop penyusunan SKP dan cascading target kinerja",
    realizationValue: 4,
    sourceActionId: null,
    createdAt: "2026-03-10T11:00:00Z",
    updatedAt: "2026-03-24T12:00:00Z",
  },
  {
    id: "act-7",
    monthlyPeriodId: "m-2026-3",
    indicatorId: "iki-4",
    actionDescription: "Menyusun draft laporan evaluasi capaian pelatihan Triwulan I Tahun 2026",
    realizationValue: 1,
    sourceActionId: null,
    createdAt: "2026-03-15T09:00:00Z",
    updatedAt: "2026-03-25T10:00:00Z",
  },
]

export const mockEvidences: SkpEvidence[] = [
  {
    id: "ev-1",
    actionPlanId: "act-1",
    evidenceName: "Surat Tugas & Daftar Hadir Bimtek PBJ Tahap I",
    evidenceType: "url",
    evidenceValue: "https://drive.google.com/drive/folders/pbj-bimtek-jan2026",
    createdAt: "2026-01-28T14:00:00Z",
  },
  {
    id: "ev-2",
    actionPlanId: "act-2",
    evidenceName: "Rekapitulasi 30 Peserta Kelulusan Administrasi PBJ",
    evidenceType: "url",
    evidenceValue: "https://drive.google.com/file/d/rekap-peserta-jan2026.pdf",
    createdAt: "2026-01-28T14:00:00Z",
  },
  {
    id: "ev-3",
    actionPlanId: "act-3",
    evidenceName: "Dokumen Modul Pengantar Manajemen ASN Ver 1.0",
    evidenceType: "url",
    evidenceValue: "https://drive.google.com/file/d/modul-asn-v1.pdf",
    createdAt: "2026-01-29T11:00:00Z",
  },
  {
    id: "ev-4",
    actionPlanId: "act-4",
    evidenceName: "Jadwal dan Laporan Kegiatan Diklat Renstra 6 JPL",
    evidenceType: "url",
    evidenceValue: "https://drive.google.com/drive/folders/renstra-feb2026",
    createdAt: "2026-02-25T15:00:00Z",
  },
  {
    id: "ev-5",
    actionPlanId: "act-5",
    evidenceName: "Buku Induk Register Nomor Sertifikat Pelatihan 35 ASN",
    evidenceType: "url",
    evidenceValue: "https://drive.google.com/file/d/buku-induk-sertifikat-feb2026.pdf",
    createdAt: "2026-02-26T16:00:00Z",
  },
  {
    id: "ev-6",
    actionPlanId: "act-6",
    evidenceName: "Notulensi & Dokumentasi Foto Workshop SKP",
    evidenceType: "url",
    evidenceValue: "https://drive.google.com/drive/folders/workshop-skp-mar2026",
    createdAt: "2026-03-24T12:00:00Z",
  },
  {
    id: "ev-7",
    actionPlanId: "act-7",
    evidenceName: "Laporan Kinerja Triwulan I BKPPSDM",
    evidenceType: "url",
    evidenceValue: "https://drive.google.com/file/d/lap-tw1-2026.pdf",
    createdAt: "2026-03-25T10:00:00Z",
  },
]

// Mock data referensi dari pegawai se-instansi (PRD Bagian 4E & BR-13)
export interface ColleagueReference {
  id: string
  ownerName: string
  nip: string
  unitName: string
  periodMonth: number
  periodYear: number
  indicatorName: string
  unit: string
  actionDescription: string
  evidenceName: string
  evidenceValue: string
  realizationValue: number
}

export const mockColleagueReferences: ColleagueReference[] = [
  {
    id: "ref-1",
    ownerName: "Agus Pratama, M.Kom",
    nip: "198511122008011003",
    unitName: "Bidang Pengembangan Kompetensi Aparatur",
    periodMonth: 10,
    periodYear: 2025,
    indicatorName: "Jumlah Jam Pelajaran (JPL) pelatihan kompetensi yang terlaksana sesuai kalender pelatihan",
    unit: "JPL",
    actionDescription: "Melaksanakan pendampingan teknis dan simulasi sistem pembelajaran mandiri bagi ASN",
    evidenceName: "Dokumentasi & Berita Acara Simulasi LMS",
    evidenceValue: "https://drive.google.com/drive/folders/simulasi-lms-2025",
    realizationValue: 4,
  },
  {
    id: "ref-2",
    ownerName: "Siti Rahmawati, S.Sos",
    nip: "199105202015022001",
    unitName: "Bidang Pengembangan Kompetensi Aparatur",
    periodMonth: 11,
    periodYear: 2025,
    indicatorName: "Jumlah peserta ASN yang menyelesaikan pelatihan teknis dan bersertifikat",
    unit: "Orang",
    actionDescription: "Sinkronisasi database kelulusan diklat ke portal SIMPEG ASN",
    evidenceName: "Log Sinkronisasi dan Tanda Terima Data SIMPEG",
    evidenceValue: "https://drive.google.com/file/d/simpeg-sync-log.pdf",
    realizationValue: 45,
  },
  {
    id: "ref-3",
    ownerName: "Dewi Lestari, S.Psi",
    nip: "199308142019032008",
    unitName: "Sub Bagian Umum & Kepegawaian",
    periodMonth: 1,
    periodYear: 2026,
    indicatorName: "Jumlah modul ajar dan bahan tayang materi pelatihan yang dimutakhirkan",
    unit: "Dokumen",
    actionDescription: "Review kurikulum microlearning orientasi ASN angkatan I",
    evidenceName: "Draf Revisi Kurikulum Microlearning",
    evidenceValue: "https://drive.google.com/file/d/review-microlearning.pdf",
    realizationValue: 2,
  },
  {
    id: "ref-4",
    ownerName: "Agus Pratama, M.Kom",
    nip: "198511122008011003",
    unitName: "Bidang Pengembangan Kompetensi Aparatur",
    periodMonth: 2,
    periodYear: 2026,
    indicatorName: "Jumlah Jam Pelajaran (JPL) pelatihan kompetensi yang terlaksana sesuai kalender pelatihan",
    unit: "JPL",
    actionDescription: "Fasilitasi coaching klinis penyusunan matriks peran hasil unit kerja",
    evidenceName: "Laporan Pelaksanaan Coaching Matriks Peran Hasil",
    evidenceValue: "https://drive.google.com/drive/folders/coaching-matriks-2026",
    realizationValue: 5,
  },
  {
    id: "ref-5",
    ownerName: "Siti Rahmawati, S.Sos",
    nip: "199105202015022001",
    unitName: "Bidang Pengembangan Kompetensi Aparatur",
    periodMonth: 2,
    periodYear: 2026,
    indicatorName: "Jumlah laporan evaluasi berkala pelaksanaan pelatihan",
    unit: "Laporan",
    actionDescription: "Pengolahan kuesioner evaluasi kepuasan peserta diklat kepemimpinan",
    evidenceName: "Rekap Nilai Indeks Kepuasan Pelatihan",
    evidenceValue: "https://drive.google.com/file/d/indeks-kepuasan-diklat.pdf",
    realizationValue: 1,
  },
]

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS (MIRRORING API RESPONSES)
// ---------------------------------------------------------------------------

export const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

export function getMonthName(monthNumber: number): string {
  return MONTH_NAMES[monthNumber - 1] || `Bulan ${monthNumber}`
}

export function calculateAccumulatedRealization(
  indicatorId: string,
  actionPlans: SkpActionPlan[]
): number {
  return actionPlans
    .filter((act) => act.indicatorId === indicatorId)
    .reduce((sum, act) => sum + (Number(act.realizationValue) || 0), 0)
}

export function getActionPlansByIndicatorAndMonth(
  indicatorId: string,
  monthlyPeriodId: string,
  actionPlans: SkpActionPlan[]
): SkpActionPlan[] {
  return actionPlans.filter(
    (act) => act.indicatorId === indicatorId && act.monthlyPeriodId === monthlyPeriodId
  )
}
