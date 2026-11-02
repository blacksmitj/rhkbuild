import type { SkpIndicator, SkpActionPlan, SkpMonthlyPeriod } from "@/lib/mock-data"

export interface MonthlyBreakdown {
  month: number
  value: number
}

export interface IndicatorRecap {
  indicator: SkpIndicator
  annualTarget: number
  unit: string
  totalRealization: number
  achievementPercentage: number
  remainingTarget: number
  monthlyBreakdown: MonthlyBreakdown[]
}

/**
 * Calculates complete annual recap for all indicators for the active period.
 * Follows BR-12 & Section 5 formula from PRD.
 */
export function calculateAnnualRecap(
  indicators: SkpIndicator[],
  monthlyPeriods: SkpMonthlyPeriod[],
  actionPlans: SkpActionPlan[]
): IndicatorRecap[] {
  return indicators.map((indicator) => {
    // 12 months breakdown
    const monthlyBreakdown: MonthlyBreakdown[] = Array.from({ length: 12 }, (_, idx) => {
      const monthNum = idx + 1
      const matchingPeriod = monthlyPeriods.find((mp) => mp.month === monthNum)
      if (!matchingPeriod) {
        return { month: monthNum, value: 0 }
      }

      const monthValue = actionPlans
        .filter(
          (act) =>
            act.indicatorId === indicator.id &&
            act.monthlyPeriodId === matchingPeriod.id
        )
        .reduce((sum, act) => sum + (Number(act.realizationValue) || 0), 0)

      return {
        month: monthNum,
        value: monthValue,
      }
    })

    const totalRealization = monthlyBreakdown.reduce((acc, curr) => acc + curr.value, 0)
    const annualTarget = Number(indicator.annualTarget) || 0

    // Percentage achievement calculation with safe non-zero guard
    const achievementPercentage =
      annualTarget > 0 ? Math.round((totalRealization / annualTarget) * 100) : 0

    const remainingTarget = Math.max(0, annualTarget - totalRealization)

    return {
      indicator,
      annualTarget,
      unit: indicator.unit,
      totalRealization,
      achievementPercentage,
      remainingTarget,
      monthlyBreakdown,
    }
  })
}

