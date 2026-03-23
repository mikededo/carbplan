import type { AuthServer } from '@carbplan/auth'
import type { Db } from '@carbplan/db'

import type { AppRepositories } from '$bootstrap/repositories'

import { createAuthServer } from '@carbplan/auth'
import { createDb } from '@carbplan/db'

import { createRepositories } from '$bootstrap/repositories'
import { AthleteProvisioningServiceImpl, upsertAthleteForUser } from '$modules/auth/provision-athlete'

export type Infra = {
  auth: AuthServer
  db: Db
  repositories: AppRepositories
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
  const repositories = createRepositories(db)
  const athleteProvisioningService = new AthleteProvisioningServiceImpl(repositories.auth.athleteProvisioning)
  const auth = createAuthServer({
    basePath: authBasePath,
    baseURL: authBaseUrl,
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            await upsertAthleteForUser(athleteProvisioningService, user)
          }
        },
        update: {
          after: async (user) => {
            await upsertAthleteForUser(athleteProvisioningService, user)
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
    db,
    repositories
  }
}
