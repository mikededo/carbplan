import type { ApiError, ApiSuccess } from '@carbplan/contracts/api'

import { ApiErrorSchema } from '@carbplan/contracts/api'
import { getErrorMessageOrDefault } from '@carbplan/utils/errors'
import { normalizeURL } from '@carbplan/utils/url'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import * as z from 'zod'

export const RequestMethodsSchema = z.enum(['DELETE', 'GET', 'PATCH', 'POST', 'PUT'])
export const RequestMethodValues = RequestMethodsSchema.enum
export type RequestMethod = z.infer<typeof RequestMethodsSchema>

export const TransportErrorValueSchema = z.enum(['HTTP_ERROR', 'NETWORK_ERROR', 'PARSER_ERROR'])
export const TransportErrorValues = TransportErrorValueSchema.enum
export type TransportErrorType = z.infer<typeof TransportErrorValueSchema>
export type TransportError = {
  code: TransportErrorType
  details?: Record<string, unknown>
  message: string
  status: number
}
export type TransportApiError = { status: number } & ApiError
export type TransportResponse<T> = {
  data: T
  headers: Headers
  status: number
}

export const RequestInputSchema = z.object({
  body: z.unknown().optional(),
  headers: z.record(z.string().trim(), z.string().trim()).optional(),
  method: RequestMethodsSchema.optional(),
  path: z.string().trim()
})
export type RequestInput<TSuccess = unknown> = {
  /**
   * Opt in to response metadata when caller needs headers or status,
   * such as forwarding upstream auth cookies from server actions.
   */
  includeMeta?: boolean
  schema?: z.ZodType<TSuccess>
} & z.infer<typeof RequestInputSchema>
export type RequestInputWithoutMethod<TSuccess = unknown> = Omit<RequestInput<TSuccess>, 'method'>

type TransportMethod = {
  <TSuccess = void>(input: { includeMeta: true } & RequestInputWithoutMethod<TSuccess>): ResultAsync<TransportResponse<TSuccess>, TransportApiError | TransportError>
  <TSuccess = void>(input: RequestInputWithoutMethod<TSuccess>): ResultAsync<TSuccess, TransportApiError | TransportError>
}

export type Transport = {
  request: {
    <TSuccess = void>(input: { includeMeta: true } & RequestInput<TSuccess>): ResultAsync<TransportResponse<TSuccess>, TransportApiError | TransportError>
    <TSuccess = void>(input: RequestInput<TSuccess>): ResultAsync<TSuccess, TransportApiError | TransportError>
  }
  delete: TransportMethod
  get: TransportMethod
  patch: TransportMethod
  post: TransportMethod
  put: TransportMethod
}

type CreateTransportInput = {
  baseUrl?: string
  getHeaders?: () => Promise<Record<string, string> | undefined> | Record<string, string> | undefined
  fetch: typeof fetch
}

const withBase = (baseUrl: string, path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  if (!baseUrl) {
    return path
  }

  return `${normalizeURL(baseUrl)}${path}`
}

const isApiSuccess = <T>(value: unknown): value is ApiSuccess<T> => {
  if (!value || typeof value !== 'object') {
    return false
  }

  return 'data' in value
}

type IsEmptyResponseParams = { method: RequestMethod, response: Response }
const isEmptyResponse = ({ response }: IsEmptyResponseParams) =>
  response.status !== 204 && response.status !== 205 && response.status !== 304

type ToApiErrorArgs = {
  fallback?: {
    code: TransportErrorType
    message: string
  }
  status: number
  value: unknown
}
const toApiError = ({
  fallback,
  status,
  value
}: ToApiErrorArgs): TransportApiError | TransportError => {
  const maybeApiError = ApiErrorSchema.safeParse(value)
  if (maybeApiError.success) {
    return { ...maybeApiError.data, status } as TransportApiError
  }

  return {
    code: fallback?.code ?? TransportErrorValues.HTTP_ERROR,
    message: fallback?.message ?? 'Unexpected error',
    status
  }
}

type PerformRequestParams = { method: RequestMethod } & Omit<z.infer<typeof RequestInputSchema>, 'method'>

export const createTransport = ({
  baseUrl = '',
  fetch,
  getHeaders
}: CreateTransportInput): Transport => {
  const performRequest = async ({ body, headers, method, path }: PerformRequestParams) => {
    const resolvedHeaders = await getHeaders?.()

    return fetch(withBase(baseUrl, path), {
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...resolvedHeaders,
        ...headers
      },
      method
    })
  }

  const request = <TSuccess>({ body, headers, includeMeta, method = 'GET', path, schema }: RequestInput<TSuccess>) => {
    const responseResult = ResultAsync.fromPromise<Response, TransportError>(
      performRequest({ body, headers, method, path }),
      (error) => ({
        code: TransportErrorValues.NETWORK_ERROR,
        message: getErrorMessageOrDefault(error, 'Network request failed'),
        status: 0
      })
    )

    const extendResultWithMeta = (data: TSuccess, response: Response) => okAsync(
      includeMeta
        ? { data, headers: response.headers, status: response.status }
        : data
    )

    return responseResult.andThen((response) => {
      if (isEmptyResponse({ method, response })) {
        if (!response.ok) {
          return errAsync({
            code: TransportErrorValues.HTTP_ERROR,
            message: `Request failed with status ${response.status}`,
            status: response.status
          })
        }

        return extendResultWithMeta(undefined as TSuccess, response)
      }

      return ResultAsync
        .fromPromise<unknown, TransportError>(
          response.json(),
          () => ({
            code: TransportErrorValues.PARSER_ERROR,
            message: 'Unable to parse response payload',
            status: response.status
          })
        )
        .andThen((payload) => {
          if (!response.ok) {
            return errAsync(
              toApiError({
                fallback: {
                  code: TransportErrorValues.HTTP_ERROR,
                  message: `Request failed with status ${response.status}`
                },
                status: response.status,
                value: payload
              })
            )
          }

          if (!schema) {
            return extendResultWithMeta(payload as TSuccess, response)
          }

          const directParse = schema.safeParse(payload)
          if (directParse.success) {
            return extendResultWithMeta(directParse.data, response)
          }

          if (isApiSuccess<TSuccess>(payload)) {
            const wrappedParse = schema.safeParse(payload.data)
            if (wrappedParse.success) {
              return extendResultWithMeta(wrappedParse.data, response)
            }

            return errAsync({
              code: TransportErrorValues.PARSER_ERROR,
              details: z.flattenError(wrappedParse.error),
              message: 'Response payload does not match expected schema',
              status: response.status
            })
          }

          return errAsync({
            code: TransportErrorValues.PARSER_ERROR,
            details: z.flattenError(directParse.error),
            message: 'Response payload does not match expected schema',
            status: response.status
          })
        })
    })
  }

  const createMethodRequest = (method: RequestMethod): TransportMethod => <TSuccess>(input: RequestInputWithoutMethod<TSuccess>) =>
    request<TSuccess>({ ...input, method })

  return {
    delete: createMethodRequest(RequestMethodValues.DELETE),
    get: createMethodRequest(RequestMethodValues.GET),
    patch: createMethodRequest(RequestMethodValues.PATCH),
    post: createMethodRequest(RequestMethodValues.POST),
    put: createMethodRequest(RequestMethodValues.PUT),
    request
  }
}
