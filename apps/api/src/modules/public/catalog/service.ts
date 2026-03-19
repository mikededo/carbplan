import type { Db } from '@carbplan/db'

import type { CatalogBrand, CatalogResponse } from './model'

import { brands, products } from '@carbplan/db'
import { and, asc, eq } from 'drizzle-orm'

const selectCatalogRows = (db: Db) => db
  .select({
    brandDescription: brands.description,
    brandId: brands.id,
    brandIsActive: brands.isActive,
    brandLogoUrl: brands.logoUrl,
    brandName: brands.name,
    brandSlug: brands.slug,
    brandWebsite: brands.website,
    productCaffeineMg: products.caffeineMg,
    productCalories: products.calories,
    productCarbsG: products.carbsG,
    productFatG: products.fatG,
    productFlavor: products.flavor,
    productForm: products.form,
    productId: products.id,
    productIsActive: products.isActive,
    productName: products.name,
    productProteinG: products.proteinG,
    productServingSize: products.servingSize,
    productServingsPerPackage: products.servingsPerPackage,
    productServingUnit: products.servingUnit,
    productSlug: products.slug,
    productSodiumMg: products.sodiumMg,
    productSugarG: products.sugarG
  })
  .from(brands)
  .innerJoin(products, eq(products.brandId, brands.id))
  .where(and(eq(brands.isActive, true), eq(products.isActive, true)))
  .orderBy(asc(brands.name), asc(products.name))

export type CatalogRow = Awaited<ReturnType<typeof selectCatalogRows>>[number]

export const buildCatalogResponse = (rows: CatalogRow[]): CatalogResponse => {
  const groupedBrands = new Map<string, CatalogBrand>()

  for (const row of rows) {
    if (!row.brandIsActive || !row.productIsActive) {
      continue
    }

    const existingBrand = groupedBrands.get(row.brandId)
    if (existingBrand) {
      existingBrand.products.push({
        caffeineMg: row.productCaffeineMg,
        calories: row.productCalories,
        carbsG: row.productCarbsG,
        fatG: row.productFatG,
        flavor: row.productFlavor,
        form: row.productForm,
        id: row.productId,
        name: row.productName,
        proteinG: row.productProteinG,
        servingSize: row.productServingSize,
        servingsPerPackage: row.productServingsPerPackage,
        servingUnit: row.productServingUnit,
        slug: row.productSlug,
        sodiumMg: row.productSodiumMg,
        sugarG: row.productSugarG
      })
      continue
    }

    groupedBrands.set(row.brandId, {
      description: row.brandDescription,
      id: row.brandId,
      logoUrl: row.brandLogoUrl,
      name: row.brandName,
      products: [{
        caffeineMg: row.productCaffeineMg,
        calories: row.productCalories,
        carbsG: row.productCarbsG,
        fatG: row.productFatG,
        flavor: row.productFlavor,
        form: row.productForm,
        id: row.productId,
        name: row.productName,
        proteinG: row.productProteinG,
        servingSize: row.productServingSize,
        servingsPerPackage: row.productServingsPerPackage,
        servingUnit: row.productServingUnit,
        slug: row.productSlug,
        sodiumMg: row.productSodiumMg,
        sugarG: row.productSugarG
      }],
      slug: row.brandSlug,
      website: row.brandWebsite
    })
  }

  return {
    brands: [...groupedBrands.values()]
  }
}

export type PublicCatalogService = {
  getCatalog: () => Promise<CatalogResponse>
}

export class DbPublicCatalogService implements PublicCatalogService {
  constructor(private readonly db: Db) {}

  async getCatalog(): Promise<CatalogResponse> {
    const rows = await selectCatalogRows(this.db)

    return buildCatalogResponse(rows)
  }
}
