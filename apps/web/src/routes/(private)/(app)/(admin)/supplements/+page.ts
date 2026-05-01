import type { PageLoad } from './$types'

import { ok } from 'neverthrow'

import { catalogOptions } from '$lib/domain/catalog/queries/catalog'

export const load: PageLoad = async ({ parent }) => {
  const { privateServices, queryClient } = await parent()

  await queryClient.prefetchQuery(catalogOptions(ok(privateServices.catalog)))
}
