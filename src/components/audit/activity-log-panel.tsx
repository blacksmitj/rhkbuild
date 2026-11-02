"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useSkpStore } from "@/lib/stores/skp-store"
import { formatLogTimestamp, type ActivityLog } from "@/lib/utils/activity-logs"
import { History, PlusCircle, Edit3, Trash2, ArrowRightLeft, Copy, CheckCircle2 } from "lucide-react"

interface ActivityLogPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActivityLogPanel({ open, onOpenChange }: ActivityLogPanelProps) {
  const { activityLogs } = useSkpStore()

  const getActionIcon = (action: ActivityLog["action"]) => {
    switch (action) {
      case "create":
        return <PlusCircle className="size-4 text-emerald-600" />
      case "update":
        return <Edit3 className="size-4 text-blue-600" />
      case "delete":
        return <Trash2 className="size-4 text-rose-600" />
      case "move":
        return <ArrowRightLeft className="size-4 text-amber-600" />
      case "copy":
        return <Copy className="size-4 text-indigo-600" />
      default:
        return <CheckCircle2 className="size-4 text-primary" />
    }
  }

  const getModuleBadge = (module: ActivityLog["module"]) => {
    switch (module) {
      case "rhk":
        return <Badge variant="outline" className="text-[10px]">RHK</Badge>
      case "iki":
        return <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">IKI</Badge>
      case "action_plan":
        return <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">Aktivitas</Badge>
      case "status":
        return <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-700">Status</Badge>
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-[480px] w-full flex flex-col p-0">
        <SheetHeader className="p-4 border-b bg-muted/20">
          <div className="flex items-center gap-2 text-primary mb-1">
            <History className="size-5" />
            <SheetTitle className="text-base font-bold">
              Histori Aktivitas & Audit Log
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs">
            Catatan kronologis perubahan data penting kinerja sesuai aturan audit (PRD BR-18).
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activityLogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-xs">
              Belum ada aktivitas tercatat.
            </div>
          ) : (
            activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                      {getActionIcon(log.action)}
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {log.title}
                    </span>
                  </div>
                  {getModuleBadge(log.module)}
                </div>

                <p className="text-xs text-muted-foreground pl-9 leading-relaxed">
                  {log.detail}
                </p>

                <div className="pl-9 text-[10px] text-muted-foreground font-mono">
                  {formatLogTimestamp(log.timestamp)}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

