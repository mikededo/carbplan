import type { AuthServer } from '@carbplan/auth'

import type { Infra } from '$bootstrap/infra'
import type { OnboardingService } from '$modules/onboarding/service'
import type { PublicCatalogService } from '$modules/public/catalog/service'

import { DbOnboardingService } from '$modules/onboarding/service'
import { DbPublicCatalogService } from '$modules/public/catalog/service'

export type PublicServices = {
  catalog: PublicCatalogService
}

export type AppServices = {
  auth: AuthServer
  public: PublicServices
  onboarding: OnboardingService
}

export const createServices = (infra: Infra): AppServices => ({
  auth: infra.auth,
  onboarding: new DbOnboardingService(infra.db),
  public: {
    catalog: new DbPublicCatalogService(infra.db)
  }
})
