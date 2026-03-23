import { createRepositoryDbMock } from '@carbplan/auth/testing'

import { DbProductRepository } from '$modules/products/repository'

describe('product repository', () => {
  it('queries favorite products and maps rows with brand data', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueResult([{
      brands: {
        id: 'brand-1',
        logoUrl: 'https://example.com/logo.png',
        name: 'Brand One',
        slug: 'brand-one'
      },
      products: {
        brandId: 'brand-1',
        caffeineMg: 80,
        calories: 100,
        carbsG: 25,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        fatG: 0,
        flavor: 'citrus',
        form: 'gel',
        id: 'product-1',
        isActive: true,
        name: 'Gel One',
        notes: null,
        proteinG: 0,
        servingSize: 60,
        servingsPerPackage: 1,
        servingUnit: 'g',
        slug: 'gel-one',
        sodiumMg: 50,
        sugarG: 20,
        updatedAt: new Date('2024-01-02T00:00:00.000Z')
      }
    }])

    const repository = new DbProductRepository(dbMock.db)

    const result = await repository.listFavoriteProductsWithBrands('athlete-id')

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      brand: {
        id: 'brand-1',
        logoUrl: 'https://example.com/logo.png',
        name: 'Brand One',
        slug: 'brand-one'
      },
      brandId: 'brand-1',
      caffeineMg: 80,
      calories: 100,
      carbsG: 25,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      fatG: 0,
      flavor: 'citrus',
      form: 'gel',
      id: 'product-1',
      isActive: true,
      isFavorite: true,
      name: 'Gel One',
      notes: null,
      proteinG: 0,
      servingSize: 60,
      servingsPerPackage: 1,
      servingUnit: 'g',
      slug: 'gel-one',
      sodiumMg: 50,
      sugarG: 20,
      updatedAt: new Date('2024-01-02T00:00:00.000Z')
    })
  })

  it('filters out rows missing joined brand or product data', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueResult([{
      brands: null,
      products: {
        brandId: 'brand-1',
        caffeineMg: 80,
        calories: 100,
        carbsG: 25,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        fatG: 0,
        flavor: 'citrus',
        form: 'gel',
        id: 'product-1',
        isActive: true,
        name: 'Gel One',
        notes: null,
        proteinG: 0,
        servingSize: 60,
        servingsPerPackage: 1,
        servingUnit: 'g',
        slug: 'gel-one',
        sodiumMg: 50,
        sugarG: 20,
        updatedAt: new Date('2024-01-02T00:00:00.000Z')
      }
    }])

    const repository = new DbProductRepository(dbMock.db)

    const result = await repository.listFavoriteProductsWithBrands('athlete-id')

    expect(result).toEqual([])
  })

  it('propagates db failures', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueError(new Error('db failed'))
    const repository = new DbProductRepository(dbMock.db)

    await expect(repository.listFavoriteProductsWithBrands('athlete-id')).rejects.toThrow('db failed')
  })
})
