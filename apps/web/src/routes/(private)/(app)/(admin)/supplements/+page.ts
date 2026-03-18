import type { PageLoad } from './$types'

import { catalogOptions } from '$lib/domain/catalog/queries'

export const load: PageLoad = async ({ parent }) => {
  const { queryClient, supabase } = await parent()

  await queryClient.prefetchQuery(catalogOptions(supabase))
}

