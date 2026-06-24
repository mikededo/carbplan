import type { CurrentAthlete, UpdateCurrentAthleteInput } from '$lib/domain/me/service'

import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query'
import { err, ok } from 'neverthrow'

import { getPrivateServicesContext } from '$lib/domain/services/context'
import { requireServicesWith } from '$lib/domain/services/helpers'

import { athleteOptions } from './athlete'

export const useAthleteQuery = () => {
  const privateServices = getPrivateServicesContext()

  return createQuery(() => athleteOptions(
    privateServices.isOk() ? ok(privateServices.value.me) : err()
  ))
}

type MutateContext = { previous?: CurrentAthlete }

export const createAthleteMutation = (athleteId?: string) => {
  const privateServicesResult = getPrivateServicesContext()
  const queryClient = useQueryClient()
  const options = athleteOptions(
    privateServicesResult.isOk() ? ok(privateServicesResult.value.me) : err()
  )

  const isEnabled = privateServicesResult.isOk() && !!athleteId
  const services = isEnabled ? privateServicesResult.value : null

  return createMutation(() => ({
    mutationFn: async (input: UpdateCurrentAthleteInput) => {
      requireServicesWith(services, !!athleteId)

      const result = await services.me.updateCurrentAthlete(input)
      if (result.isErr()) {
        throw result.error
      }

      return result.value
    },
    onError: (_, __, context: MutateContext | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(options.queryKey, context.previous)
      }
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: options.queryKey })
      const previous = queryClient.getQueryData(options.queryKey)

      queryClient.setQueryData(options.queryKey, (old) => {
        if (!old) {
          return old
        }

        return {
          ...old,
          ftp: input.ftp ?? old.ftp,
          fullName: input.fullName ?? old.fullName,
          heightCm: input.heightCm ?? old.heightCm,
          hrMax: input.hrMax ?? old.hrMax,
          hrRest: input.hrRest ?? old.hrRest,
          maxCarbIntakeGPerHr: input.maxCarbIntakeGPerHr ?? old.maxCarbIntakeGPerHr,
          sex: input.sex ?? old.sex,
          weightKg: input.weightKg ?? old.weightKg
        }
      })

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    }
  }))
}
