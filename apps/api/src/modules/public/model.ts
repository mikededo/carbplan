import { t } from 'elysia'

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

export const PreconditionFailedErrorModel = t.Object({
  code: t.Literal(ApiErrorCode.PreconditionFailed),
  message: t.String(),
  requestId: t.Optional(t.String())
}, { description: 'Precondition failed. The request does not meet one of the preconditions that the requester put on the request.' })

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
  ValidationErrorModel,
  PreconditionFailedErrorModel
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
export type PreconditionFailedError = typeof PreconditionFailedErrorModel.static
export type ApiError = typeof ApiErrorModel.static

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
