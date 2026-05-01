import type { CatalogBrand, CatalogListResponse } from '@carbplan/contracts/catalog'
import type { Result } from 'neverthrow'

import type { CatalogService, PublicCatalogService } from '$lib/domain/catalog/service'

import { queryOptions, skipToken } from '@tanstack/svelte-query'

import { queryKeys } from '$lib/domain/query/keys'
import { QUERY_STALE_TIME_DEFAULT } from '$lib/domain/query/times'
import { liftResultAsync } from '$lib/domain/query/utils'

export const publicCatalogOptions = (maybeService: Result<PublicCatalogService, void>) => queryOptions({
  queryFn: maybeService.isOk() ? liftResultAsync(maybeService.value.getCatalog) : skipToken,
  queryKey: queryKeys.catalog.all,
  staleTime: QUERY_STALE_TIME_DEFAULT
})

export const catalogOptions = (maybeService: Result<CatalogService, void>) => queryOptions({
  queryFn: maybeService.isOk() ? liftResultAsync(maybeService.value.getCatalog) : skipToken,
  queryKey: queryKeys.catalog.all,
  staleTime: QUERY_STALE_TIME_DEFAULT
})

export type CatalogResult = CatalogListResponse
export type { CatalogBrand }
