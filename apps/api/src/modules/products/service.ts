import type * as ProductsContract from '@carbplan/contracts/products'
import type { AthleteId, Db } from '@carbplan/db'

import { athletes, brands, favoriteProducts, products } from '@carbplan/db'
import { and, eq } from 'drizzle-orm'
import { ResultAsync } from 'neverthrow'

export type ProductService = {
  getAllFavoriteProducts: (id: AthleteId) => ResultAsync<ProductsContract.FavoriteProductsListResponse, unknown>
}

export class DbProductService implements ProductService {
  constructor(private readonly db: Db) { }

  getAllFavoriteProducts(id: AthleteId): ResultAsync<ProductsContract.FavoriteProductsListResponse, unknown> {
    return ResultAsync.fromPromise<ProductsContract.FavoriteProductsListResponse, unknown>(
      this.getAllFavoriteProductsPromise(id),
      () => null
    )
  }

  private async getAllFavoriteProductsPromise(id: AthleteId) {
    const result = await this.db.select()
      .from(products)
      .leftJoin(favoriteProducts, eq(favoriteProducts.productId, products.id))
      .leftJoin(athletes, eq(athletes.id, favoriteProducts.athleteId))
      .leftJoin(brands, eq(brands.id, products.brandId))
      .where(and(eq(athletes.id, id), eq(products.isActive, true)))

    return result.reduce((agg: ProductsContract.FavoriteProductsListResponse, { brands, products }) => {
      if (!brands || !products) {
        return agg
      }

      agg.push({
        ...products,
        brandId: brands.id,
        brandLogoUrl: brands.logoUrl,
        brandName: brands.name,
        brandSlug: brands.slug,
        isFavorite: true
      })
      return agg
    }, [])
  }
}
