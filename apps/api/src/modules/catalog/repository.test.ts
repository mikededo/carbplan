import type {
  CreateBrandData,
  CreateBrandDataResult,
  CreateProductData,
  CreateProductDataResult,
  UpdateBrandData,
  UpdateProductData
} from '$modules/catalog/model'

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

  describe('.updateBrand', () => {
    const model: UpdateBrandData = { name: 'Brand' }

    it('updates a new brand', async () => {
      const id = crypto.randomUUID()
      const dbMock = createRepositoryDbMock()
      dbMock.queueResult([{ id, name: 'Brand' }])
      const repository = new DbCatalogRepository(dbMock.db)

      await expect(repository.updateBrand(id, model)).toBeOkAsyncWith(true)
    })

    entityNotFoundTest(
      DbCatalogRepository,
      (repository) => repository.updateBrand(crypto.randomUUID(), model)
    )
  })

  describe('.createProduct', () => {
    const model: Required<CreateProductData> = {
      brandId: crypto.randomUUID(),
      caffeineMg: 80,
      calories: 100,
      carbsG: 20,
      fatG: 0,
      flavor: 'citrus',
      form: 'gel',
      isActive: true,
      name: 'Test product',
      notes: 'Test notes',
      proteinG: 0,
      servingSize: 60,
      servingsPerPackage: 1,
      servingUnit: 'g',
      slug: 'test-product',
      sodiumMg: 200,
      sugarG: 10
    }
    const result: CreateProductDataResult = {
      ...model,
      createdAt: new Date(),
      id: 'product-id',
      updatedAt: new Date()
    }

    it('creates a new product', async () => {
      const dbMock = createRepositoryDbMock()
      dbMock.queueResult([result])
      const repository = new DbCatalogRepository(dbMock.db)

      await expect(repository.createProduct(model)).toBeOkAsyncWith(result)
    })

    entityNotFoundTest(
      DbCatalogRepository,
      (repository) => repository.createProduct(model)
    )
  })

  describe('.updateProduct', () => {
    const model: UpdateProductData = { name: 'Updated product' }

    it('updates a product', async () => {
      const id = crypto.randomUUID()
      const dbMock = createRepositoryDbMock()
      dbMock.queueResult([{ id, name: 'Updated product' }])
      const repository = new DbCatalogRepository(dbMock.db)

      await expect(repository.updateProduct(id, model)).toBeOkAsyncWith(true)
    })

    entityNotFoundTest(
      DbCatalogRepository,
      (repository) => repository.updateProduct(crypto.randomUUID(), model)
    )
  })
})
