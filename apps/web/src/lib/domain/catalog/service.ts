import type { Transport } from '$lib/api/transport'

import * as CatalogContracts from '@carbplan/contracts/catalog'
import * as PublicCatalogContracts from '@carbplan/contracts/public-catalog'

import { getApiRoute } from '$lib/api/routes'

const getPublicCatalogRoute = getApiRoute.prefixed('/public/catalogs')
const getProductCatalogRoute = getApiRoute.prefixed('/catalogs/products')
const getBrandCatalogRoute = getApiRoute.prefixed('/catalogs/brands')

export const createPublicCatalogService = (transport: Transport) => ({
  getCatalog: () => transport.get({
    includeMeta: false,
    path: getPublicCatalogRoute(''),
    schema: PublicCatalogContracts.CatalogProductsListResponseSchema
  })
})
export type PublicCatalogService = ReturnType<typeof createPublicCatalogService>

export const createCatalogService = (transport: Transport) => ({
  createBrand: (body: CatalogContracts.CreateBrandRequest) => transport.post({
    body,
    path: getBrandCatalogRoute(''),
    schema: CatalogContracts.CreateBrandResponseSchema
  }),
  createProduct: (body: CatalogContracts.CreateProductRequest) => transport.post({
    body,
    path: getProductCatalogRoute(''),
    schema: CatalogContracts.CreateProductResponseSchema
  }),
  deactivateProduct: (id: string) => transport.patch({
    path: getProductCatalogRoute(`/${id}/deactivate`),
    schema: CatalogContracts.DeactivateProductResponseSchema
  }),
  getCatalog: () => transport.get({
    path: getApiRoute('/catalogs'),
    schema: CatalogContracts.CatalogListResponseSchema
  }),
  updateBrand: (id: string, body: CatalogContracts.UpdateBrandRequest) => transport.patch({
    body,
    path: getBrandCatalogRoute(`/${id}`),
    schema: CatalogContracts.UpdateBrandResponseSchema
  }),
  updateProduct: (id: string, body: CatalogContracts.UpdateProductRequest) => transport.patch({
    body,
    path: getProductCatalogRoute(`/${id}`),
    schema: CatalogContracts.UpdateProductResponseSchema
  })
})
export type CatalogService = ReturnType<typeof createCatalogService>
