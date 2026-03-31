import type { Db } from '@carbplan/db'

import type { NutritionPlanListQuery, NutritionPlanListResult } from '$modules/nutrition-plans/model'
import type { DatabaseQueryError } from '$utils/db-error'

import { nutritionPlans, planItems, products } from '@carbplan/db'
import { count, eq, inArray, sql } from 'drizzle-orm'
import { ResultAsync } from 'neverthrow'

import { mapDbError } from '$utils/db-error'

const DEFAULT_ITEM_COUNT_VALUE = 0
const DEFAULT_TOTAL_CAFFEINE_MG_VALUE = 0
const DEFAULT_TOTAL_CARBS_G_VALUE = 0

export type NutritionPlanRepository = {
  listAthleteNutritionPlans: (athleteId: string, query: NutritionPlanListQuery) => ResultAsync<NutritionPlanListResult, DatabaseQueryError>
}

export class DbNutritionPlanRepository implements NutritionPlanRepository {
  constructor(private readonly db: Db) { }

  listAthleteNutritionPlans(
    athleteId: string,
    query: NutritionPlanListQuery
  ): ResultAsync<NutritionPlanListResult, DatabaseQueryError> {
    return ResultAsync.fromPromise(
      this.db.transaction(async (tx) => {
        const [plans, totalRows] = await Promise.all([
          tx.select()
            .from(nutritionPlans)
            .where(eq(nutritionPlans.athleteId, athleteId))
            .limit(query.limit)
            .offset(query.offset),

          tx.select({ total: count() })
            .from(nutritionPlans)
            .where(eq(nutritionPlans.athleteId, athleteId))
        ])

        if (plans.length === 0) {
          return {
            data: [],
            meta: { limit: query.limit, offset: query.offset, total: Number(totalRows[0]?.total ?? 0) }
          }
        }

        const planIds = plans.map((plans) => plans.id)
        const aggregateRows = await tx
          .select({
            itemCount: count(planItems.id),
            planId: planItems.planId,
            totalCaffeineMg: sql<number>`coalesce(sum(${planItems.servings} * ${products.caffeineMg}), 0)::int`,
            totalCarbsG: sql<number>`coalesce(sum(${planItems.servings} * ${products.carbsG}), 0)::int`
          })
          .from(planItems)
          .innerJoin(products, eq(planItems.productId, products.id))
          .where(inArray(planItems.planId, planIds))
          .groupBy(planItems.planId)

        return {
          data: plans.map((plan) => {
            const { planId, ...aggregates } = aggregateRows.find((aggregate) => aggregate.planId === plan.id) ?? {
              itemCount: DEFAULT_ITEM_COUNT_VALUE,
              totalCaffeineMg: DEFAULT_TOTAL_CAFFEINE_MG_VALUE,
              totalCarbsG: DEFAULT_TOTAL_CARBS_G_VALUE
            }

            return {
              ...plan,
              nutrition: aggregates
            }
          }),
          meta: {
            limit: query.limit,
            offset: query.offset,
            total: Number(totalRows[0]?.total ?? 0)
          }
        }
      }),
      mapDbError
    )
  }
}
