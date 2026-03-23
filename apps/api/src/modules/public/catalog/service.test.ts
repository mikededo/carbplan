import type { CatalogProductRow } from '$modules/public/catalog/model'
import type { PublicCatalogRepository } from '$modules/public/catalog/repository'

import { buildCatalogResponse, PublicCatalogServiceImpl } from '$modules/public/catalog/service'

describe('public catalog service', () => {
  it('buildCatalogResponse groups products under brands', () => {
    const result = buildCatalogResponse([
      {
        brandDescription: 'Brand desc',
        brandId: 'brand-1',
        brandIsActive: true,
        brandLogoUrl: null,
        brandName: 'Brand One',
        brandSlug: 'brand-one',
        brandWebsite: null,
        productCaffeineMg: 80,
        productCalories: 100,
        productCarbsG: 25,
        productFatG: 0,
        productFlavor: 'citrus',
        productForm: 'gel',
        productId: 'product-1',
        productIsActive: true,
        productName: 'Gel One',
        productProteinG: 0,
        productServingSize: 60,
        productServingsPerPackage: 1,
        productServingUnit: 'g',
        productSlug: 'gel-one',
        productSodiumMg: 50,
        productSugarG: 20
      },
      {
        brandDescription: 'Brand desc',
        brandId: 'brand-1',
        brandIsActive: true,
        brandLogoUrl: null,
        brandName: 'Brand One',
        brandSlug: 'brand-one',
        brandWebsite: null,
        productCaffeineMg: null,
        productCalories: 90,
        productCarbsG: 22,
        productFatG: 0,
        productFlavor: 'berry',
        productForm: 'gel',
        productId: 'product-2',
        productIsActive: true,
        productName: 'Gel Two',
        productProteinG: 0,
        productServingSize: 55,
        productServingsPerPackage: 1,
        productServingUnit: 'g',
        productSlug: 'gel-two',
        productSodiumMg: 45,
        productSugarG: 18
      }
    ])

    expect(result.brands).toHaveLength(1)
    expect(result.brands[0]?.products).toHaveLength(2)
  })

  it('skips rows that are inactive', () => {
    const result = buildCatalogResponse([{
      brandDescription: 'Brand desc',
      brandId: 'brand-1',
      brandIsActive: false,
      brandLogoUrl: null,
      brandName: 'Brand One',
      brandSlug: 'brand-one',
      brandWebsite: null,
      productCaffeineMg: 80,
      productCalories: 100,
      productCarbsG: 25,
      productFatG: 0,
      productFlavor: 'citrus',
      productForm: 'gel',
      productId: 'product-1',
      productIsActive: true,
      productName: 'Gel One',
      productProteinG: 0,
      productServingSize: 60,
      productServingsPerPackage: 1,
      productServingUnit: 'g',
      productSlug: 'gel-one',
      productSodiumMg: 50,
      productSugarG: 20
    }])

    expect(result).toEqual({ brands: [] })
  })

  it('fetches rows from repository when getting catalog', async () => {
    const repository: PublicCatalogRepository = {
      listCatalogRows: vi.fn(async (): Promise<CatalogProductRow[]> => [{
        brandDescription: 'Brand desc',
        brandId: 'brand-1',
        brandIsActive: true,
        brandLogoUrl: null,
        brandName: 'Brand One',
        brandSlug: 'brand-one',
        brandWebsite: null,
        productCaffeineMg: 80,
        productCalories: 100,
        productCarbsG: 25,
        productFatG: 0,
        productFlavor: 'citrus',
        productForm: 'gel',
        productId: 'product-1',
        productIsActive: true,
        productName: 'Gel One',
        productProteinG: 0,
        productServingSize: 60,
        productServingsPerPackage: 1,
        productServingUnit: 'g',
        productSlug: 'gel-one',
        productSodiumMg: 50,
        productSugarG: 20
      }])
    }
    const service = new PublicCatalogServiceImpl(repository)

    const result = await service.getCatalog()

    expect(result.brands).toHaveLength(1)
    expect(repository.listCatalogRows).toHaveBeenCalledTimes(1)
  })
})
