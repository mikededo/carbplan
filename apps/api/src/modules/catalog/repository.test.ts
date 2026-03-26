import type { CreateBrandData } from '$modules/catalog/model'

import { createRepositoryDbMock } from '@carbplan/auth/testing'

import { DbCatalogRepository } from '$modules/catalog/repository'
import { entityNotFoundTest } from '$test/utils.test'

describe('catalog repository', () => {
  describe('.createBrand', () => {
    const model: CreateBrandData = {
      description: 'Test brand',
      isActive: true,
      logoUrl: 'https://example.com/logo.png',
      name: 'Brand',
      slug: 'brand',
      website: 'https://example.com'
    }

    it('creates a new brand', async () => {
      const dbMock = createRepositoryDbMock()
      dbMock.queueResult([model])
      const repository = new DbCatalogRepository(dbMock.db)

      const result = await repository.createBrand(model)
      expect(result._unsafeUnwrap()).toBeTruthy()
    })

    entityNotFoundTest(
      DbCatalogRepository,
      (repository) => repository.createBrand(model)
    )
  })
})
