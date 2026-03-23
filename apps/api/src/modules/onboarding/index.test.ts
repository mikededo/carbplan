import type { SaveAthleteOnboardingData } from '$modules/onboarding/model'

import * as OnboardingContracts from '@carbplan/contracts/onboarding'
import { Elysia } from 'elysia'
import { okAsync } from 'neverthrow'

import { onboardingModule } from '$modules/onboarding'
import { createAuthServerStub } from '$test/stubs/auth-server'

describe('onboarding HTTP contract', () => {
  const createTestApp = () => new Elysia()
    .use(
      onboardingModule({
        auth: createAuthServerStub(),
        service: {
          hasCompletedOnboarding: () => okAsync({ completed: true }),
          saveAthleteOnboarding: () => okAsync(null)
        }
      })
    )

  it('[GET] /v1/athletes/me/onboarding keeps response contract', async () => {
    const app = createTestApp()

    const response = await app.handle(new Request('http://localhost/v1/athletes/me/onboarding'))
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(OnboardingContracts.HasCompletedOnboardingResponseSchema.safeParse(payload).success).toBe(true)
  })

  it('[POST] /v1/athletes/me/onboarding keeps request/response contract', async () => {
    const app = createTestApp()

    const requestPayload: Omit<SaveAthleteOnboardingData, 'id'> = {
      ftp: 250,
      fullName: 'Jane Rider',
      height: 170,
      hrMax: 210,
      hrRest: 50,
      maxCarbIntake: 60,
      sex: 'female',
      weight: 58
    }

    expect(OnboardingContracts.SaveOnboardingRequestSchema.safeParse(requestPayload).success).toBe(true)

    const response = await app.handle(new Request('http://localhost/v1/athletes/me/onboarding', {
      body: JSON.stringify(requestPayload),
      headers: { 'content-type': 'application/json' },
      method: 'POST'
    }))

    expect(response.status).toBe(204)
  })
})
