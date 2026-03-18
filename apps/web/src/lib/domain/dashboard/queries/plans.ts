import type { Client } from '$lib/database/types'

import { queryOptions, skipToken } from '@tanstack/svelte-query'
import { ok } from 'neverthrow'

import { getSupabaseClient } from '$lib/database/context'
import { queryKeys } from '$lib/domain/query/keys'

export const recentPlansOptions = (supabaseClient?: Client, limit = 5) => {
  const supabase = supabaseClient ? ok(supabaseClient) : getSupabaseClient()

  return queryOptions({
    queryFn: supabase.isOk()
      ? async () => {
        const { data, error } = await supabase.value
          .from('plans_with_summary')
          .select('*')
          .order('date', { ascending: false })
          .limit(limit)

        if (error) {
          throw error
        }

        return data
      }
      : skipToken,
    queryKey: queryKeys.plans.recent(limit)
  })
}

export const nextPlanOptions = (supabaseClient?: Client) => {
  const supabase = supabaseClient ? ok(supabaseClient) : getSupabaseClient()
  const today = new Date().toISOString().split('T')[0]

  return queryOptions({
    queryFn: supabase.isOk()
      ? async () => {
        const { data, error } = await supabase.value
          .from('plans_with_summary')
          .select('*')
          .gte('date', today)
          .order('date', { ascending: true })
          .limit(1)
          .maybeSingle()

        if (error) {
          throw error
        }

        return data
      }
      : skipToken,
    queryKey: queryKeys.plans.next()
  })
}
