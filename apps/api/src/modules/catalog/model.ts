import type { Brand, Product } from '@carbplan/db'

import type { DatabaseQueryError, EntityNotFound, EntityNotInserted } from '$utils/db-error'

export type ProductWithBrand = {
  brand: Pick<Brand, 'id' | 'logoUrl' | 'name' | 'slug'>
} & Product

export type CreateBrandData = {
  description?: string
  isActive?: boolean
  logoUrl?: string
  name: string
  slug: string
  website?: string
}
export type CreateBrandDataResult = {
  createdAt: Date
  description: null | string
  id: string
  isActive: boolean
  logoUrl: null | string
  name: string
  slug: string
  updatedAt: Date
  website: null | string
}
export type CreateBrandError = DatabaseQueryError | EntityNotInserted

export type UpdateBrandData = {
  description?: string
  isActive?: boolean
  logoUrl?: string
  name?: string
  slug?: string
  website?: string
}
export type UpdateBrandError = DatabaseQueryError | EntityNotFound
