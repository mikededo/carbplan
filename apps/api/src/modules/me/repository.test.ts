import { createRepositoryDbMock } from '@carbplan/auth/testing'
import { HRZoneModelEnum } from '@carbplan/domain/hr'

import { DbMeRepository } from '$modules/me/repository'

describe('db me repository', () => {
  it('updates the hr zones from an athlete', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueResult(undefined)
    const repository = new DbMeRepository(dbMock.db)

    const result = await repository.updateHRZones('athlete-id', {
      model: HRZoneModelEnum.custom,
      zones: [{ color: '#HEXCOL', maxBpm: 200, maxPercent: 100, minBpm: 50, minPercent: 0, name: 'Z1' }]
    })
    expect(result._unsafeUnwrap()).toBeTruthy()
  })
})
