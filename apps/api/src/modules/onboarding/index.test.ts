
import * as OnboardingContracts from '@carbplan/contracts/onboarding'
import { treaty } from '@elysiajs/eden'
import { okAsync } from 'neverthrow'

import { onboardingModule } from '$modules/onboarding'
import { createAuthServerStub } from '$test/stubs/auth-server'

const app = treaty(
  onboardingModule({
    auth: createAuthServerStub(),
    service: {
      hasCompletedOnboarding: () => okAsync({ completed: true }),
      saveAthleteOnboarding: () => okAsync()
    }
  })
)

describe('onboarding HTTP contract', () => {
  it('[GET] /v1/athletes/me/onboarding keeps response contract', async () => {
    const response = await app.v1.athletes.me.onboarding.get()
    expect(response.status).toBe(200)
    expect(OnboardingContracts.HasCompletedOnboardingResponseSchema.safeParse(response.data).success).toBe(true)
  })

  // FIXME: NoContent fail when passing null/undefined: https://github.com/elysiajs/elysia/pull/1810
  it.skip('[POST] /v1/athletes/me/onboarding keeps request/response contract', async () => {
    const response = await app.v1.athletes.me.onboarding.post({
      ftp: 250,
      fullName: 'Jane Rider',
      height: 170,
      hrMax: 210,
      hrRest: 50,
      maxCarbIntake: 60,
      sex: 'female',
      weight: 58
    })

    expect(response.status).toBe(204)
    expect(OnboardingContracts.SaveOnboardingResponseSchema.safeParse(response.data).success).toBeTruthy()
  })
})
