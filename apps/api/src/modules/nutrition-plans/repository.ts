import type { Db } from '@carbplan/db'
import type { SQL } from 'drizzle-orm'
import type { PgColumn } from 'drizzle-orm/pg-core'

import type { NutritionPlanListQuery, NutritionPlanListResult } from '$modules/nutrition-plans/model'
import type { DatabaseQueryError } from '$utils/db-error'

import { nutritionPlans, planItems, products } from '@carbplan/db'
import { and, asc, count, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm'
import { errAsync, ResultAsync } from 'neverthrow'

import { NutritionPlanQueryValidationError } from '$modules/nutrition-plans/model'
import { mapDbError } from '$utils/db-error'
import { parseQuerySort } from '$utils/sorting'

const DEFAULT_ITEM_COUNT_VALUE = 0
const DEFAULT_TOTAL_CAFFEINE_MG_VALUE = 0
const DEFAULT_TOTAL_CARBS_G_VALUE = 0
const SORT_FIELD_MAP: Record<'date', PgColumn> = {
  date: nutritionPlans.date
}

const toDateOnlyValue = (value: string): Date => new Date(`${value}T00:00:00.000Z`)

export type NutritionPlanRepository = {
  listAthleteNutritionPlans: (athleteId: string, query: NutritionPlanListQuery) => ResultAsync<NutritionPlanListResult, DatabaseQueryError | NutritionPlanQueryValidationError>
}

export class DbNutritionPlanRepository implements NutritionPlanRepository {
  constructor(private readonly db: Db) { }

  listAthleteNutritionPlans(
    athleteId: string,
    query: NutritionPlanListQuery
  ): ResultAsync<NutritionPlanListResult, DatabaseQueryError | NutritionPlanQueryValidationError> {
    const parsedQuery = parseQuerySort(query.sort, SORT_FIELD_MAP)
    if (parsedQuery.isErr()) {
      return errAsync(new NutritionPlanQueryValidationError('Invalid sort param'))
    }

    const { direction, field } = parsedQuery.value
    const directionSort = direction === 'asc' ? asc : desc
    const filters: SQL[] = [eq(nutritionPlans.athleteId, athleteId)]

    if (query.date !== undefined) {
      filters.push(eq(nutritionPlans.date, toDateOnlyValue(query.date)))
    }
    if (query.dateGte !== undefined) {
      filters.push(gte(nutritionPlans.date, toDateOnlyValue(query.dateGte)))
    }
    if (query.dateLte !== undefined) {
      filters.push(lte(nutritionPlans.date, toDateOnlyValue(query.dateLte)))
    }

    const whereClause = and(...filters)

    return ResultAsync.fromPromise(
      this.db.transaction(async (tx) => {
        const [plans, totalRows] = await Promise.all([
          tx.select()
            .from(nutritionPlans)
            .where(whereClause)
            .orderBy(
              directionSort(SORT_FIELD_MAP[field]),
              directionSort(nutritionPlans.id)
            )
            .limit(query.limit)
            .offset(query.offset),

          tx.select({ total: count() })
            .from(nutritionPlans)
            .where(whereClause)
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
