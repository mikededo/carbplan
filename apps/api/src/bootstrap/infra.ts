import type { AuthServer } from '@carbplan/auth'
import type { Db } from '@carbplan/db'

import { createAuthServer } from '@carbplan/auth'
import { createDb } from '@carbplan/db'

import { upsertAthleteForUser } from '$modules/auth/provision-athlete'

export type Infra = {
  auth: AuthServer
  db: Db
}

type CreateInfraOptions = {
  authBasePath: string
  authBaseUrl: string
  authSecret: string
  authTrustedOrigins: string[]
  databaseUrl: string
}

export const createInfra = ({
  authBasePath,
  authBaseUrl,
  authSecret,
  authTrustedOrigins,
  databaseUrl
}: CreateInfraOptions): Infra => {
  const { db } = createDb(databaseUrl)
  const auth = createAuthServer({
    basePath: authBasePath,
    baseURL: authBaseUrl,
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            await upsertAthleteForUser(db, user)
          }
        },
        update: {
          after: async (user) => {
            await upsertAthleteForUser(db, user)
          }
        }
      }
    },
    db,
    secret: authSecret,
    trustedOrigins: authTrustedOrigins
  })

  return {
    auth,
    db
  }
}
