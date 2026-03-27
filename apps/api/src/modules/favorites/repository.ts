import type { AthleteId, Db } from '@carbplan/db'

import type { FavoriteProductWithBrand } from '$modules/favorites/model'
import type { DatabaseQueryError } from '$utils/db-error'

import { athletes, brands, favoriteProducts, products } from '@carbplan/db'
import { and, eq } from 'drizzle-orm'
import { ok, ResultAsync } from 'neverthrow'

import { mapDbError } from '$utils/db-error'

export type AthleteFavoritesRepository = {
  listFavoriteProductsWithBrands: (athleteId: AthleteId) => ResultAsync<FavoriteProductWithBrand[], DatabaseQueryError>
}

export class DbAthleteFavoritesRepository implements AthleteFavoritesRepository {
  constructor(private readonly db: Db) { }

  listFavoriteProductsWithBrands(athleteId: AthleteId): ResultAsync<FavoriteProductWithBrand[], DatabaseQueryError> {
    return ResultAsync.fromPromise(
      this.db
        .select()
        .from(products)
        .leftJoin(favoriteProducts, eq(favoriteProducts.productId, products.id))
        .leftJoin(athletes, eq(athletes.id, favoriteProducts.athleteId))
        .leftJoin(brands, eq(brands.id, products.brandId))
        .where(and(eq(athletes.id, athleteId), eq(products.isActive, true))),
      mapDbError
    ).andThen((rows) => {
      const parsed = rows.reduce((acc: FavoriteProductWithBrand[], row) => {
        if (!row.products || !row.brands) {
          return acc
        }

        acc.push({
          brand: {
            id: row.brands.id,
            logoUrl: row.brands.logoUrl,
            name: row.brands.name,
            slug: row.brands.slug
          },
          isFavorite: true,
          ...row.products
        })
        return acc
      }, [])

      return ok(parsed)
    })
  }
}
