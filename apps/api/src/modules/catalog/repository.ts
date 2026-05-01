import type { BrandId, Db, ProductId } from '@carbplan/db'

import type {
  CreateBrandData,
  CreateBrandDataResult,
  CreateBrandError,
  CreateProductData,
  CreateProductDataResult,
  CreateProductError,
  CatalogBrand,
  ListCatalogError,
  UpdateBrandData,
  UpdateBrandError,
  UpdateProductData,
  UpdateProductError
} from '$modules/catalog/model'

import { brands, products } from '@carbplan/db'
import { eq } from 'drizzle-orm'
import { head } from 'es-toolkit'
import { err, ok, ResultAsync } from 'neverthrow'

import { EntityNotFound, EntityNotInserted, mapDbError } from '$utils/db-error'

export type CatalogRepository = {
  createBrand: (data: CreateBrandData) => ResultAsync<CreateBrandDataResult, CreateBrandError>
  createProduct: (data: CreateProductData) => ResultAsync<CreateProductDataResult, CreateProductError>
  listCatalog: () => ResultAsync<CatalogBrand[], ListCatalogError>
  updateBrand: (brandId: BrandId, data: UpdateBrandData) => ResultAsync<boolean, UpdateBrandError>
  updateProduct: (productId: ProductId, data: UpdateProductData) => ResultAsync<boolean, UpdateProductError>
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

  listCatalog(): ResultAsync<CatalogBrand[], ListCatalogError> {
    return ResultAsync.fromPromise(
      Promise.all([
        this.db.select().from(brands).where(eq(brands.isActive, true)).orderBy(brands.name),
        this.db.select().from(products).where(eq(products.isActive, true)).orderBy(products.name)
      ]),
      mapDbError
    ).map(([brandRows, productRows]) => brandRows.map((brand) => ({
      ...brand,
      products: productRows.filter((product) => product.brandId === brand.id)
    })))
  }

  updateBrand(id: BrandId, data: UpdateBrandData): ResultAsync<boolean, UpdateBrandError> {
    return ResultAsync.fromPromise(
      this.db.update(brands).set(data).where(eq(brands.id, id)).returning(),
      mapDbError
    ).andThen((result) => {
      const item = head(result)
      return item ? ok(true) : err(EntityNotFound.withEntityName('Brand'))
    })
  }

  updateProduct(id: ProductId, data: UpdateProductData): ResultAsync<boolean, UpdateProductError> {
    return ResultAsync.fromPromise(
      this.db.update(products).set(data).where(eq(products.id, id)).returning(),
      mapDbError
    ).andThen((result) => {
      const item = head(result)
      return item ? ok(true) : err(EntityNotFound.withEntityName('Product'))
    })
  }
}
