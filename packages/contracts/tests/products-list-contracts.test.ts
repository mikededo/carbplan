import { describe, expect, it } from 'vitest'

import {
  CatalogProductsListQuerySchema,
  CatalogProductsListResponseSchema
} from '../src/domains/catalog'

describe('products list contracts', () => {
  it('validates list query defaults and coercion', () => {
    const parsed = CatalogProductsListQuerySchema.parse({
      brand: ['brand-a', 'brand-b'],
      carbsGte: '20',
      form: ['gel'],
      limit: '16',
      offset: '8'
    })

    expect(parsed.limit).toBe(16)
    expect(parsed.offset).toBe(8)
    expect(parsed.sort).toBe('name:asc')
    expect(parsed.carbsGte).toBe(20)
  })

  it('rejects invalid numeric ranges', () => {
    const parsed = CatalogProductsListQuerySchema.safeParse({
      caloriesGte: 200,
      caloriesLte: 100
    })

    expect(parsed.success).toBe(false)
  })

  it('validates paginated catalog response envelope', () => {
    const parsed = CatalogProductsListResponseSchema.safeParse({
      data: [{
        brandDescription: null,
        brandId: 'brand-1',
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
        id: crypto.randomUUID(),
        name: 'Gel One',
        proteinG: 0,
        servingSize: 60,
        servingsPerPackage: 1,
        servingUnit: 'g',
        slug: 'gel-one',
        sodiumMg: 50,
        sugarG: 20
      }],
      meta: { limit: 20, offset: 0, total: 200 }
    })

    expect(parsed.success).toBe(true)
  })
})
