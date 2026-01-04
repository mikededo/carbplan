import type { LayoutLoad } from './$types'

import { athleteOptions } from '$lib/domain/settings/queries'

export const load: LayoutLoad = async ({ parent }) => {
  const { queryClient, supabase } = await parent()

  await queryClient.prefetchQuery(athleteOptions(supabase))
}

