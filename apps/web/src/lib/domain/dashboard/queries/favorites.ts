import type { Result } from 'neverthrow'

import type { DashboardService } from '$lib/domain/dashboard/service'

import { queryOptions, skipToken } from '@tanstack/svelte-query'

import { queryKeys } from '$lib/domain/query/keys'
import { liftResultAsync } from '$lib/domain/query/utils'

export const favoriteProductsOptions = (maybeService: Result<DashboardService, void>, limit = 6) => queryOptions({
  queryFn: maybeService.isOk() ? liftResultAsync(() => maybeService.value.getFavoriteProducts(limit)) : skipToken,
  queryKey: queryKeys.favorites.products()
})
