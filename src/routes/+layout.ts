import type { Database } from '$lib/database/types.g'

import type { LayoutLoad } from './$types'

import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'
import { QueryClient } from '@tanstack/svelte-query'

import { browser } from '$app/environment'
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
  depends('supabase:auth')

  const supabase = isBrowser()
    ? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
        global: {
          fetch
        }
      })
    : createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
        cookies: {
          getAll() {
            return data.cookies
          }
        },
        global: {
          fetch
        }
      })

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        staleTime: 1000 * 60 * 5
      }
    }
  })

  /**
   * It's fine to use `getSession` here, because on the client, `getSession` is
   * safe, and on the server, it reads `session` from the `LayoutData`, which
   * safely checked the session using `safeGetSession`.
   */
  const {
    data: { session }
  } = await supabase.auth.getSession()

  return { queryClient, session, supabase }
}
