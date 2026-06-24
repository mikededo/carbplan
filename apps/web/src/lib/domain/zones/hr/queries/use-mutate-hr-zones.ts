import type { AthleteId } from '@carbplan/domain/athlete'
import type { HRZonesData } from '@carbplan/domain/hr'

import type { CurrentAthlete, UpdateHRZonesInput } from '$lib/domain/me/service'

import { createMutation, useQueryClient } from '@tanstack/svelte-query'
import { err, ok } from 'neverthrow'

import { resultAsyncValueOrThrow } from '$lib/domain/query/utils'
import { getPrivateServicesContext } from '$lib/domain/services/context'
import { requireServicesWith } from '$lib/domain/services/helpers'
import { athleteOptions } from '$lib/domain/settings/queries/athlete'

type MutateContext = { previous?: CurrentAthlete }

export const createAthleteHRZonesMutation = (athleteId?: AthleteId) => {
  const privateServicesResult = getPrivateServicesContext()
  const queryClient = useQueryClient()
  const options = athleteOptions(
    privateServicesResult.isOk() ? ok(privateServicesResult.value.me) : err()
  )

  const isEnabled = privateServicesResult.isOk() && !!athleteId
  const services = isEnabled ? privateServicesResult.value : null

  return createMutation(() => ({
    mutationFn: async (input: UpdateHRZonesInput) => {
      requireServicesWith(services, !!athleteId)
      return resultAsyncValueOrThrow(services.me.updateHRZones(input))
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

        return { ...old, hrZones: input }
      })

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    }
  }))
}
