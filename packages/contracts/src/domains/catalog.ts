import * as z from 'zod'

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
  createdAt: z.date(),
  description: z.string().trim().nullable(),
  id: z.uuid(),
  isActive: z.boolean(),
  logoUrl: z.string().trim().nullable(),
  name: z.string().trim(),
  slug: z.string().trim(),
  updatedAt: z.date().nullable(),
  website: z.string().trim().nullable()
})
export type CreateBrandResponse = z.infer<typeof CreateBrandRequestSchema>
