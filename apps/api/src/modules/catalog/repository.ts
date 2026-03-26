import type { Db } from '@carbplan/db'

import type { CreateBrandData, CreateBrandDataResult, CreateBrandError } from '$modules/catalog/model'

import { brands } from '@carbplan/db'
import { head } from 'es-toolkit'
import { err, ok, ResultAsync } from 'neverthrow'

import { EntityNotInserted, mapDbError } from '$utils/db-error'

export type CatalogRepository = {
  createBrand: (data: CreateBrandData) => ResultAsync<CreateBrandDataResult, CreateBrandError>
}

export class DbCatalogRepository implements CatalogRepository {
  constructor(private readonly db: Db) { }

  createBrand(data: CreateBrandData): ResultAsync<CreateBrandDataResult, CreateBrandError> {
    return ResultAsync.fromPromise(
      this.db.insert(brands).values(data).returning(),
      mapDbError
    ).andThen((result) => {
      const item = head(result)
      return item ? ok(item) : err(EntityNotInserted.withEntityName('Brand'))
    })
  }
}
