import type { CatalogBrand, CatalogProduct, CatalogProductRow, CatalogResponse } from '$modules/public/catalog/model'
import type { PublicCatalogRepository } from '$modules/public/catalog/repository'

const buildCatalogProduct = (row: CatalogProductRow): CatalogProduct => ({
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

export const buildCatalogResponse = (rows: CatalogProductRow[]): CatalogResponse => {
  const groupedBrands = new Map<string, CatalogBrand>()

  for (const row of rows) {
    if (!row.brandIsActive || !row.productIsActive) {
      continue
    }

    const existingBrand = groupedBrands.get(row.brandId)
    if (existingBrand) {
      existingBrand.products.push(buildCatalogProduct(row))
      continue
    }

    groupedBrands.set(row.brandId, {
      description: row.brandDescription,
      id: row.brandId,
      logoUrl: row.brandLogoUrl,
      name: row.brandName,
      products: [buildCatalogProduct(row)],
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

export class PublicCatalogServiceImpl implements PublicCatalogService {
  constructor(private readonly repository: PublicCatalogRepository) { }

  async getCatalog(): Promise<CatalogResponse> {
    const rows = await this.repository.listCatalogRows()

    return buildCatalogResponse(rows)
  }
}
