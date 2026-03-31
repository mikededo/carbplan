import * as z from 'zod'

export enum ApiErrorCode {
  BadRequest = 'BAD_REQUEST',
  Conflict = 'CONFLICT',
  Forbidden = 'FORBIDDEN',
  Gone = 'GONE',
  Internal = 'INTERNAL_SERVER_ERROR',
  NotFound = 'NOT_FOUND',
  PreconditionFailed = 'PRECONDITION_FAILED',
  ServiceUnavailable = 'SERVICE_UNAVAILABLE',
  TooManyRequests = 'TOO_MANY_REQUESTS',
  Unauthorized = 'UNAUTHORIZED',
  UnprocessableEntity = 'UNPROCESSABLE_ENTITY',
  Validation = 'VALIDATION_ERROR'
}
export const ApiErrorCodeSchema = z.enum(ApiErrorCode)

export const BadRequestErrorSchema = z.object({
  code: z.literal(ApiErrorCode.BadRequest),
  message: z.string().trim(),
  requestId: z.string().trim().optional()
}).meta({ description: 'Bad request' })

export const NotFoundErrorSchema = z.object({
  code: z.literal(ApiErrorCode.NotFound),
  message: z.string().trim(),
  requestId: z.string().trim().optional()
}).meta({ description: 'Not found. The request resource was not found.' })

export const UnauthorizedErrorSchema = z.object({
  code: z.literal(ApiErrorCode.Unauthorized),
  message: z.string().trim(),
  requestId: z.string().trim().optional()
}).meta({ description: 'Unauthorized. Due to missing or invalid authentication.' })

export const ForbiddenErrorSchema = z.object({
  code: z.literal(ApiErrorCode.Forbidden),
  message: z.string().trim(),
  requestId: z.string().trim().optional()
}).meta({ description: 'Forbidden. You do not have permission to access this resource or to perform this action' })

export const ValidationErrorSchema = z.object({
  code: z.literal(ApiErrorCode.Validation),
  message: z.string().trim(),
  requestId: z.string().trim().optional()
}).meta({ description: 'Forbidden. You do not have permission to access this resource or to perform this action' })

export const ConflictErrorSchema = z.object({
  code: z.literal(ApiErrorCode.Conflict),
  message: z.string().trim(),
  requestId: z.string().trim().optional()
}).meta({ description: 'Conflict. The request conflicts with the current state of the server.' })

export const GoneErrorSchema = z.object({
  code: z.literal(ApiErrorCode.Gone),
  message: z.string().trim(),
  requestId: z.string().trim().optional()
}).meta({ description: 'Gone. The requested content has been permanently deleted from server.' })

export const TooManyRequestsErrorSchema = z.object({
  code: z.literal(ApiErrorCode.TooManyRequests),
  message: z.string().trim(),
  requestId: z.string().trim().optional()
}).meta({ description: 'Too many requests. The user has sent too many requests in a given amount of time.' })

export const UnprocessableEntityErrorSchema = z.object({
  code: z.literal(ApiErrorCode.UnprocessableEntity),
  message: z.string().trim(),
  requestId: z.string().trim().optional()
}).meta({ description: 'Unprocessable. The server was unable to process the contained instructions.' })

export const ServiceUnavailableErrorSchema = z.object({
  code: z.literal(ApiErrorCode.ServiceUnavailable),
  message: z.string().trim(),
  requestId: z.string().trim().optional()
}).meta({ description: 'Unavailable. This is a problem with the server that you cannot fix.' })

export const InternalServerErrorSchema = z.object({
  code: z.literal(ApiErrorCode.Internal),
  message: z.string().trim(),
  requestId: z.string().trim().optional()
}).meta({ description: 'Internal server error. An unexpected error occurred on the server.' })

export const PreconditionFailedErrorSchema = z.object({
  code: z.literal(ApiErrorCode.PreconditionFailed),
  message: z.string().trim(),
  requestId: z.string().trim().optional()
}).meta({ description: 'Precondition failed. The request does not meet one of the preconditions that the requester put on the request.' })

export const ApiErrorModelSchema = z.union([
  BadRequestErrorSchema,
  ConflictErrorSchema,
  ForbiddenErrorSchema,
  GoneErrorSchema,
  InternalServerErrorSchema,
  NotFoundErrorSchema,
  ServiceUnavailableErrorSchema,
  TooManyRequestsErrorSchema,
  UnauthorizedErrorSchema,
  UnprocessableEntityErrorSchema,
  ValidationErrorSchema,
  PreconditionFailedErrorSchema
])

export type BadRequestError = z.infer<typeof BadRequestErrorSchema>
export type NotFoundError = z.infer<typeof NotFoundErrorSchema>
export type UnauthorizedError = z.infer<typeof UnauthorizedErrorSchema>
export type ForbiddenError = z.infer<typeof ForbiddenErrorSchema>
export type ValidationError = z.infer<typeof ValidationErrorSchema>
export type ConflictError = z.infer<typeof ConflictErrorSchema>
export type GoneError = z.infer<typeof GoneErrorSchema>
export type TooManyRequestsError = z.infer<typeof TooManyRequestsErrorSchema>
export type UnprocessableEntityError = z.infer<typeof UnprocessableEntityErrorSchema>
export type ServiceUnavailableError = z.infer<typeof ServiceUnavailableErrorSchema>
export type InternalServerError = z.infer<typeof InternalServerErrorSchema>
export type PreconditionFailedError = z.infer<typeof PreconditionFailedErrorSchema>
export type ApiError = z.infer<typeof ApiErrorModelSchema>

type ApiErrorFactoryArgs = {
  message?: string
  requestId?: string
}
export const apiErrorFactory = {
  badRequest: ({ message, requestId }: ApiErrorFactoryArgs = {}): BadRequestError => ({
    code: ApiErrorCode.BadRequest,
    message: message ?? 'Bad request',
    requestId
  }),
  conflict: ({ message, requestId }: ApiErrorFactoryArgs = {}): ConflictError => ({
    code: ApiErrorCode.Conflict,
    message: message ?? 'Resource already exists',
    requestId
  }),
  forbidden: ({ message, requestId }: ApiErrorFactoryArgs = {}): ForbiddenError => ({
    code: ApiErrorCode.Forbidden,
    message: message ?? 'Access forbidden',
    requestId
  }),
  gone: ({ message, requestId }: ApiErrorFactoryArgs = {}): GoneError => ({
    code: ApiErrorCode.Gone,
    message: message ?? 'Resource no longer available',
    requestId
  }),
  internal: ({ message, requestId }: ApiErrorFactoryArgs = {}): InternalServerError => ({
    code: ApiErrorCode.Internal,
    message: message ?? 'Internal server error',
    requestId
  }),
  notFound: ({ message, requestId }: ApiErrorFactoryArgs = {}): NotFoundError => ({
    code: ApiErrorCode.NotFound,
    message: message ?? 'Resource not found',
    requestId
  }),
  preconditionFailed: ({ message, requestId }: ApiErrorFactoryArgs = {}): PreconditionFailedError => ({
    code: ApiErrorCode.PreconditionFailed,
    message: message ?? 'Precondition failed',
    requestId
  }),
  serviceUnavailable: ({ message, requestId }: ApiErrorFactoryArgs = {}): ServiceUnavailableError => ({
    code: ApiErrorCode.ServiceUnavailable,
    message: message ?? 'Service temporarily unavailable',
    requestId
  }),
  tooManyRequests: ({ message, requestId }: ApiErrorFactoryArgs = {}): TooManyRequestsError => ({
    code: ApiErrorCode.TooManyRequests,
    message: message ?? 'Rate limit exceeded',
    requestId
  }),
  unauthorized: ({ message, requestId }: ApiErrorFactoryArgs = {}): UnauthorizedError => ({
    code: ApiErrorCode.Unauthorized,
    message: message ?? 'Unauthorized',
    requestId
  }),
  unprocessableEntity: ({ message, requestId }: ApiErrorFactoryArgs = {}): UnprocessableEntityError => ({
    code: ApiErrorCode.UnprocessableEntity,
    message: message ?? 'Unprocessable entity',
    requestId
  }),
  validation: ({ message, requestId }: ApiErrorFactoryArgs = {}): ValidationError => ({
    code: ApiErrorCode.Validation,
    message: message ?? 'Validation error',
    requestId
  })
} as const
