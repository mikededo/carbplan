import type { Brand, Product } from '@carbplan/db'

export type ProductWithBrand = {
  brand: Pick<Brand, 'id' | 'logoUrl' | 'name' | 'slug'>
} & Product
export type FavoriteProductWithBrand = {
  isFavorite: true
} & ProductWithBrand

export type FavoriteProductsListResponse = FavoriteProductWithBrand[]
