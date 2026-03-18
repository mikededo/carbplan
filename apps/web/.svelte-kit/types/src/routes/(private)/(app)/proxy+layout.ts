// @ts-nocheck
import type { LayoutLoad } from './$types'

import { athleteOptions } from '$lib/domain/settings/queries'

export const load = async ({ parent }: Parameters<LayoutLoad>[0]) => {
  const { queryClient, supabase } = await parent()

  queryClient.prefetchQuery(athleteOptions(supabase))
}

