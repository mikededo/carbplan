import type { Brand, BrandId, Product, ProductId } from '@carbplan/db'
import type { ProductForm } from '@carbplan/domain/product'

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
  id: BrandId
  isActive: boolean
  logoUrl: null | string
  name: string
  slug: string
  updatedAt: Date | null
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

export type CreateProductData = {
  brandId: BrandId
  caffeineMg?: number
  calories?: number
  carbsG?: number
  fatG?: number
  flavor?: string
  form: ProductForm
  isActive: boolean
  name: string
  notes?: string
  proteinG?: number
  servingSize: number
  servingsPerPackage?: number
  servingUnit: string
  slug: string
  sodiumMg?: number
  sugarG?: number
}
export type CreateProductDataResult = {
  id: ProductId
  brandId: BrandId
  caffeineMg: null | number
  createdAt: Date
  updatedAt: Date | null
  calories: null | number
  carbsG: null | number
  fatG: null | number
  flavor: null | string
  form: ProductForm
  isActive: boolean
  name: string
  notes: null | string
  proteinG: null | number
  servingSize: number
  servingsPerPackage: null | number
  servingUnit: string
  slug: string
  sodiumMg: null | number
  sugarG: null | number
}
export type CreateProductError = DatabaseQueryError | EntityNotInserted

export type UpdateProductData = {
  caffeineMg?: number
  calories?: number
  carbsG?: number
  fatG?: number
  flavor?: string
  form?: ProductForm
  name?: string
  notes?: string
  proteinG?: number
  servingSize?: number
  servingsPerPackage?: number
  servingUnit?: string
  slug?: string
  sodiumMg?: number
  sugarG?: number
  isActive?: boolean
}
export type UpdateProductError = DatabaseQueryError | EntityNotFound
