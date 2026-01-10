import * as v from 'valibot'

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
