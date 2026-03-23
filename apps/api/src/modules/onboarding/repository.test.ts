import { createRepositoryDbMock } from '@carbplan/auth/testing'

import { DbOnboardingRepository } from '$modules/onboarding/repository'

describe('onboarding repository', () => {
  it('queries onboarding completion by athlete id', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueResult([{ completed: true }])
    const repository = new DbOnboardingRepository(dbMock.db)

    const result = await repository.findCompletionByAthleteId('athlete-id')

    expect(result).toEqual({ completed: true })
  })

  it('returns null when athlete is not found', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueResult([])
    const repository = new DbOnboardingRepository(dbMock.db)

    const result = await repository.findCompletionByAthleteId('athlete-id')

    expect(result).toBeNull()
  })

  it('updates onboarding data and marks completion', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueResult(undefined)
    const repository = new DbOnboardingRepository(dbMock.db)

    await repository.saveAthleteOnboarding({
      fullName: 'Jane Rider',
      height: 170,
      id: 'athlete-id',
      sex: 'female',
      weight: 58
    })
  })

  it('propagates db errors when updating onboarding data', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueError(new Error('db failed'))
    const repository = new DbOnboardingRepository(dbMock.db)

    await expect(repository.saveAthleteOnboarding({
      fullName: 'Jane Rider',
      height: 170,
      id: 'athlete-id',
      sex: 'female',
      weight: 58
    })).rejects.toThrow('db failed')
  })
})
