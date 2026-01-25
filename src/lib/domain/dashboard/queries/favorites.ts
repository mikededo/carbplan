import type { Client } from '$lib/database/types'

import { queryOptions, skipToken } from '@tanstack/svelte-query'
import { ok } from 'neverthrow'

import { getSupabaseClient } from '$lib/database/context'
import { queryKeys } from '$lib/domain/query/keys'

export const favoriteProductsOptions = (supabaseClient?: Client, limit = 6) => {
  const supabase = supabaseClient ? ok(supabaseClient) : getSupabaseClient()

  return queryOptions({
    queryFn: supabase.isOk()
      ? async () => {
        const { data, error } = await supabase.value
          .from('catalog_products')
          .select('*')
          .eq('is_favorite', true)
          .limit(limit)

        if (error) {
          throw error
        }

        return data
      }
      : skipToken,
    queryKey: queryKeys.favorites.products()
  })
}
