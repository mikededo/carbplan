import type { PageLoad } from './$types'

import {
  favoriteProductsOptions,
  nextPlanOptions,
  recentPlansOptions
} from '$lib/domain/dashboard/queries'

export const load: PageLoad = async ({ parent }) => {
  const { queryClient, supabase } = await parent()

  await Promise.all([
    queryClient.prefetchQuery(nextPlanOptions(supabase)),
    queryClient.prefetchQuery(recentPlansOptions(supabase, 5)),
    queryClient.prefetchQuery(favoriteProductsOptions(supabase, 6))
  ])
}
