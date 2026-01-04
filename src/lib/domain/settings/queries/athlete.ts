import type { Client } from '$lib/database/types'
import type { CurrentAthlete } from '$lib/database/types.g'

import { queryOptions } from '@tanstack/svelte-query'

import { queryKeys } from '$lib/domain/query/keys'

export const athleteOptions = (supabase: Client) =>
  queryOptions({
    queryFn: async (): Promise<CurrentAthlete> => {
      const { data, error } = await supabase
        .from('current_athlete')
        .select('*')
        .single()

      if (error) {
        throw error
      }

      return data
    },
    queryKey: queryKeys.athlete.current(),
    staleTime: Infinity
  })

