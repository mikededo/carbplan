import type { NutritionPlanListItem } from '@carbplan/contracts/nutrition-plans'
import type { FavoriteProductsListResponse } from '@carbplan/contracts/products'

export type DashboardPlan = NutritionPlanListItem
export type DashboardFavoriteProduct = FavoriteProductsListResponse[number]
