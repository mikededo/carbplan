import type { Result } from 'neverthrow'

import type { MeService } from '$lib/domain/me/service'

import { queryOptions, skipToken } from '@tanstack/svelte-query'

import { queryKeys } from '$lib/domain/query/keys'
import { liftResultAsync } from '$lib/domain/query/utils'

export const athleteOptions = (maybeService: Result<MeService, void>) => queryOptions({
  queryFn: maybeService.isOk() ? liftResultAsync(maybeService.value.getCurrentAthlete) : skipToken,
  queryKey: queryKeys.athlete.current(),
  staleTime: Infinity
})
