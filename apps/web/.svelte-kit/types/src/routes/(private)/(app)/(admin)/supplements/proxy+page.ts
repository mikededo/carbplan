// @ts-nocheck
import type { PageLoad } from './$types'

import { catalogOptions } from '$lib/domain/catalog/queries'

export const load = async ({ parent }: Parameters<PageLoad>[0]) => {
  const { queryClient, supabase } = await parent()

  await queryClient.prefetchQuery(catalogOptions(supabase))
}

