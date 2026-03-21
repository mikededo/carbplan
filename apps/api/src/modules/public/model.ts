import { t } from 'elysia'

export enum ApiErrorCode {
  BadRequest = 'BAD_REQUEST',
  Conflict = 'CONFLICT',
  Forbidden = 'FORBIDDEN',
  Gone = 'GONE',
  Internal = 'INTERNAL_SERVER_ERROR',
  NotFound = 'NOT_FOUND',
  ServiceUnavailable = 'SERVICE_UNAVAILABLE',
  TooManyRequests = 'TOO_MANY_REQUESTS',
  Unauthorized = 'UNAUTHORIZED',
  UnprocessableEntity = 'UNPROCESSABLE_ENTITY',
  Validation = 'VALIDATION_ERROR'
}

export const ApiErrorCodeSchema = t.Enum(ApiErrorCode)

export const BadRequestErrorModel = t.Object({
  code: t.Literal(ApiErrorCode.BadRequest),
  message: t.String(),
  requestId: t.Optional(t.String())
}, { description: 'Bad request' })

export const NotFoundErrorModel = t.Object({
  code: t.Literal(ApiErrorCode.NotFound),
  message: t.String(),
  requestId: t.Optional(t.String())
}, { description: 'Not found. The request resource was not found.' })

export const UnauthorizedErrorModel = t.Object({
  code: t.Literal(ApiErrorCode.Unauthorized),
  message: t.String(),
  requestId: t.Optional(t.String())
}, { description: 'Unauthorized. Due to missing or invalid authentication.' })

export const ForbiddenErrorModel = t.Object({
  code: t.Literal(ApiErrorCode.Forbidden),
  message: t.String(),
  requestId: t.Optional(t.String())
}, { description: 'Forbidden. You do not have permission to access this resource or to perform this action' })

export const ValidationErrorModel = t.Object({
  code: t.Literal(ApiErrorCode.Validation),
  message: t.String(),
  requestId: t.Optional(t.String())
}, { description: 'Forbidden. You do not have permission to access this resource or to perform this action' })

export const ConflictErrorModel = t.Object({
  code: t.Literal(ApiErrorCode.Conflict),
  message: t.String(),
  requestId: t.Optional(t.String())
}, { description: 'Conflict. The request conflicts with the current state of the server.' })

export const GoneErrorModel = t.Object({
  code: t.Literal(ApiErrorCode.Gone),
  message: t.String(),
  requestId: t.Optional(t.String())
}, { description: 'Gone. The requested content has been permanently deleted from server.' })

export const TooManyRequestsErrorModel = t.Object({
  code: t.Literal(ApiErrorCode.TooManyRequests),
  message: t.String(),
  requestId: t.Optional(t.String())
}, { description: 'Too many requests. The user has sent too many requests in a given amount of time.' })

export const UnprocessableEntityErrorModel = t.Object({
  code: t.Literal(ApiErrorCode.UnprocessableEntity),
  message: t.String(),
  requestId: t.Optional(t.String())
}, { description: 'Unprocessable. The server was unable to process the contained instructions.' })

export const ServiceUnavailableErrorModel = t.Object({
  code: t.Literal(ApiErrorCode.ServiceUnavailable),
  message: t.String(),
  requestId: t.Optional(t.String())
}, { description: 'Unavailable. This is a problem with the server that you cannot fix.' })

export const InternalServerErrorModel = t.Object({
  code: t.Literal(ApiErrorCode.Internal),
  message: t.String(),
  requestId: t.Optional(t.String())
}, { description: 'Internal server error. An unexpected error occurred on the server.' })

export const ApiErrorModel = t.Union([
  BadRequestErrorModel,
  ConflictErrorModel,
  ForbiddenErrorModel,
  GoneErrorModel,
  InternalServerErrorModel,
  NotFoundErrorModel,
  ServiceUnavailableErrorModel,
  TooManyRequestsErrorModel,
  UnauthorizedErrorModel,
  UnprocessableEntityErrorModel,
  ValidationErrorModel
])

export type BadRequestError = typeof BadRequestErrorModel.static
export type NotFoundError = typeof NotFoundErrorModel.static
export type UnauthorizedError = typeof UnauthorizedErrorModel.static
export type ForbiddenError = typeof ForbiddenErrorModel.static
export type ValidationError = typeof ValidationErrorModel.static
export type ConflictError = typeof ConflictErrorModel.static
export type GoneError = typeof GoneErrorModel.static
export type TooManyRequestsError = typeof TooManyRequestsErrorModel.static
export type UnprocessableEntityError = typeof UnprocessableEntityErrorModel.static
export type ServiceUnavailableError = typeof ServiceUnavailableErrorModel.static
export type InternalServerError = typeof InternalServerErrorModel.static
export type ApiError = typeof ApiErrorModel.static

export const apiErrorFactory = {
  badRequest: (message = 'Bad request', requestId?: string): BadRequestError => ({
    code: ApiErrorCode.BadRequest,
    message,
    requestId
  }),
  conflict: (message = 'Resource already exists', requestId?: string): ConflictError => ({
    code: ApiErrorCode.Conflict,
    message,
    requestId
  }),
  forbidden: (message = 'Access forbidden', requestId?: string): ForbiddenError => ({
    code: ApiErrorCode.Forbidden,
    message,
    requestId
  }),
  gone: (message = 'Resource no longer available', requestId?: string): GoneError => ({
    code: ApiErrorCode.Gone,
    message,
    requestId
  }),
  internal: (message = 'Internal server error', requestId?: string): InternalServerError => ({
    code: ApiErrorCode.Internal,
    message,
    requestId
  }),
  notFound: (message = 'Resource not found', requestId?: string): NotFoundError => ({
    code: ApiErrorCode.NotFound,
    message,
    requestId
  }),
  serviceUnavailable: (message = 'Service temporarily unavailable', requestId?: string): ServiceUnavailableError => ({
    code: ApiErrorCode.ServiceUnavailable,
    message,
    requestId
  }),
  tooManyRequests: (message = 'Rate limit exceeded', requestId?: string): TooManyRequestsError => ({
    code: ApiErrorCode.TooManyRequests,
    message,
    requestId
  }),
  unauthorized: (message = 'Unauthorized request', requestId?: string): UnauthorizedError => ({
    code: ApiErrorCode.Unauthorized,
    message,
    requestId
  }),
  unprocessableEntity: (message = 'Unprocessable entity', requestId?: string): UnprocessableEntityError => ({
    code: ApiErrorCode.UnprocessableEntity,
    message,
    requestId
  }),
  validation: (message = 'Request validation failed', requestId?: string): ValidationError => ({
    code: ApiErrorCode.Validation,
    message,
    requestId
  })
} as const
