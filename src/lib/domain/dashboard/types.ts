import type { PlanWithSummary } from '$lib/database/types.g'

export type DashboardPlan = {
  items?: Array<{
    brandName: string
    id: string
    productName: string
    servings: number
    timingMinutes: number
  }>
} & PlanWithSummary
