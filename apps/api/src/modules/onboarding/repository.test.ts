import { createRepositoryDbMock } from '@carbplan/auth/testing'

import { DbOnboardingRepository } from '$modules/onboarding/repository'

describe('onboarding repository', () => {
  it('queries onboarding completion by athlete id', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueResult([{ completed: true }])
    const repository = new DbOnboardingRepository(dbMock.db)

    await repository.findCompletionByAthleteId('athlete-id')
      .match(
        (result) => expect(result).toEqual({ completed: true }),
        () => expect.fail('Got error when should result to ok')
      )
  })

  it('returns null when athlete is not found', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueResult([])
    const repository = new DbOnboardingRepository(dbMock.db)

    await repository.findCompletionByAthleteId('athlete-id')
      .match(
        (result) => expect(result).toBeUndefined(),
        () => expect.fail('Got error when should result to ok')
      )
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
    dbMock.queueError(new Error('Error'))
    const repository = new DbOnboardingRepository(dbMock.db)

    await repository.saveAthleteOnboarding({
      fullName: 'Jane Rider',
      height: 170,
      id: 'athlete-id',
      sex: 'female',
      weight: 58
    }).match(
      () => expect.fail('Got ok when should result to err'),
      (error) => expect(error).toBeInstanceOf(Error)
    )
  })
})
