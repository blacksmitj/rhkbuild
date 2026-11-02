"use client"

import { useSkpStore } from "@/lib/stores/skp-store"
import { MONTH_NAMES } from "@/lib/mock-data"
import { cn } from "cn"

export function MonthSelector() {
  const { selectedMonth, setSelectedMonth, monthlyPeriods } = useSkpStore()

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center gap-1.5 min-w-[700px] border p-1 rounded-xl bg-card">
        {MONTH_NAMES.map((name, idx) => {
          const monthNum = idx + 1
          const isSelected = selectedMonth === monthNum
          const period = monthlyPeriods.find((mp) => mp.month === monthNum)
          const isCompleted = period?.status === "selesai"
          const isDraft = period?.status === "draft"

          return (
            <button
              key={name}
              type="button"
              onClick={() => setSelectedMonth(monthNum)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-lg text-xs font-medium transition-all relative select-none",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="truncate">{name}</span>
              <div className="flex items-center gap-1 mt-1">
                {isCompleted && (
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      isSelected ? "bg-white" : "bg-emerald-500"
                    )}
                    title="Selesai Diisi"
                  />
                )}
                {isDraft && (
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      isSelected ? "bg-white/80" : "bg-amber-500"
                    )}
                    title="Draft"
                  />
                )}
                {!isCompleted && !isDraft && (
                  <span className="size-1.5 rounded-full bg-border" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

