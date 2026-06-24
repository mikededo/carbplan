import type { ApiClient } from '$lib/api/eden'
import type {
  CatalogListResponse,
  CreateBrandRequest,
  CreateBrandResponse,
  CreateProductRequest,
  CreateProductResponse,
  DeactivateProductResponse,
  PublicCatalogResponse,
  UpdateBrandRequest,
  UpdateBrandResponse,
  UpdateProductRequest,
  UpdateProductResponse
} from '$lib/api/endpoint-types'

import { unwrapEden } from '$lib/api/eden'

export const createPublicCatalogService = (api: ApiClient) => ({
  getCatalog: () => unwrapEden<PublicCatalogResponse>(api.v1.public.catalogs.get({
    query: { limit: 20, offset: 0, sort: 'name:asc' }
  }))
})
export type PublicCatalogService = ReturnType<typeof createPublicCatalogService>

export const createCatalogService = (api: ApiClient) => ({
  createBrand: (body: CreateBrandRequest) => unwrapEden<CreateBrandResponse>(api.v1.catalogs.brands.post(body)),
  createProduct: (body: CreateProductRequest) => unwrapEden<CreateProductResponse>(api.v1.catalogs.products.post(body)),
  deactivateProduct: (id: string) => unwrapEden<DeactivateProductResponse>(api.v1.catalogs.products({ productId: id }).deactivate.patch()),
  getCatalog: () => unwrapEden<CatalogListResponse>(api.v1.catalogs.get()),
  updateBrand: (id: string, body: UpdateBrandRequest) => unwrapEden<UpdateBrandResponse>(api.v1.catalogs.brands({ brandId: id }).patch(body)),
  updateProduct: (id: string, body: UpdateProductRequest) => unwrapEden<UpdateProductResponse>(api.v1.catalogs.products({ productId: id }).patch(body))
})
export type CatalogService = ReturnType<typeof createCatalogService>
