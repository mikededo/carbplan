import type { Db } from '@carbplan/db'

import type { AthleteProvisioningRepository } from '$modules/auth/provision-athlete'
import type { CatalogRepository } from '$modules/catalog/repository'
import type { AthleteFavoritesRepository } from '$modules/favorites/repository'
import type { MeRepository } from '$modules/me/repository'
import type { OnboardingRepository } from '$modules/onboarding/repository'
import type { PublicCatalogRepository } from '$modules/public/catalog/repository'

import { DbAthleteProvisioningRepository } from '$modules/auth/provision-athlete'
import { DbCatalogRepository } from '$modules/catalog/repository'
import { DbAthleteFavoritesRepository } from '$modules/favorites/repository'
import { DbMeRepository } from '$modules/me/repository'
import { DbOnboardingRepository } from '$modules/onboarding/repository'
import { DbPublicCatalogRepository } from '$modules/public/catalog/repository'

export type AuthRepositories = {
  athleteProvisioning: AthleteProvisioningRepository
}

export type PublicRepositories = {
  catalog: PublicCatalogRepository
}

export type AppRepositories = {
  auth: AuthRepositories
  onboarding: OnboardingRepository
  favorites: AthleteFavoritesRepository
  public: PublicRepositories
  catalog: CatalogRepository
  me: MeRepository
}

export const createRepositories = (db: Db): AppRepositories => ({
  auth: {
    athleteProvisioning: new DbAthleteProvisioningRepository(db)
  },
  catalog: new DbCatalogRepository(db),
  favorites: new DbAthleteFavoritesRepository(db),
  me: new DbMeRepository(db),
  onboarding: new DbOnboardingRepository(db),
  public: {
    catalog: new DbPublicCatalogRepository(db)
  }
})
