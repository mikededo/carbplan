
import { createRepositoryDbMock } from '@carbplan/auth/testing'
import { describe, expect, it } from 'vitest'

import { DatabaseQueryError } from '$utils/db-error'

import { DbPublicCatalogRepository } from './repository'

const baseRow = {
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
  form: 'gel' as const,
  id: crypto.randomUUID(),
  name: 'Gel One',
  proteinG: 0,
  servingSize: 60,
  servingsPerPackage: 1,
  servingUnit: 'g',
  slug: 'gel-one',
  sodiumMg: 50,
  sugarG: 20
}

describe('public catalog repository', () => {
  it('returns a paginated response envelope with total', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueResult([baseRow])
    dbMock.queueResult([{ total: 2 }])
    const repository = new DbPublicCatalogRepository(dbMock.db)

    const result = await repository.listCatalogProducts({
      limit: 1,
      offset: 0,
      sort: 'name:asc'
    })
    expect(result.isOk()).toBe(true)
    const value = result._unsafeUnwrap()

    expect(value.data).toHaveLength(1)
    expect(value.meta).toEqual({
      limit: 1,
      offset: 0,
      total: 2
    })
  })

  it('applies offset pagination to list queries', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueResult([baseRow])
    dbMock.queueResult([{ total: 10 }])
    const repository = new DbPublicCatalogRepository(dbMock.db)

    const result = await repository.listCatalogProducts({
      limit: 5,
      offset: 5,
      sort: 'name:asc'
    })
    expect(result.isOk()).toBe(true)
    const value = result._unsafeUnwrap()

    expect(value.data).toHaveLength(1)
    expect(value.meta).toEqual({
      limit: 5,
      offset: 5,
      total: 10
    })
  })

  it('propagates db failures', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueError(new Error('db failed'))
    const repository = new DbPublicCatalogRepository(dbMock.db)

    const result = await repository.listCatalogProducts({
      limit: 20,
      offset: 0,
      sort: 'name:asc'
    })

    expect(result.isErr()).toBe(true)
    const error = result._unsafeUnwrapErr()
    expect(error).toBeInstanceOf(DatabaseQueryError)
    expect(error.code).toBe('UNKNOWN_DB_ERROR')
    expect(error.cause).toEqual(expect.objectContaining({ message: 'db failed' }))
  })
})
