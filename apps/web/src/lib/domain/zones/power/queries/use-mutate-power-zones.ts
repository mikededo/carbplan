import type * as MeContracts from '@carbplan/contracts/me'
import type { AthleteId } from '@carbplan/domain/athlete'

import { createMutation, useQueryClient } from '@tanstack/svelte-query'
import { err, ok } from 'neverthrow'

import { resultAsyncValueOrThrow } from '$lib/domain/query/utils'
import { getPrivateServicesContext } from '$lib/domain/services/context'
import { requireServicesWith } from '$lib/domain/services/helpers'
import { athleteOptions } from '$lib/domain/settings/queries/athlete'

type MutateContext = { previous?: MeContracts.GetCurrentAthleteResponse }

export const createAthletePowerZonesMutation = (athleteId?: AthleteId) => {
  const privateServicesResult = getPrivateServicesContext()
  const queryClient = useQueryClient()
  const options = athleteOptions(
    privateServicesResult.isOk() ? ok(privateServicesResult.value.me) : err()
  )

  const isEnabled = privateServicesResult.isOk() && !!athleteId
  const services = isEnabled ? privateServicesResult.value : null

  return createMutation(() => ({
    mutationFn: async (input: MeContracts.UpdatePowerZonesRequest) => {
      requireServicesWith(services, !!athleteId)
      return resultAsyncValueOrThrow(services.me.updatePowerZones(input))
    },
    onError: (_, __, context: MutateContext | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(options.queryKey, context.previous)
      }
    },
    onMutate: async (input: MeContracts.UpdatePowerZonesRequest) => {
      await queryClient.cancelQueries({ queryKey: options.queryKey })

      const previous = queryClient.getQueryData(options.queryKey)
      queryClient.setQueryData(options.queryKey, (old) => {
        if (!old) {
          return old
        }

        return { ...old, powerZones: input }
      })

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    }
  }))
}
