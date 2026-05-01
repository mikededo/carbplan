import type { LayoutLoad } from './$types'

import { QueryClient } from '@tanstack/svelte-query'

import { browser } from '$app/environment'
import { createTransport } from '$lib/api/transport'
import { QUERY_STALE_TIME_DEFAULT } from '$lib/domain/query/times'
import { createPublicServices } from '$lib/domain/services/helpers'

export const load: LayoutLoad = async ({ data, fetch }) => {
  const transport = createTransport({ fetch })
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        staleTime: QUERY_STALE_TIME_DEFAULT
      }
    }
  })

  return {
    publicServices: createPublicServices(transport),
    queryClient,
    session: data.session,
    user: data.user
  }
}
