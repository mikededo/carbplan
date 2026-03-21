import { z } from 'zod'

export const ApiMetaSchema = z.object({
  nextCursor: z.string().optional(),
  requestId: z.string().optional()
})

export const ApiSuccessSchema = <T extends z.ZodTypeAny>(data: T) => z.object({
  data,
  meta: ApiMetaSchema.optional()
})

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

export const ApiEmptyResponseSchema = z.null()
export type ApiEmptyResponse = z.infer<typeof ApiEmptyResponseSchema>
