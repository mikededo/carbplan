import type { FavoriteProductWithBrand } from '$modules/favorites/model'
import type { AthleteFavoritesRepository } from '$modules/favorites/repository'

import { errAsync, okAsync } from 'neverthrow'

import { AthletesFavoritesServiceImpl } from '$modules/favorites/service'
import { createStub } from '$test/stubs/helpers'
import { DatabaseErrorCodeEnum, DatabaseQueryError } from '$utils/db-error'

const repository = createStub<AthleteFavoritesRepository>(['listFavoriteProductsWithBrands'])

describe('athlete favorites service', () => {
  it('maps repository rows to favorite product response', async () => {
    const model: FavoriteProductWithBrand = {
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
    }

    repository.listFavoriteProductsWithBrands.mockReturnValue(okAsync([model]))
    const service = new AthletesFavoritesServiceImpl(repository)

    await expect(service.getAllFavoriteProducts('athlete-id')).toBeOkAsyncWith([model])
  })

  it('maps repository errors to a database error', async () => {
    repository.listFavoriteProductsWithBrands.mockReturnValue(
      errAsync(new DatabaseQueryError({ cause: new Error('Db error'), code: DatabaseErrorCodeEnum.UNKNOWN }))
    )
    const service = new AthletesFavoritesServiceImpl(repository)

    await expect(
      service.getAllFavoriteProducts('athlete-id')
    ).toBeErrAsyncWith(new DatabaseQueryError({ cause: new Error('Db error'), code: DatabaseErrorCodeEnum.UNKNOWN }))
  })
})
