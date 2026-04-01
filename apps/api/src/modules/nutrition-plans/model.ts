import type { SortDirection, SortOptions } from '@carbplan/contracts/pagination'
import type { AthleteId } from '@carbplan/db'

import type { PaginationModel, PaginationWithTotal } from '$utils/pagination'

export type NutritionPlanSortField = 'date'
export type NutritionPlanSortSelection = {
  direction: SortDirection
  field: NutritionPlanSortField
}

export type NutritionPlanListQuery = {
  date?: string | undefined
  dateGte?: string | undefined
  dateLte?: string | undefined
  sort: SortOptions<NutritionPlanSortField>
} & PaginationModel

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

export class NutritionPlanQueryValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NutritionPlanQueryValidationError'
  }
}
