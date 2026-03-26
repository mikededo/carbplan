import type { Db } from '@carbplan/db'
import type { ResultAsync } from 'neverthrow'

import { createRepositoryDbMock } from '@carbplan/auth/testing'

import { EntityNotFound } from '$utils/db-error'

export const entityNotFoundTest = <R, O, E>(
  RepositoryClass: new (db: Db) => R,
  promise: (repository: R) => ResultAsync<O, E>
) => {
  it('returns EntityNotFound if no entry found', async () => {
    const dbMock = createRepositoryDbMock()
    dbMock.queueResult([])
    const repository = new RepositoryClass(dbMock.db)

    await expect(promise(repository)).toBeErrAsyncWith(EntityNotFound)
  })
}
