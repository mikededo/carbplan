import type { CatalogListPageResult } from '$modules/public/catalog/model'

import { Elysia } from 'elysia'
import { okAsync } from 'neverthrow'

import { publicModule } from '$modules/public'

describe('public catalog HTTP contract', () => {
  it('[GET] /v1/public/catalog returns a paginated flat list envelope', async () => {
    const app = new Elysia().use(publicModule({
      services: {
        catalog: {
          getCatalogProducts: () => okAsync<CatalogListPageResult>({
            data: [{
              brandDescription: null,
              brandId: 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d',
              brandLogoUrl: null,
              brandName: 'Brand One',
              brandSlug: 'brand-one',
              brandWebsite: null,
              caffeineMg: 80,
              calories: 100,
              carbsG: 25,
              fatG: 0,
              flavor: 'citrus',
              form: 'gel',
              id: '7bb82c2b-f458-40f0-b17e-739f8fdb7349',
              name: 'Gel One',
              proteinG: 0,
              servingSize: 60,
              servingsPerPackage: 1,
              servingUnit: 'g',
              slug: 'gel-one',
              sodiumMg: 50,
              sugarG: 20
            }],
            meta: {
              limit: 1,
              offset: 0,
              total: 1
            }
          })
        }
      }
    }))

    const response = await app.handle(new Request('http://localhost/v1/public/catalog?limit=1'))
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload).toEqual({
      data: [{
        brandDescription: null,
        brandId: 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d',
        brandLogoUrl: null,
        brandName: 'Brand One',
        brandSlug: 'brand-one',
        brandWebsite: null,
        caffeineMg: 80,
        calories: 100,
        carbsG: 25,
        fatG: 0,
        flavor: 'citrus',
        form: 'gel',
        id: '7bb82c2b-f458-40f0-b17e-739f8fdb7349',
        name: 'Gel One',
        proteinG: 0,
        servingSize: 60,
        servingsPerPackage: 1,
        servingUnit: 'g',
        slug: 'gel-one',
        sodiumMg: 50,
        sugarG: 20
      }],
      meta: {
        limit: 1,
        offset: 0,
        total: 1
      }
    })
  })

  it('[GET] /v1/public/catalog returns bad request for invalid query', async () => {
    const app = new Elysia().use(publicModule({
      services: {
        catalog: {
          getCatalogProducts: () => okAsync<CatalogListPageResult>({ data: [], meta: { limit: 0, offset: 0, total: 0 } })
        }
      }
    }))

    const response = await app.handle(new Request('http://localhost/v1/public/catalog?sort=invalid:asc'))

    expect(response.status).toBe(422)
  })
})
