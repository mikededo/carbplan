import { z } from 'zod'

export const ApiMetaSchema = z.object({
  requestId: z.string().optional()
})
export const PaginationApiMeta = ApiMetaSchema.extend({
  limit: z.number().int().positive().optional(),
  offset: z.number().int().min(0).optional(),
  total: z.number().int().nonnegative().optional()
})

export const ApiEmptyResponse = z.undefined()
export const ApiSuccessSchema = <T extends z.ZodTypeAny, M extends z.ZodObject<z.ZodRawShape>>(
  data: T,
  meta: M = ApiMetaSchema.optional() as unknown as M
) => z.object({ data, meta })

export const ApiErrorCodeSchema = z.enum([
  'AUTH_FORBIDDEN',
  'AUTH_UNAUTHENTICATED',
  'DOMAIN_CONFLICT',
  'INTERNAL_ERROR',
  'RATE_LIMITED',
  'RESOURCE_NOT_FOUND',
  'VALIDATION_FAILED'
])

export const ApiErrorSchema = z.object({
  code: ApiErrorCodeSchema,
  details: z.record(z.string(), z.unknown()).optional(),
  message: z.string(),
  requestId: z.string()
})

export type ApiError = z.infer<typeof ApiErrorSchema>
export type ApiMeta = z.infer<typeof ApiMetaSchema>
export type ApiSuccess<T> = {
  data: T
  meta?: ApiMeta
}
