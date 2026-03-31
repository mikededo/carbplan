import type { AthleteId } from '@carbplan/db'

import type { PaginationModel, PaginationWithTotal } from '$utils/pagination'

export type NutritionPlanListQuery = PaginationModel
export type NutritionPlanItem = {
  athleteId: AthleteId
  createdAt: Date
  date: Date
  durationMinutes: null | number
  id: string
  isActive: boolean
  name: string
  notes: null | string
  targetCarbsPerHour: null | number
  updatedAt: Date
  workoutId: null | string
  workoutSnapshot: null | unknown
  nutrition: {
    itemCount: number
    totalCarbsG: number
    totalCaffeineMg: number
  }
}
export type NutritionPlanListResult = {
  data: NutritionPlanItem[]
  meta: PaginationWithTotal
}
