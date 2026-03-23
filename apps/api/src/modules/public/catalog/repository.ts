import type { Db } from '@carbplan/db'

import type { CatalogProductRow } from '$modules/public/catalog/model'

import { brands, products } from '@carbplan/db'
import { and, asc, eq } from 'drizzle-orm'

export type PublicCatalogRepository = {
  listCatalogRows: () => Promise<CatalogProductRow[]>
}

export class DbPublicCatalogRepository implements PublicCatalogRepository {
  constructor(private readonly db: Db) { }

  listCatalogRows(): Promise<CatalogProductRow[]> {
    return this.db
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
      } satisfies Record<keyof CatalogProductRow, unknown>)
      .from(brands)
      .innerJoin(products, eq(products.brandId, brands.id))
      .where(and(eq(brands.isActive, true), eq(products.isActive, true)))
      .orderBy(asc(brands.name), asc(products.name))
  }
}
