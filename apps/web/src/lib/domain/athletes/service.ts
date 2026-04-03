import type { Transport } from '$lib/api/transport'

import * as OnboardingContracts from '@carbplan/contracts/onboarding'

import { getApiRoute } from '$lib/api/routes'

const getAthletesRoute = getApiRoute.prefixed('/athletes')

export const createAthletesService = (transport: Transport) => ({
  hasCompletedOnboarding: () => transport.get({
    path: getAthletesRoute('/me/onboarding'),
    schema: OnboardingContracts.HasCompletedOnboardingResponseSchema
  }),
  saveOnboarding: (data: OnboardingContracts.SaveOnboardingRequest) => transport.post({
    body: data,
    path: getAthletesRoute('/me/onboarding'),
    schema: OnboardingContracts.SaveOnboardingResponseSchema
  })
})

export type AthletesService = ReturnType<typeof createAthletesService>
