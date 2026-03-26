import { PRODUCT_FORM } from '@carbplan/domain/product'
import * as z from 'zod'

import { ApiEmptyResponseSchema, ApiSuccessSchema, PaginationApiMeta } from '../api'
import { createFilterArraySchema, StringFilterArraySchema } from './filtering'
import { createListQuerySchema } from './pagination'

export const CatalogProductsSortFields = [
  'name',
  'calories',
  'carbsG',
  'sugarG',
  'sodiumMg',
  'caffeineMg',
  'proteinG',
  'fatG'
] as const
export type CatalogProductsSortField = (typeof CatalogProductsSortFields)[number]

export const CatalogProductsFilterSchema = z.object({
  brand: StringFilterArraySchema.optional(),
  caloriesGte: z.coerce.number().nonnegative().optional(),
  caloriesLte: z.coerce.number().nonnegative().optional(),
  carbsGte: z.coerce.number().nonnegative().optional(),
  carbsLte: z.coerce.number().nonnegative().optional(),
  form: createFilterArraySchema(z.enum(PRODUCT_FORM)).optional(),
  q: z.string().trim().min(1).max(120).optional()
})
  .refine((value) => value.caloriesGte === undefined || value.caloriesLte === undefined || value.caloriesGte <= value.caloriesLte, {
    error: 'caloriesGte must be less than or equal to caloriesLte'
  })
  .refine((value) => value.carbsGte === undefined || value.carbsLte === undefined || value.carbsGte <= value.carbsLte, {
    message: 'carbsGte must be less than or equal to carbsLte'
  })
export type CatalogProductsFilter = z.infer<typeof CatalogProductsFilterSchema>

export const CatalogProductsListQuerySchema = createListQuerySchema({
  defaultSort: 'name:asc',
  fields: CatalogProductsSortFields,
  filters: CatalogProductsFilterSchema
})
export type CatalogProductsListQuery = z.infer<typeof CatalogProductsListQuerySchema>

export const CatalogProductListItemSchema = z.object({
  brandDescription: z.string().trim().nullable(),
  brandId: z.string().trim(),
  brandLogoUrl: z.string().trim().nullable(),
  brandName: z.string().trim(),
  brandSlug: z.string().trim(),
  brandWebsite: z.string().trim().nullable(),
  caffeineMg: z.number().nullable(),
  calories: z.number().nullable(),
  carbsG: z.number().nullable(),
  fatG: z.number().nullable(),
  flavor: z.string().trim().nullable(),
  form: z.enum(PRODUCT_FORM),
  id: z.uuid(),
  name: z.string().trim(),
  proteinG: z.number().nullable(),
  servingSize: z.number().nullable(),
  servingsPerPackage: z.number().nullable(),
  servingUnit: z.string().trim().nullable(),
  slug: z.string().trim(),
  sodiumMg: z.number().nullable(),
  sugarG: z.number().nullable()
})
export type CatalogProductListItem = z.infer<typeof CatalogProductListItemSchema>

export const CatalogProductsListResponseSchema = ApiSuccessSchema(
  z.array(CatalogProductListItemSchema),
  PaginationApiMeta
)
export type CatalogProductsListResponse = z.infer<typeof CatalogProductsListResponseSchema>
export const CatalogProductListCachedResponseSchema = ApiEmptyResponseSchema
export type CatalogProductListCachedResponse = z.infer<typeof CatalogProductListCachedResponseSchema>
