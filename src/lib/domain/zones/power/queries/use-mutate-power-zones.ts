import type { Athlete, CurrentAthlete } from '$lib/database/types.g'

import type { PowerZonesData } from '../schemas'

import { createMutation, useQueryClient } from '@tanstack/svelte-query'

import { useSupabaseClient } from '$lib/database/context'
import { athleteOptions } from '$lib/domain/settings/queries'

type MutateContext = { previous?: CurrentAthlete }

export const useMutateAthletePowerZones = (athleteId?: Athlete['id']) => {
  const supabaseResult = useSupabaseClient()
  const queryClient = useQueryClient()
  const options = athleteOptions()

  const isEnabled = supabaseResult.isOk() && !!athleteId
  const supabase = isEnabled ? supabaseResult.value : null

  return createMutation(() => ({
    mutationFn: async (input: PowerZonesData) => {
      if (!supabase || !athleteId) {
        throw new Error('Supabase client or athlete id not available')
      }

      const { data, error } = await supabase
        .from('athletes')
        .update({ power_zones: JSON.stringify(input) })
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
    onMutate: async (input: PowerZonesData) => {
      await queryClient.cancelQueries({ queryKey: options.queryKey })

      const previous = queryClient.getQueryData(options.queryKey)
      queryClient.setQueryData(options.queryKey, (old) => {
        if (!old) {
          return old
        }

        return {
          ...old,
          power_zones: JSON.stringify(input)
        }
      })

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    }
  }))
}
