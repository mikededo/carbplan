import type { Db, UserId } from '@carbplan/db'

import type { IsUserPlatformAdminError } from '$modules/user/model'

import { users } from '@carbplan/db'
import { eq } from 'drizzle-orm'
import { head } from 'es-toolkit'
import { err, ok, ResultAsync } from 'neverthrow'

import { EntityNotFound, mapDbError } from '$utils/db-error'

export type UserRepository = {
  isUserPlatformAdmin: (id: UserId) => ResultAsync<boolean, IsUserPlatformAdminError>
}

export class DbUserRepository implements UserRepository {
  constructor(private readonly db: Db) { }

  isUserPlatformAdmin(id: UserId): ResultAsync<boolean, IsUserPlatformAdminError> {
    return ResultAsync.fromPromise(
      this.db.select({ isAdmin: users.isAdmin }).from(users).where(eq(users.id, id)).limit(1),
      mapDbError
    ).andThen((items) => {
      const item = head(items)
      return item ? ok(item.isAdmin) : err(EntityNotFound.withEntityName('User'))
    })
  }
}
