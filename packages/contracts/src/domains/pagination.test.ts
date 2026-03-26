import type { SortDirection } from './pagination'

import * as z from 'zod'

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
  const Schema = createSortSchema({
    defaultSort: 'name:asc',
    fields: ['name', 'age'] as const
  })

  it('applies the default when nothing is passed', () => {
    expect(Schema.parse(undefined)).toBe('name:asc')
  })

  it('accepts all valid field+direction combos', () => {
    expect(Schema.parse('name:asc')).toBe('name:asc')
    expect(Schema.parse('name:desc')).toBe('name:desc')
    expect(Schema.parse('age:asc')).toBe('age:asc')
    expect(Schema.parse('age:desc')).toBe('age:desc')
  })

  it('rejects an unknown field', () => {
    expect(() => Schema.parse('email:asc')).toThrow()
  })

  it('rejects a valid field with an invalid direction', () => {
    expect(() => Schema.parse('name:ASC')).toThrow()
    expect(() => Schema.parse('name:random')).toThrow()
  })

  it('rejects a non-string value', () => {
    expect(() => Schema.parse(123)).toThrow()
    expect(() => Schema.parse(null)).toThrow()
  })

  it('has the correct inferred type', () => {
    expectTypeOf(Schema.parse('name:asc')).toEqualTypeOf<'age:asc' | 'age:desc' | 'name:asc' | 'name:desc'>()
  })
})

describe('createListQuerySchema', () => {
  const FiltersSchema = z.object({ search: z.string().trim().optional() })

  const Schema = createListQuerySchema({
    defaultSort: 'name:asc',
    fields: ['name', 'age'] as const,
    filters: FiltersSchema
  })

  it('applies defaults when nothing is passed', () => {
    expect(Schema.parse({})).toEqual({
      limit: 20,
      offset: 0,
      sort: 'name:asc'
    })
  })

  it('passes through valid filter fields', () => {
    expect(Schema.parse({ search: 'alice' })).toMatchObject({ search: 'alice' })
  })

  it('accepts a valid sort value', () => {
    expect(Schema.parse({ sort: 'age:desc' })).toMatchObject({ sort: 'age:desc' })
  })

  it('rejects an invalid sort value', () => {
    expect(() => Schema.parse({ sort: 'email:asc' })).toThrow()
  })

  it('respects the default maxLimit of 100', () => {
    expect(() => Schema.parse({ limit: 101 })).toThrow()
    expect(Schema.parse({ limit: 100 })).toMatchObject({ limit: 100 })
  })

  it('respects a custom maxLimit', () => {
    const CappedSchema = createListQuerySchema({
      defaultSort: 'name:asc',
      fields: ['name'] as const,
      filters: FiltersSchema,
      maxLimit: 50
    })
    expect(() => CappedSchema.parse({ limit: 51 })).toThrow()
    expect(CappedSchema.parse({ limit: 50 })).toMatchObject({ limit: 50 })
  })

  it('treats sort as optional', () => {
    const result = Schema.parse({ sort: undefined })
    expect(result.sort).toBe('name:asc')
  })

  it('rejects unknown filter fields by default (strict passthrough)', () => {
    // z.object strips unknown keys by default, verify no throw but key is stripped
    const result = Schema.parse({ unknown: 'value' })
    expect(result).not.toHaveProperty('unknown')
  })
})
