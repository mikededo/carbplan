import type { ProductForm } from '@carbplan/domain/product'

export type BrandSeedInput = {
  description: null | string
  name: string
  slug: string
  website: null | string
}

export type ProductSeedInput = {
  brandSlug: string
  caffeineMg: null | number
  calories: null | number
  carbsG: null | number
  fatG: null | number
  flavor: null | string
  form: ProductForm
  name: string
  notes: null | string
  proteinG: null | number
  servingSize: number
  servingUnit: string
  servingsPerPackage: null | number
  slug: string
  sodiumMg: null | number
  sugarG: null | number
}
