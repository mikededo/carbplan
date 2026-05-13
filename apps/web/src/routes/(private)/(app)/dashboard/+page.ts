import type { PageLoad } from './$types'

import { ok } from 'neverthrow'

import { favoriteProductsOptions } from '$lib/domain/dashboard/queries/favorites'
import {
  nextPlanOptions,
  recentPlansOptions
} from '$lib/domain/dashboard/queries/plans'

export const load: PageLoad = async ({ parent }) => {
  const { privateServices, queryClient } = await parent()
  const dashboard = ok(privateServices.dashboard)

  await Promise.all([
    queryClient.prefetchQuery(nextPlanOptions(dashboard)),
    queryClient.prefetchQuery(recentPlansOptions(dashboard, 5)),
    queryClient.prefetchQuery(favoriteProductsOptions(dashboard, 6))
  ])
}
