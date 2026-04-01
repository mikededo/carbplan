import type { NutritionPlanListResult } from '$modules/nutrition-plans/model'
import type { NutritionPlansService } from '$modules/nutrition-plans/service'

import * as NutritionPlansContracts from '@carbplan/contracts/nutrition-plans'
import { treaty } from '@elysiajs/eden'
import { okAsync } from 'neverthrow'

import { nutritionPlansModule } from '$modules/nutrition-plans'
import { createAuthServerStub } from '$test/stubs/auth-server'
import { createStub } from '$test/stubs/helpers'

const nutritionPlansService = createStub<NutritionPlansService>(['listAthleteNutritionPlans'])

const createNutritionPlansApp = ({
  authSession
}: {
  authSession?: {
    session: Record<string, unknown>
    user: {
      id: string
      isAdmin?: boolean
    }
  } | null
} = {}) => treaty(nutritionPlansModule({
  auth: createAuthServerStub({ authSession }),
  services: {
    nutritionPlans: nutritionPlansService
  }
}))

describe('nutrition plans HTTP contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('[GET] /v1/nutrition-plans/me returns 401 for unauthenticated users', async () => {
    const app = createNutritionPlansApp({ authSession: null })
    const response = await app.v1['nutrition-plans'].me.get({ query: { limit: 1, offset: 0, sort: 'date:desc' } })

    expect(response.status).toBe(401)
  })

  it('[GET] /v1/nutrition-plans/me keeps response contract', async () => {
    const athleteId = 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d'
    const result: NutritionPlanListResult = {
      data: [{
        athleteId,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        date: new Date('2024-01-10T00:00:00.000Z'),
        durationMinutes: 120,
        id: '7bb82c2b-f458-40f0-b17e-739f8fdb7349',
        isActive: true,
        name: 'Long Ride Plan',
        notes: 'High-carb session',
        nutrition: {
          itemCount: 3,
          totalCaffeineMg: 160,
          totalCarbsG: 90
        },
        targetCarbsPerHour: 90,
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        workoutId: null,
        workoutSnapshot: null
      }],
      meta: {
        limit: 1,
        offset: 0,
        total: 1
      }
    }
    nutritionPlansService.listAthleteNutritionPlans.mockReturnValue(okAsync(result))

    const app = createNutritionPlansApp({
      authSession: {
        session: { id: 'session-id' },
        user: { id: athleteId }
      }
    })
    const query = {
      date: '2024-01-10',
      dateGte: '2024-01-01',
      dateLte: '2024-01-31',
      limit: 1,
      offset: 0,
      sort: 'date:asc'
    } as const
    const response = await app.v1['nutrition-plans'].me.get({ query })

    expect(response.status).toBe(200)
    expect(NutritionPlansContracts.NutritionPlansListResultSchema.safeParse(response.data).success).toBe(true)
    expect(nutritionPlansService.listAthleteNutritionPlans).toHaveBeenCalledWith(athleteId, query)
  })

  it('[GET] /v1/nutrition-plans/me returns bad request for invalid query', async () => {
    const app = createNutritionPlansApp()
    const response = await app.v1['nutrition-plans'].me.get({
      query: { limit: 0, offset: 0 }
    })

    expect(response.status).toBe(422)
  })

  it('[GET] /v1/nutrition-plans/me returns bad request for invalid sort', async () => {
    const app = createNutritionPlansApp()
    const response = await app.v1['nutrition-plans'].me.get({
      // @ts-expect-error for contract validation coverage
      query: { limit: 1, offset: 0, sort: 'name:asc' }
    })

    expect(response.status).toBe(422)
  })
})
