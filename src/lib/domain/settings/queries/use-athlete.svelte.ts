import type { CurrentAthlete } from '$lib/database/types.g'
import type { ProfileSchemaOutput } from '$lib/domain/settings/schemas'

import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query'

import { getSupabaseClient } from '$lib/database/context'

import { athleteOptions } from './athlete'

export const useAthleteQuery = () => createQuery(() => athleteOptions())

export type MutateAthleteInput = ProfileSchemaOutput
type MutateContext = { previous?: CurrentAthlete }

export const createAthleteMutation = (athleteId?: string) => {
  const supabaseResult = getSupabaseClient()
  const queryClient = useQueryClient()
  const options = athleteOptions()

  const isEnabled = supabaseResult.isOk() && !!athleteId
  const supabase = isEnabled ? supabaseResult.value : null

  return createMutation(() => ({
    mutationFn: async (input: MutateAthleteInput) => {
      if (!supabase || !athleteId) {
        throw new Error('Supabase client or athlete ID not available')
      }

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
      const previous = queryClient.getQueryData(options.queryKey)

      queryClient.setQueryData(
        options.queryKey,
        (old) => old
          ? {
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
          : old
      )

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    }
  }))
}
