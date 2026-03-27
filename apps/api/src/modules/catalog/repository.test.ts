import type { CreateBrandData, CreateBrandDataResult } from '$modules/catalog/model'

import { createRepositoryDbMock } from '@carbplan/auth/testing'

import { DbCatalogRepository } from '$modules/catalog/repository'
import { entityNotFoundTest } from '$test/utils.test'

describe('catalog repository', () => {
  describe('.createBrand', () => {
    const model: Required<CreateBrandData> = {
      description: 'Test brand',
      isActive: true,
      logoUrl: 'https://example.com/logo.png',
      name: 'Brand',
      slug: 'brand',
      website: 'https://example.com'
    }
    const result: CreateBrandDataResult = {
      ...model,
      createdAt: new Date(),
      id: 'brand-id',
      updatedAt: new Date()
    }

    it('creates a new brand', async () => {
      const dbMock = createRepositoryDbMock()
      dbMock.queueResult([result])
      const repository = new DbCatalogRepository(dbMock.db)

      await expect(repository.createBrand(model)).toBeOkAsyncWith(result)
    })

    entityNotFoundTest(
      DbCatalogRepository,
      (repository) => repository.createBrand(model)
    )
  })
})
