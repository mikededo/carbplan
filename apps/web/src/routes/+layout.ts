import type { LayoutLoad } from './$types'

import { QueryClient } from '@tanstack/svelte-query'

import { browser } from '$app/environment'
import { createApiClient } from '$lib/api/eden'
import { QUERY_STALE_TIME_DEFAULT } from '$lib/domain/query/times'
import { createPublicServices } from '$lib/domain/services/helpers'

export const load: LayoutLoad = async ({ data, fetch }) => {
  const api = createApiClient({ fetch })
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        staleTime: QUERY_STALE_TIME_DEFAULT
      }
    }
  })

  return {
    publicServices: createPublicServices(api),
    queryClient,
    session: data.session,
    user: data.user
  }
}
