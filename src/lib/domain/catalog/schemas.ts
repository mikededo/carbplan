import * as v from 'valibot'

import { ProductForm } from '$lib/database/types.g'

/**
 * Generates a URL-friendly slug from a string.
 * Converts to lowercase, removes special characters, and replaces spaces with hyphens.
 */
export const generateSlug = (input: string): string =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

export const BrandSchema = v.object({
  description: v.optional(v.pipe(
    v.string(),
    v.maxLength(500, 'Description must be at most 500 characters')
  )),
  logoUrl: v.optional(v.pipe(
    v.string(),
    v.url('Please enter a valid URL')
  )),
  name: v.pipe(
    v.string(),
    v.minLength(1, 'Brand name is required'),
    v.maxLength(100, 'Brand name must be at most 100 characters')
  ),
  slug: v.pipe(
    v.string(),
    v.minLength(1, 'Slug is required'),
    v.maxLength(100, 'Slug must be at most 100 characters'),
    v.regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
  ),
  website: v.optional(v.pipe(
    v.string(),
    v.url('Please enter a valid URL')
  ))
})

export type BrandSchemaInput = v.InferInput<typeof BrandSchema>
export type BrandSchemaOutput = v.InferOutput<typeof BrandSchema>

export const PRODUCT_FORM_LABELS: Record<ProductForm, string> = {
  [ProductForm.Bar]: 'Bar',
  [ProductForm.Capsule]: 'Capsule',
  [ProductForm.Chew]: 'Chew',
  [ProductForm.DrinkMix]: 'Drink Mix',
  [ProductForm.Gel]: 'Gel',
  [ProductForm.Liquid]: 'Liquid',
  [ProductForm.Powder]: 'Powder',
  [ProductForm.Solid]: 'Solid'
}

export const ProductSchema = v.object({
  brandId: v.pipe(
    v.string(),
    v.minLength(1, 'Brand is required')
  ),
  caffeineGm: v.optional(v.pipe(
    v.number(),
    v.minValue(0, 'Caffeine must be positive')
  )),
  calories: v.optional(v.pipe(
    v.number(),
    v.minValue(0, 'Calories must be positive')
  )),
  carbsG: v.optional(v.pipe(
    v.number(),
    v.minValue(0, 'Carbs must be positive')
  )),
  fatG: v.optional(v.pipe(
    v.number(),
    v.minValue(0, 'Fat must be positive')
  )),
  flavor: v.optional(v.pipe(
    v.string(),
    v.maxLength(100, 'Flavor must be at most 100 characters')
  )),
  form: v.enum(ProductForm, 'Please select a product form'),
  name: v.pipe(
    v.string(),
    v.minLength(1, 'Product name is required'),
    v.maxLength(200, 'Product name must be at most 200 characters')
  ),
  notes: v.optional(v.pipe(
    v.string(),
    v.maxLength(1000, 'Notes must be at most 1000 characters')
  )),
  proteinG: v.optional(v.pipe(
    v.number(),
    v.minValue(0, 'Protein must be positive')
  )),
  servingSize: v.pipe(
    v.number(),
    v.minValue(0.1, 'Serving size must be at least 0.1')
  ),
  servingsPerPackage: v.optional(v.pipe(
    v.number(),
    v.minValue(1, 'Servings per package must be at least 1')
  )),
  servingUnit: v.pipe(
    v.string(),
    v.minLength(1, 'Serving unit is required'),
    v.maxLength(20, 'Serving unit must be at most 20 characters')
  ),
  slug: v.pipe(
    v.string(),
    v.minLength(1, 'Slug is required'),
    v.maxLength(200, 'Slug must be at most 200 characters'),
    v.regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
  ),
  sodiumMg: v.optional(v.pipe(
    v.number(),
    v.minValue(0, 'Sodium must be positive')
  )),
  sugarG: v.optional(v.pipe(
    v.number(),
    v.minValue(0, 'Sugar must be positive')
  ))
})

export type ProductSchemaInput = v.InferInput<typeof ProductSchema>
export type ProductSchemaOutput = v.InferOutput<typeof ProductSchema>
