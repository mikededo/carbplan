import type { ApiBody, ApiClient, ApiData } from '$lib/api/eden'

import { unwrapEden } from '$lib/api/eden'

export type HasCompletedOnboarding = ApiData<ApiClient['v1']['athletes']['me']['onboarding']['get']>
export type SaveOnboardingInput = ApiBody<ApiClient['v1']['athletes']['me']['onboarding']['post']>

export const createAthletesService = (api: ApiClient) => ({
  hasCompletedOnboarding: () => unwrapEden(api.v1.athletes.me.onboarding.get()),
  saveOnboarding: (data: SaveOnboardingInput) => unwrapEden(api.v1.athletes.me.onboarding.post(data))
})

export type AthletesService = ReturnType<typeof createAthletesService>
