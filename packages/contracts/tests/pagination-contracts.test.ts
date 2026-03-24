import { describe, expect, it } from 'vitest'
import z from 'zod'

import {
  createListQuerySchema,
  createSortSchema,
  OffsetPaginationQuerySchema
} from '../src/domains/pagination'

describe('pagination contracts', () => {
  it('coerces offset pagination query values', () => {
    const parsed = OffsetPaginationQuerySchema.parse({
      limit: '25',
      offset: '10'
    })

    expect(parsed).toEqual({
      limit: 25,
      offset: 10
    })
  })

  it('creates a constrained sort schema', () => {
    const schema = createSortSchema({
      defaultSort: 'name:asc',
      fields: ['name', 'carbsG'] as const
    })

    expect(schema.parse(undefined)).toBe('name:asc')
    expect(schema.safeParse('carbsG:desc').success).toBe(true)
    expect(schema.safeParse('brand:asc').success).toBe(false)
  })

  it('builds a list query schema with filter + pagination + sort', () => {
    const schema = createListQuerySchema({
      defaultSort: 'name:asc',
      fields: ['name', 'calories'] as const,
      filters: z.object({
        q: z.string().optional()
      })
    })

    const parsed = schema.parse({
      limit: '12',
      offset: '24',
      sort: 'calories:desc'
    })

    expect(parsed.limit).toBe(12)
    expect(parsed.offset).toBe(24)
    expect(parsed.sort).toBe('calories:desc')
  })
})
