import { createRepositoryDbMock } from '@carbplan/auth/testing'
import { describe, expect, it } from 'vitest'

import { DbPublicCatalogRepository } from './repository'

describe('public catalog repository', () => {
  it('queries active brands and products ordered by name', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueResult([{
      brandDescription: null,
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
    const repository = new DbPublicCatalogRepository(dbMock.db)

    const result = await repository.listCatalogRows()

    expect(result).toHaveLength(1)
  })

  it('propagates db failures', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueError(new Error('db failed'))
    const repository = new DbPublicCatalogRepository(dbMock.db)

    await expect(repository.listCatalogRows()).rejects.toThrow('db failed')
  })
})
