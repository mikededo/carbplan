import type { CatalogListPageResult, CatalogProductsListQuery } from '$modules/public/catalog/model'
import type { PublicCatalogRepository } from '$modules/public/catalog/repository'

import { okAsync } from 'neverthrow'

import { PublicCatalogServiceImpl } from '$modules/public/catalog/service'

describe('public catalog service', () => {
  it('delegates list query to repository', async () => {
    const repository: PublicCatalogRepository = {
      listCatalogProducts: vi.fn(() => okAsync<CatalogListPageResult>({
        data: [],
        meta: { limit: 20, offset: 0, total: 0 }
      }))
    }
    const service = new PublicCatalogServiceImpl(repository)
    const query: CatalogProductsListQuery = {
      limit: 20,
      offset: 0,
      sort: 'name:asc'
    }

    const result = await service.getCatalogProducts(query)

    expect(result._unsafeUnwrap()).toEqual({
      data: [],
      meta: { limit: 20, offset: 0, total: 0 }
    })
    expect(repository.listCatalogProducts).toHaveBeenCalledWith(query)
  })
})
