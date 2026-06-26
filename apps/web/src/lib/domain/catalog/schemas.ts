import type { ProductForm } from '@kilo/domain/product'

import { ProductFormEnum, ProductFormSchema } from '@kilo/domain/product'
import * as z from 'zod'

const SLUG_INVALID_CHARS_REGEX = /[^a-z0-9\s-]/g
const SLUG_WHITESPACE_REGEX = /\s+/g
const SLUG_DASHES_REGEX = /-+/g
const SLUG_VALIDATION_REGEX = /^[a-z0-9-]+$/

/**
 * Generates a URL-friendly slug from a string.
 * Converts to lowercase, removes special characters, and replaces spaces with hyphens.
 */
export const generateSlug = (input: string): string =>
  input
    .toLowerCase()
    .replace(SLUG_INVALID_CHARS_REGEX, '')
    .replace(SLUG_WHITESPACE_REGEX, '-')
    .replace(SLUG_DASHES_REGEX, '-')
    .trim()

export const BrandSchema = z.object({
  description: z.string().trim().max(500, 'Description must be at most 500 characters').optional(),
  logoUrl: z.url('Please enter a valid URL').optional(),
  name: z.string().trim().min(1, 'Brand name is required').max(100, 'Brand name must be at most 100 characters'),
  slug: z.string().trim().min(1, 'Slug is required').max(100, 'Slug must be at most 100 characters').regex(SLUG_VALIDATION_REGEX, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  website: z.url('Please enter a valid URL').optional()
})

export type BrandSchemaInput = z.input<typeof BrandSchema>
export type BrandSchemaOutput = z.output<typeof BrandSchema>

export const PRODUCT_FORM_LABELS: Record<ProductForm, string> = {
  [ProductFormEnum.bar]: 'Bar',
  [ProductFormEnum.capsule]: 'Capsule',
  [ProductFormEnum.chew]: 'Chew',
  [ProductFormEnum.drink_mix]: 'Drink Mix',
  [ProductFormEnum.gel]: 'Gel',
  [ProductFormEnum.liquid]: 'Liquid',
  [ProductFormEnum.powder]: 'Powder',
  [ProductFormEnum.solid]: 'Solid'
}

export const ProductSchema = z.object({
  brandId: z.string().trim().min(1, 'Brand is required'),
  caffeineMg: z.number()
    .min(0, 'Caffeine must be positive')
    .optional(),
  calories: z.number()
    .min(0, 'Calories must be positive')
    .optional(),
  carbsG: z.number()
    .min(0, 'Carbs must be positive')
    .optional(),
  fatG: z.number()
    .min(0, 'Fat must be positive')
    .optional(),
  flavor: z.string().trim().max(100, 'Flavor must be at most 100 characters').optional(),
  form: ProductFormSchema,
  name: z.string().trim().min(1, 'Product name is required').max(200, 'Product name must be at most 200 characters'),
  notes: z.string().trim().max(1000, 'Notes must be at most 1000 characters').optional(),
  proteinG: z.number()
    .min(0, 'Protein must be positive')
    .optional(),
  servingSize: z.number().min(0.1, 'Serving size must be at least 0.1'),
  servingsPerPackage: z.number()
    .min(1, 'Servings per package must be at least 1')
    .optional(),
  servingUnit: z.string().trim().min(1, 'Serving unit is required').max(20, 'Serving unit must be at most 20 characters'),
  slug: z.string().trim().min(1, 'Slug is required').max(200, 'Slug must be at most 200 characters').regex(SLUG_VALIDATION_REGEX, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  sodiumMg: z.number()
    .min(0, 'Sodium must be positive')
    .optional(),
  sugarG: z.number()
    .min(0, 'Sugar must be positive')
    .optional()
})

export type ProductSchemaInput = z.input<typeof ProductSchema>
export type ProductSchemaOutput = z.output<typeof ProductSchema>
