import type { ApiClient } from '$lib/api/eden'
import type { HasCompletedOnboardingResponse, SaveOnboardingRequest, SaveOnboardingResponse } from '$lib/api/endpoint-types'

import { unwrapEden } from '$lib/api/eden'

export const createAthletesService = (api: ApiClient) => ({
  hasCompletedOnboarding: () => unwrapEden<HasCompletedOnboardingResponse>(api.v1.athletes.me.onboarding.get()),
  saveOnboarding: (data: SaveOnboardingRequest) => unwrapEden<SaveOnboardingResponse>(api.v1.athletes.me.onboarding.post(data))
})

export type AthletesService = ReturnType<typeof createAthletesService>
