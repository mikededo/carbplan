import type { AthleteId } from '@carbplan/db'

import type { FavoriteProductsListResponse } from '$modules/favorites/model'
import type { AthleteFavoritesRepository } from '$modules/favorites/repository'
import type { DatabaseQueryError } from '$utils/db-error'

import { ResultAsync } from 'neverthrow'

import { mapDbError } from '$utils/db-error'

export type AthleteFavoritesService = {
  getAllFavoriteProducts: (id: AthleteId) => ResultAsync<FavoriteProductsListResponse, DatabaseQueryError>
}

export class AthletesFavoritesServiceImpl implements AthleteFavoritesService {
  constructor(private readonly repository: AthleteFavoritesRepository) { }

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
