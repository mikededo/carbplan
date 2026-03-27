import type { AthleteId } from '@carbplan/db'
import type { ResultAsync } from 'neverthrow'

import type { FavoriteProductsListResponse } from '$modules/favorites/model'
import type { AthleteFavoritesRepository } from '$modules/favorites/repository'
import type { DatabaseQueryError } from '$utils/db-error'

export type AthleteFavoritesService = {
  getAllFavoriteProducts: (id: AthleteId) => ResultAsync<FavoriteProductsListResponse, DatabaseQueryError>
}

export class AthletesFavoritesServiceImpl implements AthleteFavoritesService {
  constructor(private readonly repository: AthleteFavoritesRepository) { }

  getAllFavoriteProducts(id: AthleteId): ResultAsync<FavoriteProductsListResponse, DatabaseQueryError> {
    return this.repository.listFavoriteProductsWithBrands(id)
  }
}
