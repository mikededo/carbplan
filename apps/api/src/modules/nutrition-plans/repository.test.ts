import type { NutritionPlanItem } from '$modules/nutrition-plans/model'

import { createRepositoryDbMock } from '@carbplan/auth/testing'

import { DbNutritionPlanRepository } from '$modules/nutrition-plans/repository'
import { DatabaseErrorCodeEnum, DatabaseQueryError } from '$utils/db-error'

const basePlan: Omit<NutritionPlanItem, 'nutrition'> = {
  athleteId: 'athlete-id',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  date: new Date('2024-01-10T00:00:00.000Z'),
  durationMinutes: 120,
  id: crypto.randomUUID(),
  isActive: true,
  name: 'Long Ride Plan',
  notes: 'High-carb session',
  targetCarbsPerHour: 90,
  updatedAt: new Date('2024-01-02T00:00:00.000Z'),
  workoutId: null,
  workoutSnapshot: null
}

const createRepository = () => {
  const dbMock = createRepositoryDbMock()
  dbMock.db.transaction = vi.fn(async (callback) => callback(dbMock.db))

  return {
    dbMock,
    repository: new DbNutritionPlanRepository(dbMock.db)
  }
}

describe('nutrition plans repository', () => {
  it('returns a paginated response envelope with nutrition aggregates', async () => {
    const { dbMock, repository } = createRepository()
    dbMock.nQueueResult(
      [basePlan],
      [{ total: 2 }],
      [{
        itemCount: 3,
        planId: basePlan.id,
        totalCaffeineMg: 160,
        totalCarbsG: 90
      }]
    )

    await expect(repository.listAthleteNutritionPlans('athlete-id', { limit: 1, offset: 0, sort: 'date:desc' })).toBeOkAsyncWith({
      data: [{
        ...basePlan,
        nutrition: {
          itemCount: 3,
          totalCaffeineMg: 160,
          totalCarbsG: 90
        }
      }],
      meta: { limit: 1, offset: 0, total: 2 }
    })
  })

  it('applies default nutrition aggregates when no aggregate row exists', async () => {
    const { dbMock, repository } = createRepository()
    dbMock.nQueueResult([basePlan], [{ total: 1 }], [])

    await expect(repository.listAthleteNutritionPlans('athlete-id', { limit: 1, offset: 0, sort: 'date:desc' })).toBeOkAsyncWith({
      data: [{
        ...basePlan,
        nutrition: {
          itemCount: 0,
          totalCaffeineMg: 0,
          totalCarbsG: 0
        }
      }],
      meta: { limit: 1, offset: 0, total: 1 }
    })
  })

  it('returns an empty response with pagination metadata when no plans exist', async () => {
    const { dbMock, repository } = createRepository()
    dbMock.nQueueResult([], [{ total: 0 }])

    await expect(repository.listAthleteNutritionPlans('athlete-id', { limit: 20, offset: 40, sort: 'date:desc' })).toBeOkAsyncWith({
      data: [],
      meta: { limit: 20, offset: 40, total: 0 }
    })
  })

  it('propagates db failures', async () => {
    const { dbMock, repository } = createRepository()
    dbMock.nQueueError(new Error('db failed'), new Error('db failed'))

    await expect(repository.listAthleteNutritionPlans('athlete-id', { limit: 20, offset: 0, sort: 'date:desc' })).toBeErrAsyncWith(
      new DatabaseQueryError({
        cause: new Error('db failed'),
        code: DatabaseErrorCodeEnum.UNKNOWN,
        message: 'db failed'
      })
    )
  })

  it('applies date filters and deterministic date sorting to list queries', async () => {
    const { dbMock, repository } = createRepository()
    dbMock.nQueueResult([], [{ total: 0 }])

    await expect(repository.listAthleteNutritionPlans('athlete-id', {
      date: '2024-01-10',
      dateGte: '2024-01-01',
      dateLte: '2024-01-31',
      limit: 20,
      offset: 0,
      sort: 'date:asc'
    })).toBeOkAsyncWith({
      data: [],
      meta: { limit: 20, offset: 0, total: 0 }
    })

    expect(dbMock.capturedSql[0]).toContain('"nutrition_plans"."date" =')
    expect(dbMock.capturedSql[0]).toContain('"nutrition_plans"."date" >=')
    expect(dbMock.capturedSql[0]).toContain('"nutrition_plans"."date" <=')
    expect(dbMock.capturedSql[0]).toContain('order by "nutrition_plans"."date" asc, "nutrition_plans"."id" asc')
  })
})
