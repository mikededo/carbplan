import type { Db } from '@carbplan/db'

import type { AthleteProvisioningRepository } from '$modules/auth/provision-athlete'
import type { OnboardingRepository } from '$modules/onboarding/repository'
import type { ProductRepository } from '$modules/products/repository'
import type { PublicCatalogRepository } from '$modules/public/catalog/repository'

import { DbAthleteProvisioningRepository } from '$modules/auth/provision-athlete'
import { DbOnboardingRepository } from '$modules/onboarding/repository'
import { DbProductRepository } from '$modules/products/repository'
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
  products: ProductRepository
  public: PublicRepositories
}

export const createRepositories = (db: Db): AppRepositories => ({
  auth: {
    athleteProvisioning: new DbAthleteProvisioningRepository(db)
  },
  onboarding: new DbOnboardingRepository(db),
  products: new DbProductRepository(db),
  public: {
    catalog: new DbPublicCatalogRepository(db)
  }
})
