
import type { Client } from '$lib/database/types'

import { queryOptions, skipToken } from '@tanstack/svelte-query'
import { ok } from 'neverthrow'

import { getSupabaseClient } from '$lib/database/context'
import { queryKeys } from '$lib/domain/query/keys'
import { parseHRZones } from '$lib/domain/zones/hr/schemas'
import { parsePowerZones } from '$lib/domain/zones/power/schemas'

export const athleteOptions = (supabaseClient?: Client) => {
  const supabase = supabaseClient ? ok(supabaseClient) : getSupabaseClient()

  return queryOptions({
    queryFn: supabase.isOk()
      ? async () => {
        const { data, error } = await supabase.value
          .from('current_athlete')
          .select('*')
          .single()

        if (error) {
          throw error
        }

        return data
      }
      : skipToken,
    queryKey: queryKeys.athlete.current(),
    select: (data) => {
      if (!data) {
        return data
      }

      const parsedHRZones = parseHRZones(JSON.parse(data.hr_zones as string ?? '{}'))
      const parsedPowerZones = parsePowerZones(JSON.parse(data.power_zones as string ?? '{}'))
      return {
        ...data,
        hr_zones: parsedHRZones.success ? parsedHRZones.output : undefined,
        power_zones: parsedPowerZones.success ? parsedPowerZones.output : undefined
      }
    },
    staleTime: Infinity
  })
}
