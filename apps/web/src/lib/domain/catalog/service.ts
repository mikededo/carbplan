import type { ApiBody, ApiClient, ApiData } from '$lib/api/eden'

import { unwrapEden } from '$lib/api/eden'

type BrandRoute = ReturnType<ApiClient['v1']['catalogs']['brands']>
type ProductRoute = ReturnType<ApiClient['v1']['catalogs']['products']>

export type CatalogResult = ApiData<ApiClient['v1']['catalogs']['get']>
export type CatalogBrand = CatalogResult[number]
export type CatalogProduct = CatalogBrand['products'][number]
export type CreateBrandInput = ApiBody<ApiClient['v1']['catalogs']['brands']['post']>
export type CreateBrand = ApiData<ApiClient['v1']['catalogs']['brands']['post']>
export type CreateProductInput = ApiBody<ApiClient['v1']['catalogs']['products']['post']>
export type CreateProduct = ApiData<ApiClient['v1']['catalogs']['products']['post']>
export type PublicCatalog = ApiData<ApiClient['v1']['public']['catalogs']['get']>
export type UpdateBrandInput = ApiBody<BrandRoute['patch']>
export type UpdateProductInput = ApiBody<ProductRoute['patch']>

export const createPublicCatalogService = (api: ApiClient) => ({
  getCatalog: () => unwrapEden(api.v1.public.catalogs.get({
    query: { limit: 20, offset: 0, sort: 'name:asc' }
  }))
})
export type PublicCatalogService = ReturnType<typeof createPublicCatalogService>

export const createCatalogService = (api: ApiClient) => ({
  createBrand: (body: CreateBrandInput) => unwrapEden(api.v1.catalogs.brands.post(body)),
  createProduct: (body: CreateProductInput) => unwrapEden(api.v1.catalogs.products.post(body)),
  deactivateProduct: (id: string) => unwrapEden(api.v1.catalogs.products({ productId: id }).deactivate.patch()),
  getCatalog: () => unwrapEden(api.v1.catalogs.get()),
  updateBrand: (id: string, body: UpdateBrandInput) => unwrapEden(api.v1.catalogs.brands({ brandId: id }).patch(body)),
  updateProduct: (id: string, body: UpdateProductInput) => unwrapEden(api.v1.catalogs.products({ productId: id }).patch(body))
})
export type CatalogService = ReturnType<typeof createCatalogService>
