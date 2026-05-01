import type { Result } from 'neverthrow'

import type { DashboardService } from '$lib/domain/dashboard/service'

import { queryOptions, skipToken } from '@tanstack/svelte-query'

import { queryKeys } from '$lib/domain/query/keys'
import { liftResultAsync } from '$lib/domain/query/utils'

export const recentPlansOptions = (maybeService: Result<DashboardService, void>, limit = 5) => queryOptions({
  queryFn: maybeService.isOk() ? liftResultAsync(() => maybeService.value.getRecentPlans(limit)) : skipToken,
  queryKey: queryKeys.plans.recent(limit)
})

export const nextPlanOptions = (maybeService: Result<DashboardService, void>) => {
  const today = new Date().toISOString().split('T')[0]

  return queryOptions({
    queryFn: maybeService.isOk() ? liftResultAsync(() => maybeService.value.getNextPlan(today)) : skipToken,
    queryKey: queryKeys.plans.next()
  })
}
