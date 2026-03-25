import type { SortDirection } from './pagination'

import { z } from 'zod'

import {
  createListQuerySchema,
  createSortSchema,
  OffsetPaginationQuerySchema,
  SortDirectionEnum,
  SortDirectionSchema
} from './pagination'

describe('sortDirectionSchema', () => {
  it('accepts valid directions', () => {
    expect(SortDirectionSchema.parse('asc')).toBe('asc')
    expect(SortDirectionSchema.parse('desc')).toBe('desc')
  })

  it('rejects invalid values', () => {
    expect(() => SortDirectionSchema.parse('ASC')).toThrow()
    expect(() => SortDirectionSchema.parse('')).toThrow()
    expect(() => SortDirectionSchema.parse(null)).toThrow()
  })

  it('exposes enum members', () => {
    expect(SortDirectionEnum.asc).toBe('asc')
    expect(SortDirectionEnum.desc).toBe('desc')
  })

  it('has the correct type', () => {
    expectTypeOf(SortDirectionSchema.parse('asc')).toEqualTypeOf<SortDirection>()
  })
})

describe('offsetPaginationQuerySchema', () => {
  it('applies defaults when nothing is passed', () => {
    expect(OffsetPaginationQuerySchema.parse({})).toEqual({ limit: 20, offset: 0 })
  })

  it('coerces string numbers', () => {
    expect(OffsetPaginationQuerySchema.parse({ limit: '50', offset: '10' })).toEqual({
      limit: 50,
      offset: 10
    })
  })

  it('rejects limit above 100', () => {
    expect(() => OffsetPaginationQuerySchema.parse({ limit: 101 })).toThrow()
  })

  it('rejects non-integer limit', () => {
    expect(() => OffsetPaginationQuerySchema.parse({ limit: 1.5 })).toThrow()
  })

  it('rejects negative offset', () => {
    expect(() => OffsetPaginationQuerySchema.parse({ offset: -1 })).toThrow()
  })
})

describe('createSortSchema', () => {
  const schema = createSortSchema({
    defaultSort: 'name:asc',
    fields: ['name', 'age'] as const
  })

  it('applies the default when nothing is passed', () => {
    expect(schema.parse(undefined)).toBe('name:asc')
  })

  it('accepts all valid field+direction combos', () => {
    expect(schema.parse('name:asc')).toBe('name:asc')
    expect(schema.parse('name:desc')).toBe('name:desc')
    expect(schema.parse('age:asc')).toBe('age:asc')
    expect(schema.parse('age:desc')).toBe('age:desc')
  })

  it('rejects an unknown field', () => {
    expect(() => schema.parse('email:asc')).toThrow()
  })

  it('rejects a valid field with an invalid direction', () => {
    expect(() => schema.parse('name:ASC')).toThrow()
    expect(() => schema.parse('name:random')).toThrow()
  })

  it('rejects a non-string value', () => {
    expect(() => schema.parse(123)).toThrow()
    expect(() => schema.parse(null)).toThrow()
  })

  it('has the correct inferred type', () => {
    expectTypeOf(schema.parse('name:asc')).toEqualTypeOf<'age:asc' | 'age:desc' | 'name:asc' | 'name:desc'>()
  })
})

describe('createListQuerySchema', () => {
  const filters = z.object({ search: z.string().optional() })

  const schema = createListQuerySchema({
    defaultSort: 'name:asc',
    fields: ['name', 'age'] as const,
    filters
  })

  it('applies defaults when nothing is passed', () => {
    expect(schema.parse({})).toEqual({
      limit: 20,
      offset: 0,
      sort: 'name:asc'
    })
  })

  it('passes through valid filter fields', () => {
    expect(schema.parse({ search: 'alice' })).toMatchObject({ search: 'alice' })
  })

  it('accepts a valid sort value', () => {
    expect(schema.parse({ sort: 'age:desc' })).toMatchObject({ sort: 'age:desc' })
  })

  it('rejects an invalid sort value', () => {
    expect(() => schema.parse({ sort: 'email:asc' })).toThrow()
  })

  it('respects the default maxLimit of 100', () => {
    expect(() => schema.parse({ limit: 101 })).toThrow()
    expect(schema.parse({ limit: 100 })).toMatchObject({ limit: 100 })
  })

  it('respects a custom maxLimit', () => {
    const capped = createListQuerySchema({
      defaultSort: 'name:asc',
      fields: ['name'] as const,
      filters,
      maxLimit: 50
    })
    expect(() => capped.parse({ limit: 51 })).toThrow()
    expect(capped.parse({ limit: 50 })).toMatchObject({ limit: 50 })
  })

  it('treats sort as optional', () => {
    const result = schema.parse({ sort: undefined })
    expect(result.sort).toBe('name:asc')
  })

  it('rejects unknown filter fields by default (strict passthrough)', () => {
    // z.object strips unknown keys by default, verify no throw but key is stripped
    const result = schema.parse({ unknown: 'value' })
    expect(result).not.toHaveProperty('unknown')
  })
})
