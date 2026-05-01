import type { Transport } from '$lib/api/transport'

import * as NutritionPlansContracts from '@carbplan/contracts/nutrition-plans'
import * as ProductsContracts from '@carbplan/contracts/products'

import { getApiRoute } from '$lib/api/routes'

const getNutritionPlansRoute = getApiRoute.prefixed('/nutrition-plans')
const getMeRoute = getApiRoute.prefixed('/me')

const withQuery = (path: string, query: Record<string, string>) => {
  const params = new URLSearchParams(query)
  return `${path}?${params.toString()}`
}

export const createDashboardService = (transport: Transport) => ({
  getFavoriteProducts: (limit: number) => transport.get({
    path: getMeRoute('/favorites/products'),
    schema: ProductsContracts.FavoriteProductsListResponseSchema
  }).map((products) => products.slice(0, limit)),
  getNextPlan: (today: string) => transport.get({
    path: withQuery(getNutritionPlansRoute('/me'), {
      dateGte: today,
      limit: '1',
      offset: '0',
      sort: 'date:asc'
    }),
    schema: NutritionPlansContracts.NutritionPlansListResultSchema
  }).map((result) => result.data[0] ?? null),
  getRecentPlans: (limit: number) => transport.get({
    path: withQuery(getNutritionPlansRoute('/me'), {
      limit: String(limit),
      offset: '0',
      sort: 'date:desc'
    }),
    schema: NutritionPlansContracts.NutritionPlansListResultSchema
  }).map((result) => result.data)
})

export type DashboardService = ReturnType<typeof createDashboardService>
