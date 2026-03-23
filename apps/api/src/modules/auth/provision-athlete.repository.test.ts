import { createRepositoryDbMock } from '@carbplan/auth/testing'
import { describe, expect, it } from 'vitest'

import { DbAthleteProvisioningRepository } from '$modules/auth/provision-athlete'

describe('athlete provisioning repository', () => {
  it('upserts athlete row', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueResult(undefined)
    const repository = new DbAthleteProvisioningRepository(dbMock.db)

    await repository.upsertAthlete({
      email: 'athlete@carbplan.app',
      id: 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d'
    })
  })

  it('propagates db failures', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueError(new Error('db failed'))
    const repository = new DbAthleteProvisioningRepository(dbMock.db)

    await expect(repository.upsertAthlete({
      email: 'athlete@carbplan.app',
      id: 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d'
    })).rejects.toThrow('db failed')
  })
})
