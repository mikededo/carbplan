import type { AthleteId } from '@carbplan/db'

import type { FavoriteProductsListResponse } from '$modules/products/model'
import type { ProductRepository } from '$modules/products/repository'

import { ResultAsync } from 'neverthrow'

export type ProductService = {
  getAllFavoriteProducts: (id: AthleteId) => ResultAsync<FavoriteProductsListResponse, unknown>
}

export class ProductServiceImpl implements ProductService {
  constructor(private readonly repository: ProductRepository) { }

  getAllFavoriteProducts(id: AthleteId): ResultAsync<FavoriteProductsListResponse, unknown> {
    return ResultAsync.fromPromise(
      this.getAllFavoriteProductsFromRepository(id),
      () => null
    )
  }

  private async getAllFavoriteProductsFromRepository(id: AthleteId): Promise<FavoriteProductsListResponse> {
    return await this.repository.listFavoriteProductsWithBrands(id)
  }
}
