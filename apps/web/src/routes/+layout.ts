import type { LayoutLoad } from './$types'

import { QueryClient } from '@tanstack/svelte-query'

import { browser } from '$app/environment'

export const load: LayoutLoad = async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        staleTime: 1000 * 60 * 5
      }
    }
  })

  return { queryClient, session: {} as any }
}
