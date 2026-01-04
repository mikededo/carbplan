import type { CurrentAthlete } from '$lib/database/types.g'
import type { ProfileSchemaOutput } from '$lib/domain/settings/schemas'

import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query'

import { useSupabaseClient } from '$lib/database/context'

import { athleteOptions } from './athlete'

export const useAthlete = () => {
  const supabaseResult = useSupabaseClient()
  if (supabaseResult.isErr()) {
    return null
  }

  return createQuery(() => athleteOptions(supabaseResult.value))
}

export type MutateAthleteInput = ProfileSchemaOutput
type MutateContext = { previous?: CurrentAthlete }

export const useMutateAthlete = (athleteId?: string) => {
  const supabaseResult = useSupabaseClient()
  const queryClient = useQueryClient()

  if (supabaseResult.isErr() || !athleteId) {
    return null
  }

  const supabase = supabaseResult.value
  const options = athleteOptions(supabase)

  return createMutation(() => ({
    mutationFn: async (input: MutateAthleteInput) => {
      const { data, error } = await supabase
        .from('athletes')
        .update({
          ftp: input.ftp,
          full_name: input.fullName,
          height_cm: input.height,
          hr_max: input.hrMax,
          hr_rest: input.hrRest,
          max_carb_intake_g_per_hr: input.maxCarbIntake,
          sex: input.sex,
          weight_kg: input.weight
        })
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
    onMutate: async (input: MutateAthleteInput) => {
      await queryClient.cancelQueries({ queryKey: options.queryKey })

      const previous = queryClient.getQueryData<CurrentAthlete>(options.queryKey)

      queryClient.setQueryData<CurrentAthlete>(options.queryKey, (old) => {
        if (!old) {
          return old
        }

        return {
          ...old,
          ftp: input.ftp ?? old.ftp,
          full_name: input.fullName ?? old.full_name,
          height_cm: input.height ?? old.height_cm,
          hr_max: input.hrMax ?? old.hr_max,
          hr_rest: input.hrRest ?? old.hr_rest,
          max_carb_intake_g_per_hr: input.maxCarbIntake ?? old.max_carb_intake_g_per_hr,
          sex: input.sex ?? old.sex,
          weight_kg: input.weight ?? old.weight_kg
        }
      })

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    }
  }))
}
