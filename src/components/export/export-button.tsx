"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileSpreadsheet, FileText, Check } from "lucide-react"

interface ExportButtonProps {
  title?: string
  variant?: "outline" | "default" | "secondary"
  size?: "default" | "sm" | "xs"
}

export function ExportButton({
  title = "Export Laporan",
  variant = "outline",
  size = "sm",
}: ExportButtonProps) {
  const [downloading, setDownloading] = React.useState<string | null>(null)

  const handleExport = (type: "excel" | "pdf") => {
    setDownloading(type)

    // Simulasi pembuatan dan download file laporan
    setTimeout(() => {
      const fileName =
        type === "excel"
          ? "Rekapitulasi_SKP_Tahunan_2026.xlsx"
          : "Capaian_SKP_Bulanan_2026.pdf"

      const blob = new Blob(
        [
          `Laporan Sasaran Kinerja Pegawai (SKP) Tahun 2026\nDiekspor pada: ${new Date().toLocaleString()}\nFormat: ${type.toUpperCase()}`,
        ],
        { type: "text/plain" }
      )
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDownloading(null)
    }, 800)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant={variant}
            size={size}
            className="flex items-center gap-1.5 h-8 text-xs"
            disabled={!!downloading}
          >
            <Download className="size-3.5" />
            <span>{downloading ? "Mengunduh..." : title}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="text-xs">
        <DropdownMenuItem
          onClick={() => handleExport("excel")}
          className="cursor-pointer flex items-center gap-2"
        >
          <FileSpreadsheet className="size-4 text-emerald-600" />
          <span>Export Excel (.xlsx)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          className="cursor-pointer flex items-center gap-2"
        >
          <FileText className="size-4 text-rose-600" />
          <span>Export PDF (.pdf)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

