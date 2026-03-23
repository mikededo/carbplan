import type { FavoriteProductsListResponse } from '$modules/products/model'

import * as ProductsContracts from '@carbplan/contracts/products'
import { Elysia } from 'elysia'
import { okAsync } from 'neverthrow'
import { describe, expect, it } from 'vitest'

import { meModule } from '$modules/me'
import { createAuthServerStub } from '$test/stubs/auth-server'

describe('me HTTP contract', () => {
  it('[GET] /v1/me/favorites/products keeps response contract', async () => {
    const app = new Elysia().use(meModule({
      auth: createAuthServerStub(),
      services: {
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

    const response = await app.handle(new Request('http://localhost/v1/me/favorites/products'))
    const payload = await response.json()

    expect(response.status).toBe(200)

    const normalized = (payload as Array<Record<string, unknown>>).map((item) => ({
      ...item,
      createdAt: new Date(String(item.createdAt)),
      updatedAt: new Date(String(item.updatedAt))
    }))
    expect(ProductsContracts.FavoriteProductsListResponseSchema.safeParse(normalized).success).toBe(true)
  })
})
