import { PRODUCT_FORM } from '@carbplan/domain/product'
import * as z from 'zod'

export const FavoriteProductsListResponseSchema = z.array(
  z.object({
    brand: z.object({
      id: z.string().trim(),
      logoUrl: z.string().trim().nullable(),
      name: z.string().trim(),
      slug: z.string().trim()
    }),
    caffeineMg: z.number().nullable(),
    calories: z.number().nullable(),
    carbsG: z.number().nullable(),
    createdAt: z.date(),
    fatG: z.number().nullable(),
    flavor: z.string().trim().nullable(),
    form: z.enum(PRODUCT_FORM),
    id: z.uuid(),
    isActive: z.boolean(),
    isFavorite: z.boolean(),
    name: z.string().trim(),
    notes: z.string().trim().nullable(),
    proteinG: z.number().nullable(),
    servingSize: z.number().nullable(),
    servingsPerPackage: z.number().nullable(),
    servingUnit: z.string().trim().nullable(),
    slug: z.string().trim(),
    sodiumMg: z.number().nullable(),
    sugarG: z.number().nullable(),
    updatedAt: z.date()
  })
)
export type FavoriteProductsListResponse = z.infer<typeof FavoriteProductsListResponseSchema>

