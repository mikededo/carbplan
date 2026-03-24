import type { ResultAsync } from 'neverthrow'

import type { CatalogListPageResult, CatalogProductsListQuery, CatalogQueryValidationError } from '$modules/public/catalog/model'
import type { PublicCatalogRepository } from '$modules/public/catalog/repository'

export type PublicCatalogService = {
  getCatalogProducts: (query: CatalogProductsListQuery) => ResultAsync<CatalogListPageResult, CatalogQueryValidationError | unknown>
}

export class PublicCatalogServiceImpl implements PublicCatalogService {
  constructor(private readonly repository: PublicCatalogRepository) { }

  getCatalogProducts(query: CatalogProductsListQuery): ResultAsync<CatalogListPageResult, CatalogQueryValidationError | unknown> {
    return this.repository.listCatalogProducts(query)
  }
}
