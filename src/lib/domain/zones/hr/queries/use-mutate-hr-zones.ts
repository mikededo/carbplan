import type { Athlete, CurrentAthlete } from '$lib/database/types.g'

import type { HRZonesData } from '../schemas'

import { createMutation, useQueryClient } from '@tanstack/svelte-query'

import { useSupabaseClient } from '$lib/database/context'
import { athleteOptions } from '$lib/domain/settings/queries'

type MutateContext = { previous?: CurrentAthlete }

export const useMutateAthleteHRZones = (athleteId?: Athlete['id']) => {
  const supabaseResult = useSupabaseClient()
  const queryClient = useQueryClient()

  if (supabaseResult.isErr() || !athleteId) {
    return null
  }

  const supabase = supabaseResult.value
  const options = athleteOptions(supabase)

  return createMutation(() => ({
    mutationFn: async (input: HRZonesData) => {
      const { data, error } = await supabase
        .from('athletes')
        .update({ hr_zones: JSON.stringify(input) })
        .eq('id', athleteId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onError: (_, __, context: MutateContext | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(options.queryKey, context.previous)
      }
    },
    onMutate: async (input: HRZonesData) => {
      await queryClient.cancelQueries({ queryKey: options.queryKey })

      const previous = queryClient.getQueryData(options.queryKey)
      queryClient.setQueryData(options.queryKey, (old) => {
        if (!old) {
          return old
        }

        return {
          ...old,
          hr_zones: JSON.stringify(input)
        }
      })

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    }
  }))
}
