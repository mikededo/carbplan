import type { Client } from '$lib/database/types'

import { queryOptions } from '@tanstack/svelte-query'

import { queryKeys } from '$lib/domain/query/keys'
import { parseHRZones } from '$lib/domain/zones/hr/schemas'

export const athleteOptions = (supabase: Client) =>
  queryOptions({
    queryFn: async () => {
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
    select: (data) => {
      if (!data) {
        return data
      }

      const parsedHRZones = parseHRZones(JSON.parse(data.hr_zones as string ?? '{}'))
      return {
        ...data,
        hr_zones: parsedHRZones.success ? parsedHRZones.output : undefined
      }
    },
    staleTime: Infinity
  })

