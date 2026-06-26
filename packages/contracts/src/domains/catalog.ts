import { ProductFormSchema } from '@kilo/domain/product'
import { atLeastOneProperty } from '@kilo/utils/validation'
import * as z from 'zod'

import { ApiEmptyResponseSchema } from '../api'
import { DateSchema } from './date'

export const CreateBrandRequestSchema = z.object({
  description: z.string().trim().optional(),
  isActive: z.boolean().default(true),
  logoUrl: z.string().trim().optional(),
  name: z.string().trim(),
  slug: z.string().trim(),
  website: z.string().trim().optional()
})
export type CreateBrandRequest = z.infer<typeof CreateBrandRequestSchema>
export const CreateBrandResponseSchema = z.object({
  createdAt: DateSchema,
  description: z.string().trim().nullable(),
  id: z.uuid(),
  isActive: z.boolean(),
  logoUrl: z.string().trim().nullable(),
  name: z.string().trim(),
  slug: z.string().trim(),
  updatedAt: DateSchema.nullable(),
  website: z.string().trim().nullable()
})
export type CreateBrandResponse = z.infer<typeof CreateBrandResponseSchema>

export const CatalogProductSchema = z.object({
  brandId: z.uuid(),
  caffeineMg: z.int().nonnegative().nullable(),
  calories: z.int().nonnegative().nullable(),
  carbsG: z.number().nonnegative().nullable(),
  createdAt: DateSchema,
  fatG: z.number().nonnegative().nullable(),
  flavor: z.string().trim().nullable(),
  form: ProductFormSchema,
  id: z.uuid(),
  isActive: z.boolean(),
  name: z.string().trim(),
  notes: z.string().trim().nullable(),
  proteinG: z.number().nonnegative().nullable(),
  servingSize: z.number().positive(),
  servingsPerPackage: z.int().positive().nullable(),
  servingUnit: z.string().trim(),
  slug: z.string().trim(),
  sodiumMg: z.int().nonnegative().nullable(),
  sugarG: z.number().nonnegative().nullable(),
  updatedAt: DateSchema.nullable()
})
export type CatalogProduct = z.infer<typeof CatalogProductSchema>

export const CatalogBrandSchema = z.object({
  createdAt: DateSchema,
  description: z.string().trim().nullable(),
  id: z.uuid(),
  isActive: z.boolean(),
  logoUrl: z.string().trim().nullable(),
  name: z.string().trim(),
  products: z.array(CatalogProductSchema),
  slug: z.string().trim(),
  updatedAt: DateSchema.nullable(),
  website: z.string().trim().nullable()
})
export type CatalogBrand = z.infer<typeof CatalogBrandSchema>
export const CatalogListResponseSchema = z.array(CatalogBrandSchema)
export type CatalogListResponse = z.infer<typeof CatalogListResponseSchema>

export const UpdateBrandRequestParamsSchema = z.object({ brandId: z.uuid() })
export const UpdateBrandRequestSchema = atLeastOneProperty(
  z.object({
    description: z.string().trim().optional(),
    isActive: z.boolean().optional(),
    logoUrl: z.string().trim().optional(),
    name: z.string().trim().optional(),
    slug: z.string().trim().optional(),
    website: z.string().trim().optional()
  })
)
export type UpdateBrandRequest = z.infer<typeof UpdateBrandRequestSchema>
export const UpdateBrandResponseSchema = ApiEmptyResponseSchema
export type UpdateBrandResponse = z.infer<typeof UpdateBrandResponseSchema>

export const CreateProductRequestSchema = z.object({
  brandId: z.uuid(),
  caffeineMg: z.int().positive().optional(),
  calories: z.int().positive().optional(),
  carbsG: z.number().positive().optional(),
  fatG: z.number().positive().optional(),
  flavor: z.string().trim().optional(),
  form: ProductFormSchema,
  isActive: z.boolean().default(true),
  name: z.string().trim(),
  notes: z.string().trim().optional(),
  proteinG: z.number().positive().optional(),
  servingSize: z.number().positive(),
  servingsPerPackage: z.int().positive().optional(),
  servingUnit: z.string().trim().default('g'),
  slug: z.string().trim(),
  sodiumMg: z.int().positive().optional(),
  sugarG: z.number().positive().optional()
})
export type CreateProductRequest = z.infer<typeof CreateProductRequestSchema>
export const CreateProductResponseSchema = z.object({
  brandId: z.uuid(),
  caffeineMg: z.int().nonnegative().nullable(),
  calories: z.int().nonnegative().nullable(),
  carbsG: z.number().nonnegative().nullable(),
  createdAt: DateSchema,
  fatG: z.number().nonnegative().nullable(),
  flavor: z.string().trim().nullable(),
  form: ProductFormSchema,
  id: z.uuid(),
  isActive: z.boolean().default(true),
  name: z.string().trim(),
  notes: z.string().trim().nullable(),
  proteinG: z.number().nonnegative().nullable(),
  servingSize: z.number().positive(),
  servingsPerPackage: z.int().positive().nullable(),
  servingUnit: z.string().trim().default('g'),
  slug: z.string().trim(),
  sodiumMg: z.int().nonnegative().nullable(),
  sugarG: z.number().nonnegative().nullable(),
  updatedAt: DateSchema.nullable()
})
export type CreateProductResponse = z.infer<typeof CreateProductResponseSchema>

export const UpdateProductRequestParamsSchema = z.object({ productId: z.uuid() })
export const UpdateProductRequestSchema = atLeastOneProperty(
  z.object({
    caffeineMg: z.int().positive().optional(),
    calories: z.int().positive().optional(),
    carbsG: z.number().positive().optional(),
    fatG: z.number().positive().optional(),
    flavor: z.string().trim().optional(),
    form: ProductFormSchema.optional(),
    isActive: z.boolean().optional(),
    name: z.string().trim().nonempty().optional(),
    notes: z.string().trim().optional(),
    proteinG: z.number().positive().optional(),
    servingSize: z.number().positive().optional(),
    servingsPerPackage: z.int().positive().optional(),
    servingUnit: z.string().trim().default('g'),
    slug: z.string().trim().nonempty().optional(),
    sodiumMg: z.int().positive().optional(),
    sugarG: z.number().positive().optional()
  })
)
export type UpdateProductRequest = z.infer<typeof UpdateProductRequestSchema>
export const UpdateProductResponseSchema = ApiEmptyResponseSchema
export type UpdateProductResponse = z.infer<typeof UpdateProductResponseSchema>

export const DeactivateProductRequestParamsSchema = z.object({ productId: z.uuid() })
export const DeactivateProductResponseSchema = ApiEmptyResponseSchema
export type DeactivateProductResponse = z.infer<typeof DeactivateProductResponseSchema>
