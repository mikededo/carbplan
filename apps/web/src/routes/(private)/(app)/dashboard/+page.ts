import type { PageLoad } from './$types'

import { ok } from 'neverthrow'

import {
  favoriteProductsOptions,
  nextPlanOptions,
  recentPlansOptions
} from '$lib/domain/dashboard/queries'

export const load: PageLoad = async ({ parent }) => {
  const { privateServices, queryClient } = await parent()
  const dashboard = ok(privateServices.dashboard)

  await Promise.all([
    queryClient.prefetchQuery(nextPlanOptions(dashboard)),
    queryClient.prefetchQuery(recentPlansOptions(dashboard, 5)),
    queryClient.prefetchQuery(favoriteProductsOptions(dashboard, 6))
  ])
}
