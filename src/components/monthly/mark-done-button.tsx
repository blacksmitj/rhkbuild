"use client"

import { Button } from "@/components/ui/button"
import { useSkpStore } from "@/lib/stores/skp-store"
import { CheckCircle2, RotateCcw } from "lucide-react"

export function MarkDoneButton() {
  const { selectedMonth, getCurrentMonthlyPeriod, setMonthStatus } = useSkpStore()
  const currentPeriod = getCurrentMonthlyPeriod()

  if (!currentPeriod) return null

  const isCompleted = currentPeriod.status === "selesai"

  const handleToggle = () => {
    if (isCompleted) {
      setMonthStatus(selectedMonth, "draft")
    } else {
      setMonthStatus(selectedMonth, "selesai")
    }
  }

  return (
    <Button
      variant={isCompleted ? "outline" : "default"}
      size="sm"
      onClick={handleToggle}
      className="flex items-center gap-1.5 h-9"
    >
      {isCompleted ? (
        <>
          <RotateCcw className="size-3.5" />
          <span>Kembalikan ke Draft</span>
        </>
      ) : (
        <>
          <CheckCircle2 className="size-4 text-white" />
          <span>Tandai Selesai Diisi</span>
        </>
      )}
    </Button>
  )
}

