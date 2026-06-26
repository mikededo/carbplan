import type { Treaty } from '@elysiajs/eden'
import type { ApiRoutes } from '@kilo/api/eden'
import type { ApiError } from '@kilo/contracts/api'

import { treaty } from '@elysiajs/eden'
import { ApiErrorSchema } from '@kilo/contracts/api'
import { getErrorMessageOrDefault } from '@kilo/utils/errors'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'

const ApiClientErrorValues = {
  HTTP_ERROR: 'HTTP_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
} as const

type ApiClientFetch = typeof fetch
type ApiClientError = {
  code: typeof ApiClientErrorValues[keyof typeof ApiClientErrorValues]
  message: string
  status: number
}
type ApiClientApiError = { status: number } & ApiError

type CreateApiClientInput = {
  baseUrl?: string
  fetch: ApiClientFetch
  getHeaders?: () => Promise<Record<string, string> | undefined> | Record<string, string> | undefined
}

export const createApiClient = ({ baseUrl = '/api', fetch, getHeaders }: CreateApiClientInput) => treaty<ApiRoutes>(baseUrl, {
  fetch: { credentials: 'include' },
  fetcher: fetch as typeof globalThis.fetch,
  headers: async () => await getHeaders?.(),
  parseDate: true
})

export type ApiClient = ReturnType<typeof createApiClient>

type ApiMethod = (...args: any[]) => Promise<Treaty.TreatyResponse<Record<number, unknown>>>
export type ApiBody<T extends ApiMethod> = NonNullable<Parameters<T>[0]>
export type ApiData<T extends ApiMethod> = Treaty.Data<T>

type EdenResponse<T> = {
  data: null | T | undefined
  error: { status: number, value: unknown } | null
  headers?: HeadersInit
  status: number
}

const toApiClientError = ({ status, value }: { status: number, value: unknown }): ApiClientApiError | ApiClientError => {
  const apiError = ApiErrorSchema.safeParse(value)
  if (apiError.success) {
    return { ...apiError.data, status } satisfies { status: number } & ApiError
  }

  return {
    code: ApiClientErrorValues.HTTP_ERROR,
    message: `Request failed with status ${status}`,
    status
  }
}

export const unwrapEden = <T = void>(request: Promise<EdenResponse<T>>) => ResultAsync
  .fromPromise(request, (error): ApiClientError => ({
    code: ApiClientErrorValues.NETWORK_ERROR,
    message: getErrorMessageOrDefault(error, 'Network request failed'),
    status: 0
  }))
  .andThen((response) => {
    if (response.error) {
      return errAsync(toApiClientError(response.error))
    }

    return okAsync(response.data as T)
  })
