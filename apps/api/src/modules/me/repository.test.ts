
import type { CurrentAthleteData, UpdateCurrentAthlete } from '$modules/me/model'

import { createRepositoryDbMock } from '@carbplan/auth/testing'
import { HRZoneModelEnum } from '@carbplan/domain/hr'

import { DbMeRepository } from '$modules/me/repository'
import { entityNotFoundTest } from '$test/utils.test'

describe('db me repository', () => {
  describe('.getCurrentAthlete', () => {
    it('returns current athelte data', async () => {
      const model: CurrentAthleteData = {
        avatarUrl: null,
        createdAt: new Date(),
        email: 'test@test.com',
        ftp: null,
        fullName: 'Test User',
        heightCm: 150,
        hrMax: 200,
        hrRest: 40,
        hrZones: null,
        id: crypto.randomUUID(),
        maxCarbIntakeGPerHr: 80,
        onboardingCompleted: true,
        powerZones: null,
        sex: 'male',
        updatedAt: new Date(),
        weightKg: 70
      }
      const dbMock = createRepositoryDbMock()
      dbMock.queueResult([model])
      const repository = new DbMeRepository(dbMock.db)

      await expect(repository.getCurrentAthlete('athlete-id')).toBeOkAsyncWith(model)
    })

    entityNotFoundTest(
      DbMeRepository,
      (repository) => repository.getCurrentAthlete('athlete-id')
    )
  })

  describe('.updateCurrentAthlete', () => {
    it('updates current athete', async () => {
      const model: UpdateCurrentAthlete = {
        fullName: 'Test User',
        heightCm: 150,
        hrMax: 200,
        hrRest: 40,
        maxCarbIntakeGPerHr: 80,
        sex: 'male',
        weightKg: 70
      }
      const dbMock = createRepositoryDbMock()
      dbMock.queueResult([model])
      const repository = new DbMeRepository(dbMock.db)

      await expect(repository.updateCurrentAthlete('athlete-id', model)).toBeOkAsyncWith(true)
    })

    entityNotFoundTest(
      DbMeRepository,
      (repository) => repository.updateCurrentAthlete('athlete-id', { fullName: 'Test user' })
    )
  })

  it('updates the hr zones from an athlete', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueResult(undefined)
    const repository = new DbMeRepository(dbMock.db)

    const result = repository.updateHRZones('athlete-id', {
      model: HRZoneModelEnum.custom,
      zones: [{ color: '#HEXCOL', maxBpm: 200, maxPercent: 100, minBpm: 50, minPercent: 0, name: 'Z1' }]
    })
    await expect(result).toBeOkAsyncWith(true)
  })
})
