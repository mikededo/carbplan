import type { ResultAsync } from 'neverthrow'

import type { CreateBrandData, CreateBrandDataResult, CreateBrandError } from '$modules/catalog/model'
import type { CatalogRepository } from '$modules/catalog/repository'

export type CatalogService = {
  createBrand: (data: CreateBrandData) => ResultAsync<CreateBrandDataResult, CreateBrandError>
}

export class CatalogServiceImpl implements CatalogService {
  constructor(private readonly repository: CatalogRepository) { }

  createBrand(data: CreateBrandData): ResultAsync<CreateBrandDataResult, CreateBrandError> {
    return this.repository.createBrand(data)
  }
}
