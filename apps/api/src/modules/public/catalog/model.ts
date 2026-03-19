import { brands, products } from '@carbplan/db'
import { t } from 'elysia'

import { createSelectModel } from '$modules/public/catalog/schema'

const BrandSelectModel = createSelectModel(brands)
const ProductSelectModel = createSelectModel(products)

export const CatalogProductModel = t.Object({
  caffeineMg: ProductSelectModel.properties.caffeineMg,
  calories: ProductSelectModel.properties.calories,
  carbsG: ProductSelectModel.properties.carbsG,
  fatG: ProductSelectModel.properties.fatG,
  flavor: ProductSelectModel.properties.flavor,
  form: ProductSelectModel.properties.form,
  id: ProductSelectModel.properties.id,
  name: ProductSelectModel.properties.name,
  proteinG: ProductSelectModel.properties.proteinG,
  servingSize: ProductSelectModel.properties.servingSize,
  servingsPerPackage: ProductSelectModel.properties.servingsPerPackage,
  servingUnit: ProductSelectModel.properties.servingUnit,
  slug: ProductSelectModel.properties.slug,
  sodiumMg: ProductSelectModel.properties.sodiumMg,
  sugarG: ProductSelectModel.properties.sugarG
})

export const CatalogBrandModel = t.Object({
  description: BrandSelectModel.properties.description,
  id: BrandSelectModel.properties.id,
  logoUrl: BrandSelectModel.properties.logoUrl,
  name: BrandSelectModel.properties.name,
  products: t.Array(CatalogProductModel),
  slug: BrandSelectModel.properties.slug,
  website: BrandSelectModel.properties.website
})

export const CatalogResponseModel = t.Object({
  brands: t.Array(CatalogBrandModel)
})

export type CatalogBrand = typeof CatalogBrandModel.static
export type CatalogProduct = typeof CatalogProductModel.static
export type CatalogResponse = typeof CatalogResponseModel.static
