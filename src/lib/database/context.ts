import type { Result } from 'neverthrow'

import type { Client } from './types'

import { err, ok } from 'neverthrow'
import { getContext, setContext } from 'svelte'

const CLIENT_CONTEXT_KEY = 'supabase:client'

export const setSupabaseClient = (getter: () => Client) => {
  setContext(CLIENT_CONTEXT_KEY, getter())
}

export const useSupabaseClient = (): Result<Client, void> => {
  const context = getContext<Client | null>(CLIENT_CONTEXT_KEY)
  if (!context) {
    console.error(
      'Unable to find Subapabase client on the tree. Make sure to use `setClient` on the root component.'
    )
    return err()
  }

  return ok(context)
}
