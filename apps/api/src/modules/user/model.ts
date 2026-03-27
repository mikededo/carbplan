import type { DatabaseQueryError, EntityNotFound } from '$utils/db-error'

export type IsUserPlatformAdminError = DatabaseQueryError | EntityNotFound

export class UserNotPlatformAdminError extends Error {
  constructor(message = 'User does not have platform admin privileges') {
    super(message)
    this.name = 'UserNotPlatformAdminError'
  }
}
