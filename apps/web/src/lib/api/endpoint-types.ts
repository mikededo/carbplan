import type { Treaty } from '@elysiajs/eden'

import type { ApiClient } from './eden'

type ApiMethod = (...args: any[]) => Promise<Treaty.TreatyResponse<Record<number, unknown>>>
type Data<T extends ApiMethod> = Treaty.Data<T>
type Body<T extends ApiMethod> = NonNullable<Parameters<T>[0]>

type BrandRoute = ReturnType<ApiClient['v1']['catalogs']['brands']>
type ProductRoute = ReturnType<ApiClient['v1']['catalogs']['products']>

export type CatalogListResponse = Data<ApiClient['v1']['catalogs']['get']>
export type CatalogProduct = CatalogListResponse[number]['products'][number]
export type CreateBrandRequest = Body<ApiClient['v1']['catalogs']['brands']['post']>
export type CreateBrandResponse = Data<ApiClient['v1']['catalogs']['brands']['post']>
export type CreateProductRequest = Body<ApiClient['v1']['catalogs']['products']['post']>
export type CreateProductResponse = Data<ApiClient['v1']['catalogs']['products']['post']>
export type DeactivateProductResponse = void
export type UpdateBrandRequest = Body<BrandRoute['patch']>
export type UpdateBrandResponse = void
export type UpdateProductRequest = Body<ProductRoute['patch']>
export type UpdateProductResponse = void

export type CurrentAthleteResponse = Data<ApiClient['v1']['me']['get']>
export type UpdateCurrentAthleteRequest = Body<ApiClient['v1']['me']['patch']>
export type UpdateCurrentAthleteResponse = void
export type UpdateHRZonesRequest = Body<ApiClient['v1']['me']['hr']['patch']>
export type UpdateHRZonesResponse = void
export type UpdatePowerZonesRequest = Body<ApiClient['v1']['me']['power']['patch']>
export type UpdatePowerZonesResponse = void

export type FavoriteProductsListResponse = Data<ApiClient['v1']['me']['favorites']['products']['get']>
export type HasCompletedOnboardingResponse = Data<ApiClient['v1']['athletes']['me']['onboarding']['get']>
export type SaveOnboardingRequest = Body<ApiClient['v1']['athletes']['me']['onboarding']['post']>
export type SaveOnboardingResponse = void
export type PublicCatalogResponse = Data<ApiClient['v1']['public']['catalogs']['get']>
export type NutritionPlansListResult = Data<ApiClient['v1']['nutrition-plans']['me']['get']>
export type NutritionPlanListItem = NutritionPlansListResult['data'][number]
