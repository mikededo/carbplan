import { describe, expect, it } from 'vitest'

import { NutritionPlansListQuerySchema } from './nutrition-plans'

describe('nutrition plans contracts', () => {
  it('validates list query defaults and coercion', () => {
    const parsed = NutritionPlansListQuerySchema.parse({
      date: '2024-01-10',
      dateGte: '2024-01-01',
      dateLte: '2024-01-31',
      limit: '16',
      offset: '8',
      sort: 'date:asc'
    })

    expect(parsed.date).toBe('2024-01-10')
    expect(parsed.dateGte).toBe('2024-01-01')
    expect(parsed.dateLte).toBe('2024-01-31')
    expect(parsed.limit).toBe(16)
    expect(parsed.offset).toBe(8)
    expect(parsed.sort).toBe('date:asc')
  })

  it('applies default sort when omitted', () => {
    const parsed = NutritionPlansListQuerySchema.parse({
      limit: 20,
      offset: 0
    })

    expect(parsed.sort).toBe('date:desc')
  })

  it('rejects invalid sort values', () => {
    const parsed = NutritionPlansListQuerySchema.safeParse({
      sort: 'name:asc'
    })

    expect(parsed.success).toBe(false)
  })

  it('rejects invalid date ranges', () => {
    const parsed = NutritionPlansListQuerySchema.safeParse({
      dateGte: '2024-02-01',
      dateLte: '2024-01-01'
    })

    expect(parsed.success).toBe(false)
  })
})
