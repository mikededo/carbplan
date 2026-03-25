import type { FavoriteProductsListResponse } from '$modules/products/model'

import * as MeContracts from '@carbplan/contracts/me'
import * as ProductsContracts from '@carbplan/contracts/products'
import { HRZoneModelEnum } from '@carbplan/domain/hr'
import { treaty } from '@elysiajs/eden'
import { okAsync } from 'neverthrow'

import { meModule } from '$modules/me'
import { createAuthServerStub } from '$test/stubs/auth-server'

const app = treaty(meModule({
  auth: createAuthServerStub(),
  services: {
    me: {
      updateHRZones: () => okAsync(true)
    },
    product: {
      getAllFavoriteProducts: () => okAsync<FavoriteProductsListResponse>([{
        brand: {
          id: 'brand-1',
          logoUrl: null,
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
        id: 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d',
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
  }
}))

describe('me HTTP contract', () => {
  it('[GET] /v1/me/favorites/products keeps response contract', async () => {
    const response = await app.v1.me.favorites.products.get()

    expect(response.status).toBe(200)

    expect(Array.isArray(response.data)).toBeDefined()
    const normalized = response.data?.map((item) => ({
      ...item,
      createdAt: new Date(String(item.createdAt)),
      updatedAt: new Date(String(item.updatedAt))
    }))
    expect(ProductsContracts.FavoriteProductsListResponseSchema.safeParse(normalized).success).toBe(true)
  })

  // FIXME: NoContent fail when passing null/undefined: https://github.com/elysiajs/elysia/pull/1810
  it.skip('[PATCH] /v1/me/hr keeps response contract', async () => {
    const response = await app.v1.me.hr.patch({
      model: HRZoneModelEnum.custom,
      zones: []
    })

    expect(response.status).toBe(204)
    expect(MeContracts.UpdateHRZonesResponseSchema.safeParse(response).success).toBe(true)
  })
})
