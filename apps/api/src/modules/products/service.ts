import type { AthleteId } from '@carbplan/db'

import type { FavoriteProductsListResponse } from '$modules/products/model'
import type { ProductRepository } from '$modules/products/repository'
import type { DatabaseQueryError } from '$utils/db-error'

import { ResultAsync } from 'neverthrow'

import { mapDbError } from '$utils/db-error'

export type ProductService = {
  getAllFavoriteProducts: (id: AthleteId) => ResultAsync<FavoriteProductsListResponse, DatabaseQueryError>
}

export class ProductServiceImpl implements ProductService {
  constructor(private readonly repository: ProductRepository) { }

  getAllFavoriteProducts(id: AthleteId): ResultAsync<FavoriteProductsListResponse, DatabaseQueryError> {
    return ResultAsync.fromPromise(
      this.getAllFavoriteProductsFromRepository(id),
      mapDbError
    )
  }

  private async getAllFavoriteProductsFromRepository(id: AthleteId): Promise<FavoriteProductsListResponse> {
    return await this.repository.listFavoriteProductsWithBrands(id)
  }
}
