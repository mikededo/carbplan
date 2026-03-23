import { PRODUCT_FORM } from '@carbplan/domain/product'
import z from 'zod'

export const FavoriteProductsListResponseSchema = z.array(
  z.object({
    brand: z.object({
      id: z.string(),
      logoUrl: z.string().nullable(),
      name: z.string(),
      slug: z.string()
    }),
    caffeineMg: z.number().nullable(),
    calories: z.number().nullable(),
    carbsG: z.number().nullable(),
    createdAt: z.date(),
    fatG: z.number().nullable(),
    flavor: z.string().nullable(),
    form: z.enum(PRODUCT_FORM),
    id: z.uuid(),
    isActive: z.boolean(),
    isFavorite: z.boolean(),
    name: z.string(),
    notes: z.string().nullable(),
    proteinG: z.number().nullable(),
    servingSize: z.number().nullable(),
    servingsPerPackage: z.number().nullable(),
    servingUnit: z.string().nullable(),
    slug: z.string(),
    sodiumMg: z.number().nullable(),
    sugarG: z.number().nullable(),
    updatedAt: z.date()
  })
)
export type FavoriteProductsListResponse = z.infer<typeof FavoriteProductsListResponseSchema>

