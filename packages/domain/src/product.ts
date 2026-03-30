import * as z from 'zod'

export const ProductFormSchema = z.enum([
  'gel',
  'bar',
  'chew',
  'drink_mix',
  'powder',
  'capsule',
  'liquid',
  'solid'
])
export const ProductFormEnum = ProductFormSchema.enum
export type ProductForm = z.infer<typeof ProductFormSchema>
