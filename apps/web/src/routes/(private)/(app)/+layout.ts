import type { LayoutLoad } from './$types'

import { ok } from 'neverthrow'

import { athleteOptions } from '$lib/domain/settings/queries/athlete'

export const load: LayoutLoad = async ({ parent }) => {
  const { privateServices, queryClient } = await parent()

  await queryClient.prefetchQuery(athleteOptions(ok(privateServices.me)))
}
