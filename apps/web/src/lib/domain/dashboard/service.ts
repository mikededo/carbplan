import type { ApiClient, ApiData } from '$lib/api/eden'

import { unwrapEden } from '$lib/api/eden'

export type FavoriteProducts = ApiData<ApiClient['v1']['me']['favorites']['products']['get']>
export type NutritionPlans = ApiData<ApiClient['v1']['nutrition-plans']['me']['get']>
export type NutritionPlanListItem = NutritionPlans['data'][number]

export const createDashboardService = (api: ApiClient) => ({
  getFavoriteProducts: (limit: number) => unwrapEden(api.v1.me.favorites.products.get()).map((products) => products.slice(0, limit)),
  getNextPlan: (today: string) => unwrapEden(api.v1['nutrition-plans'].me.get({
    query: {
      dateGte: today,
      limit: 1,
      offset: 0,
      sort: 'date:asc'
    }
  })).map((result) => result.data[0] ?? null),
  getRecentPlans: (limit: number) => unwrapEden(api.v1['nutrition-plans'].me.get({
    query: {
      limit,
      offset: 0,
      sort: 'date:desc'
    }
  })).map((result) => result.data)
})

export type DashboardService = ReturnType<typeof createDashboardService>
