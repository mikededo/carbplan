import type { LayoutLoad } from './$types'

import { ok } from 'neverthrow'

import { browser } from '$app/environment'
import { athleteOptions } from '$lib/domain/settings/queries'

export const load: LayoutLoad = async ({ parent }) => {
  const { privateServices, queryClient } = await parent()

  if (browser) {
    queryClient.prefetchQuery(athleteOptions(ok(privateServices.me)))
  }
}
