import type { Client, Result } from '$lib/database/types'

import { queryOptions, skipToken } from '@tanstack/svelte-query'
import { ok } from 'neverthrow'

import { getSupabaseClient } from '$lib/database/context'
import { queryKeys } from '$lib/domain/query/keys'

const getCatalogQuery = (supabase: Client) => supabase
  .from('brands')
  .select(`
    id,
    name,
    slug,
    logo_url,
    products (*)
  `)
  .eq('is_active', true)
  .order('name')

export const catalogOptions = (supabaseClient?: Client) => {
  const supabase = supabaseClient ? ok(supabaseClient) : getSupabaseClient()

  return queryOptions({
    queryFn: supabase.isOk()
      ? async () => {
        const { data, error } = await getCatalogQuery(supabase.value)

        if (error) {
          throw error
        }

        // Sort products within each brand
        return data.map((brand) => ({
          ...brand,
          products: brand.products.sort((a, b) => a.name.localeCompare(b.name))
        }))
      }
      : skipToken,
    queryKey: queryKeys.catalog.all,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}
export type CatalogResult = Result<typeof getCatalogQuery>
