import type { ResultAsync } from 'neverthrow'

import type { CatalogListPageResult, CatalogProductsListQuery, CatalogQueryValidationError } from '$modules/public/catalog/model'
import type { PublicCatalogRepository } from '$modules/public/catalog/repository'
import type { DatabaseQueryError } from '$utils/db-error'

export type PublicCatalogService = {
  getCatalogProducts: (query: CatalogProductsListQuery) => ResultAsync<CatalogListPageResult, CatalogQueryValidationError | DatabaseQueryError>
}

export class PublicCatalogServiceImpl implements PublicCatalogService {
  constructor(private readonly repository: PublicCatalogRepository) { }

  getCatalogProducts(query: CatalogProductsListQuery): ResultAsync<CatalogListPageResult, CatalogQueryValidationError | DatabaseQueryError> {
    return this.repository.listCatalogProducts(query)
  }
}
