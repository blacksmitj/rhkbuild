import { format } from "date-fns"
import { id } from "date-fns/locale"

export interface ActivityLog {
  id: string
  action: "create" | "update" | "delete" | "move" | "copy"
  module: "rhk" | "iki" | "action_plan" | "status"
  title: string
  detail: string
  timestamp: string
}

export const initialActivityLogs: ActivityLog[] = [
  {
    id: "log-1",
    action: "create",
    module: "rhk",
    title: "Inisialisasi SKP Tahunan 2026",
    detail: "Membuat struktur awal SKP dan menetapkan RHK Pimpinan yang diintervensi",
    timestamp: "2026-01-05T09:00:00Z",
  },
  {
    id: "log-2",
    action: "create",
    module: "iki",
    title: "Penetapan 4 Indikator Kinerja Individu",
    detail: "Menetapkan target tahunan dan satuan baku (JPL, Orang, Dokumen, Laporan)",
    timestamp: "2026-01-08T10:30:00Z",
  },
  {
    id: "log-3",
    action: "create",
    module: "action_plan",
    title: "Pengisian Rencana Aksi Bulan Januari",
    detail: "Menambahkan 3 aktivitas dan melampirkan bukti dukung",
    timestamp: "2026-01-28T14:00:00Z",
  },
  {
    id: "log-4",
    action: "create",
    module: "status",
    title: "Penyelesaian Periode Januari 2026",
    detail: "Menandai status pengisian Januari menjadi Selesai Diisi",
    timestamp: "2026-01-31T15:00:00Z",
  },
  {
    id: "log-5",
    action: "create",
    module: "action_plan",
    title: "Pengisian Rencana Aksi Bulan Februari",
    detail: "Menambahkan 2 rencana aksi diklat dan sertifikat kelulusan",
    timestamp: "2026-02-26T16:00:00Z",
  },
]

export function formatLogTimestamp(isoString: string): string {
  try {
    return format(new Date(isoString), "d MMM yyyy, HH:mm", { locale: id })
  } catch {
    return isoString
  }
}

