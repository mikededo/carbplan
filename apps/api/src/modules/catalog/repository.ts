import type { BrandId, Db } from '@carbplan/db'

import type { CreateBrandData, CreateBrandDataResult, CreateBrandError, UpdateBrandData, UpdateBrandError } from '$modules/catalog/model'

import { brands } from '@carbplan/db'
import { eq } from 'drizzle-orm'
import { head } from 'es-toolkit'
import { err, ok, ResultAsync } from 'neverthrow'

import { EntityNotFound, EntityNotInserted, mapDbError } from '$utils/db-error'

export type CatalogRepository = {
  createBrand: (data: CreateBrandData) => ResultAsync<CreateBrandDataResult, CreateBrandError>
  updateBrand: (brandId: BrandId, data: UpdateBrandData) => ResultAsync<boolean, UpdateBrandError>
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

  updateBrand(id: BrandId, data: UpdateBrandData): ResultAsync<boolean, UpdateBrandError> {
    return ResultAsync.fromPromise(
      this.db.update(brands).set(data).where(eq(brands.id, id)),
      mapDbError
    ).map(() => true).mapErr(() => EntityNotFound.withEntityName('Brand'))
  }
}
