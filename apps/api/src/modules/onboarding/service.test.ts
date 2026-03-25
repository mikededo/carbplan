import { errAsync, okAsync } from 'neverthrow'

import { OnboardingServiceImpl } from '$modules/onboarding/service'
import { DatabaseQueryError } from '$utils/db-error'

describe('onboarding service', () => {
  it('returns completed status from repository', async () => {
    const repository = {
      findCompletionByAthleteId: vi.fn(() => okAsync(({ completed: true }))),
      saveAthleteOnboarding: vi.fn(() => okAsync(undefined))
    }
    const service = new OnboardingServiceImpl(repository)

    const result = await service.hasCompletedOnboarding('athlete-id')

    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual({ completed: true })
  })

  it('maps save success to null response', async () => {
    const repository = {
      findCompletionByAthleteId: vi.fn(() => okAsync({ completed: false })),
      saveAthleteOnboarding: vi.fn(() => okAsync(undefined))
    }
    const service = new OnboardingServiceImpl(repository)

    const result = await service.saveAthleteOnboarding({
      fullName: 'Jane Rider',
      height: 170,
      id: 'athlete-id',
      sex: 'female',
      weight: 58
    })

    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toBeUndefined()
  })

  it('maps repository save errors to a database error', async () => {
    const repository = {
      findCompletionByAthleteId: vi.fn(() => okAsync({ completed: false })),
      saveAthleteOnboarding: vi.fn(() => errAsync(
        new DatabaseQueryError({ cause: '', code: 'UNKNOWN_DB_ERROR' })
      ))
    }
    const service = new OnboardingServiceImpl(repository)

    const result = await service.saveAthleteOnboarding({
      fullName: 'Jane Rider',
      height: 170,
      id: 'athlete-id',
      sex: 'female',
      weight: 58
    })

    expect(result.isErr()).toBe(true)
    const error = result._unsafeUnwrapErr()
    expect(error).toBeInstanceOf(DatabaseQueryError)
    expect(error.code).toBe('UNKNOWN_DB_ERROR')
  })
})
