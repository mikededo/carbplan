import type { ApiRoutes } from '@carbplan/api/eden'
import type { ApiError } from '@carbplan/contracts/api'

import type { TransportApiError, TransportError, TransportFetch, TransportResponse } from './transport'

import { ApiErrorSchema } from '@carbplan/contracts/api'
import { treaty } from '@elysiajs/eden'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'

import { TransportErrorValues } from './transport'

type CreateApiClientInput = {
  baseUrl?: string
  fetch: TransportFetch
  getHeaders?: () => Promise<Record<string, string> | undefined> | Record<string, string> | undefined
}

export const createApiClient = ({ baseUrl = '/api', fetch, getHeaders }: CreateApiClientInput) => treaty<ApiRoutes>(baseUrl, {
  fetch: { credentials: 'include' },
  fetcher: fetch as typeof globalThis.fetch,
  headers: async () => await getHeaders?.(),
  parseDate: true
})

export type ApiClient = ReturnType<typeof createApiClient>

type EdenResponse<T> = {
  data: null | T | undefined
  error: { status: number, value: unknown } | null
  headers?: HeadersInit
  status: number
}

const toTransportError = ({ status, value }: { status: number, value: unknown }): TransportApiError | TransportError => {
  const apiError = ApiErrorSchema.safeParse(value)
  if (apiError.success) {
    return { ...apiError.data, status } satisfies { status: number } & ApiError
  }

  return {
    code: TransportErrorValues.HTTP_ERROR,
    message: `Request failed with status ${status}`,
    status
  }
}

export const unwrapEden = <T>(request: Promise<EdenResponse<T>>) => ResultAsync
  .fromPromise(request, (): TransportError => ({
    code: TransportErrorValues.NETWORK_ERROR,
    message: 'Network request failed',
    status: 0
  }))
  .andThen((response) => {
    if (response.error) {
      return errAsync(toTransportError(response.error))
    }

    return okAsync(response.data as T)
  })

export const unwrapEdenWithMeta = <T>(request: Promise<EdenResponse<T>>) => ResultAsync
  .fromPromise(request, (): TransportError => ({
    code: TransportErrorValues.NETWORK_ERROR,
    message: 'Network request failed',
    status: 0
  }))
  .andThen((response) => {
    if (response.error) {
      return errAsync(toTransportError(response.error))
    }

    return okAsync({
      data: response.data as T,
      headers: new Headers(response.headers),
      status: response.status
    } satisfies TransportResponse<T>)
  })
