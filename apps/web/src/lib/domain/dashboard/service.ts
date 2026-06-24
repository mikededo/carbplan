import type { ApiClient } from '$lib/api/eden'
import type { FavoriteProductsListResponse, NutritionPlansListResult } from '$lib/api/endpoint-types'

import { unwrapEden } from '$lib/api/eden'

export const createDashboardService = (api: ApiClient) => ({
  getFavoriteProducts: (limit: number) => unwrapEden<FavoriteProductsListResponse>(api.v1.me.favorites.products.get()).map((products) => products.slice(0, limit)),
  getNextPlan: (today: string) => unwrapEden<NutritionPlansListResult>(api.v1['nutrition-plans'].me.get({
    query: {
      dateGte: today,
      limit: 1,
      offset: 0,
      sort: 'date:asc'
    }
  })).map((result) => result.data[0] ?? null),
  getRecentPlans: (limit: number) => unwrapEden<NutritionPlansListResult>(api.v1['nutrition-plans'].me.get({
    query: {
      limit,
      offset: 0,
      sort: 'date:desc'
    }
  })).map((result) => result.data)
})

export type DashboardService = ReturnType<typeof createDashboardService>
