import type { Brand, Product } from '@carbplan/db'

export type ProductWithBrand = {
  brand: Pick<Brand, 'id' | 'logoUrl' | 'name' | 'slug'>
} & Product
