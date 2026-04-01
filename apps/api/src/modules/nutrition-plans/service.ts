import type { ResultAsync } from 'neverthrow'

import type { NutritionPlanListQuery, NutritionPlanListResult, NutritionPlanQueryValidationError } from '$modules/nutrition-plans/model'
import type { NutritionPlanRepository } from '$modules/nutrition-plans/repository'
import type { DatabaseQueryError } from '$utils/db-error'

export type NutritionPlansService = {
  listAthleteNutritionPlans: (athleteId: string, query: NutritionPlanListQuery) => ResultAsync<NutritionPlanListResult, DatabaseQueryError | NutritionPlanQueryValidationError>
}

export class NutritionPlanServiceImpl implements NutritionPlansService {
  constructor(private readonly repository: NutritionPlanRepository) { }

  listAthleteNutritionPlans(athleteId: string, query: NutritionPlanListQuery): ResultAsync<NutritionPlanListResult, DatabaseQueryError | NutritionPlanQueryValidationError> {
    return this.repository.listAthleteNutritionPlans(athleteId, query)
  }
}
