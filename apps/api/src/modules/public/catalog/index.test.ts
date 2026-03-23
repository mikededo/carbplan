import { Elysia } from 'elysia'

import { publicModule } from '$modules/public'

describe('public catalog HTTP contract', () => {
  it('[GET] /v1/public/catalog keeps response shape', async () => {
    const app = new Elysia().use(publicModule({
      services: {
        catalog: {
          getCatalog: async () => ({
            brands: [{
              description: null,
              id: 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d',
              logoUrl: null,
              name: 'Brand One',
              products: [{
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
              slug: 'brand-one',
              website: null
            }]
          })
        }
      }
    }))

    const response = await app.handle(new Request('http://localhost/v1/public/catalog'))
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload).toEqual({
      brands: [{
        description: null,
        id: 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d',
        logoUrl: null,
        name: 'Brand One',
        products: [{
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
        slug: 'brand-one',
        website: null
      }]
    })
  })
})
