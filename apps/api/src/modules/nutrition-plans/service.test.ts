import type { NutritionPlanListQuery, NutritionPlanListResult } from '$modules/nutrition-plans/model'
import type { NutritionPlanRepository } from '$modules/nutrition-plans/repository'

import { okAsync } from 'neverthrow'

import { NutritionPlanServiceImpl } from '$modules/nutrition-plans/service'
import { createStub } from '$test/stubs/helpers'

const repository = createStub<NutritionPlanRepository>(['listAthleteNutritionPlans'])

describe('nutrition plans service', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('delegates list query to repository', async () => {
    const athleteId = 'athlete-id'
    const query: NutritionPlanListQuery = {
      limit: 20,
      offset: 0,
      sort: 'date:desc'
    }
    const result: NutritionPlanListResult = {
      data: [],
      meta: { limit: 20, offset: 0, total: 0 }
    }
    repository.listAthleteNutritionPlans.mockReturnValue(okAsync(result))
    const service = new NutritionPlanServiceImpl(repository)

    await expect(service.listAthleteNutritionPlans(athleteId, query)).toBeOkAsyncWith(result)
    expect(repository.listAthleteNutritionPlans).toHaveBeenCalledWith(athleteId, query)
  })
})
