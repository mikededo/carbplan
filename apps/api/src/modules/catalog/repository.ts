import type { BrandId, Db, ProductId } from '@carbplan/db'

import type {
  CreateBrandData,
  CreateBrandDataResult,
  CreateBrandError,
  CreateProductData,
  CreateProductDataResult,
  CreateProductError,
  UpdateBrandData,
  UpdateBrandError,
  UpdateProductData,
  UpdateProductError
} from '$modules/catalog/model'

import { brands, products } from '@carbplan/db'
import { and, eq } from 'drizzle-orm'
import { head } from 'es-toolkit'
import { err, ok, ResultAsync } from 'neverthrow'

import { EntityNotInserted, mapDbError } from '$utils/db-error'

export type CatalogRepository = {
  createBrand: (data: CreateBrandData) => ResultAsync<CreateBrandDataResult, CreateBrandError>
  createProduct: (data: CreateProductData) => ResultAsync<CreateProductDataResult, CreateProductError>
  updateBrand: (brandId: BrandId, data: UpdateBrandData) => ResultAsync<boolean, UpdateBrandError>
  updateProduct: (brandId: ProductId, data: UpdateProductData) => ResultAsync<boolean, UpdateProductError>
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

  createProduct(data: CreateProductData): ResultAsync<CreateProductDataResult, CreateProductError> {
    return ResultAsync.fromPromise(
      this.db.insert(products).values(data).returning(),
      mapDbError
    ).andThen((result) => {
      const item = head(result)
      return item ? ok(item) : err(EntityNotInserted.withEntityName('Product'))
    })
  }

  updateBrand(id: BrandId, data: UpdateBrandData): ResultAsync<boolean, UpdateBrandError> {
    return ResultAsync.fromPromise(
      this.db.update(brands).set(data).where(eq(brands.id, id)).returning(),
      mapDbError
    ).andThen((result) => {
      const item = head(result)
      return item ? ok(true) : err(EntityNotInserted.withEntityName('Brand'))
    })
  }

  updateProduct(id: ProductId, data: UpdateProductData): ResultAsync<boolean, UpdateProductError> {
    return ResultAsync.fromPromise(
      this.db.update(products).set(data).where(and(eq(products.id, id), eq(brands.id, data.brandId))).returning(),
      mapDbError
    ).andThen((result) => {
      const item = head(result)
      return item ? ok(true) : err(EntityNotInserted.withEntityName('Product'))
    })
  }
}
