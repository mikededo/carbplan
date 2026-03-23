import type { FavoriteProductsListResponse } from '$modules/products/model'
import type { ProductRepository } from '$modules/products/repository'

import { ProductServiceImpl } from '$modules/products/service'

describe('product service', () => {
  it('maps repository rows to favorite product response', async () => {
    const repository: ProductRepository = {
      listFavoriteProductsWithBrands: vi.fn(async (): Promise<FavoriteProductsListResponse> => [{
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
      }])
    }
    const service = new ProductServiceImpl(repository)

    const result = await service.getAllFavoriteProducts('athlete-id')

    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual([{
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
    }])
  })

  it('maps repository errors to null', async () => {
    const repository = {
      listFavoriteProductsWithBrands: vi.fn(async () => {
        throw new Error('db failure')
      })
    }
    const service = new ProductServiceImpl(repository)

    const result = await service.getAllFavoriteProducts('athlete-id')

    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toBeNull()
  })
})
