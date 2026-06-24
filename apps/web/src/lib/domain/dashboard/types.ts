import type { FavoriteProductsListResponse, NutritionPlanListItem } from '$lib/api/endpoint-types'

export type DashboardPlan = NutritionPlanListItem
export type DashboardFavoriteProduct = FavoriteProductsListResponse[number]
