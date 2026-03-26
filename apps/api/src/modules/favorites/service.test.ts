import type { FavoriteProductsListResponse } from '$modules/favorites/model'
import type { AthleteFavoritesRepository } from '$modules/favorites/repository'

import { AthletesFavoritesServiceImpl } from '$modules/favorites/service'
import { DatabaseQueryError } from '$utils/db-error'

describe('athlete favorites service', () => {
  it('maps repository rows to favorite product response', async () => {
    const repository: AthleteFavoritesRepository = {
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
    const service = new AthletesFavoritesServiceImpl(repository)

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

  it('maps repository errors to a database error', async () => {
    const repository = {
      listFavoriteProductsWithBrands: vi.fn(async () => {
        throw new Error('db failure')
      })
    }
    const service = new AthletesFavoritesServiceImpl(repository)

    const result = await service.getAllFavoriteProducts('athlete-id')

    expect(result.isErr()).toBe(true)
    const error = result._unsafeUnwrapErr()
    expect(error).toBeInstanceOf(DatabaseQueryError)
    expect(error.code).toBe('UNKNOWN_DB_ERROR')
    expect(error.cause).toEqual(expect.objectContaining({ message: 'db failure' }))
  })
})
