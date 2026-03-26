import type { ProductWithBrand } from '$modules/catalog/model'

export type FavoriteProductWithBrand = {
  isFavorite: true
} & ProductWithBrand

export type FavoriteProductsListResponse = FavoriteProductWithBrand[]
