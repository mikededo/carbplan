import type { AthleteId, Db } from '@carbplan/db'

import type { FavoriteProductWithBrand } from '$modules/products/model'

import { athletes, brands, favoriteProducts, products } from '@carbplan/db'
import { and, eq } from 'drizzle-orm'

export type ProductRepository = {
  listFavoriteProductsWithBrands: (athleteId: AthleteId) => Promise<FavoriteProductWithBrand[]>
}

export class DbProductRepository implements ProductRepository {
  constructor(private readonly db: Db) { }

  async listFavoriteProductsWithBrands(athleteId: AthleteId): Promise<FavoriteProductWithBrand[]> {
    const rows = await this.db
      .select()
      .from(products)
      .leftJoin(favoriteProducts, eq(favoriteProducts.productId, products.id))
      .leftJoin(athletes, eq(athletes.id, favoriteProducts.athleteId))
      .leftJoin(brands, eq(brands.id, products.brandId))
      .where(and(eq(athletes.id, athleteId), eq(products.isActive, true)))

    return rows.reduce((acc: FavoriteProductWithBrand[], row) => {
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
  }
}
