import type { CatalogListPageResult } from '$modules/public/catalog/model'

import * as CatalogContracts from '@carbplan/contracts/catalog'
import { treaty } from '@elysiajs/eden'
import { okAsync } from 'neverthrow'

import { publicModule } from '$modules/public'

const app = (result: CatalogListPageResult) => treaty(publicModule({
  services: {
    catalog: {
      getCatalogProducts: () => okAsync(result)
    }
  }
}))

describe('public catalog HTTP contract', () => {
  it('[GET] /v1/public/catalog returns a paginated flat list envelope', async () => {
    const response = await app({
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
    }).v1.public.catalog.get({ query: { limit: 1 } })

    expect(response.status).toBe(200)
    expect(CatalogContracts.CatalogProductsListResponseSchema.safeParse(response.data).success).toBe(true)
    expect(response.data).toEqual({
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
    const response = await app({ data: [], meta: { limit: 0, offset: 0, total: 0 } }).v1.public.catalog.get({
      // @ts-expect-error For testing purposes
      query: { sort: 'invalid:asc' }
    })

    expect(response.status).toBe(422)
  })
})
