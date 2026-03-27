
import { createRepositoryDbMock } from '@carbplan/auth/testing'
import { describe, expect, it } from 'vitest'

import { DbPublicCatalogRepository } from '$modules/public/catalog/repository'
import { DatabaseErrorCodeEnum, DatabaseQueryError } from '$utils/db-error'

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

    await expect(
      repository.listCatalogProducts({ limit: 1, offset: 0, sort: 'name:asc' })
    ).toBeOkAsyncWith({
      data: expect.any(Array),
      meta: { limit: 1, offset: 0, total: 2 }
    })
  })

  it('applies offset pagination to list queries', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueResult([baseRow])
    dbMock.queueResult([{ total: 10 }])
    const repository = new DbPublicCatalogRepository(dbMock.db)

    await expect(
      repository.listCatalogProducts({ limit: 5, offset: 5, sort: 'name:asc' })
    ).toBeOkAsyncWith({
      data: expect.any(Array),
      meta: { limit: 5, offset: 5, total: 10 }
    })
  })

  it('propagates db failures', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueError(new Error('db failed'))
    const repository = new DbPublicCatalogRepository(dbMock.db)

    await expect(
      repository.listCatalogProducts({ limit: 20, offset: 0, sort: 'name:asc' })
    ).toBeErrAsyncWith(
      new DatabaseQueryError({ cause: new Error('db failed'), code: DatabaseErrorCodeEnum.UNKNOWN, message: 'db failed' })
    )
  })
})
