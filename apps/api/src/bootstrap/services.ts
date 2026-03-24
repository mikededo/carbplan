import type { AuthServer } from '@carbplan/auth'

import type { AppRepositories } from '$bootstrap/repositories'
import type { MeService } from '$modules/me/service'
import type { OnboardingService } from '$modules/onboarding/service'
import type { ProductService } from '$modules/products/service'
import type { PublicCatalogService } from '$modules/public/catalog/service'

import { MeServiceImpl } from '$modules/me/service'
import { OnboardingServiceImpl } from '$modules/onboarding/service'
import { ProductServiceImpl } from '$modules/products/service'
import { PublicCatalogServiceImpl } from '$modules/public/catalog/service'

export type PublicServices = {
  catalog: PublicCatalogService
}

export type AppServices = {
  auth: AuthServer
  me: MeService
  public: PublicServices
  onboarding: OnboardingService
  products: ProductService
}

type CreateServicesOptions = {
  auth: AuthServer
  repositories: AppRepositories
}

export const createServices = ({ auth, repositories }: CreateServicesOptions): AppServices => ({
  auth,
  me: new MeServiceImpl(repositories.me),
  onboarding: new OnboardingServiceImpl(repositories.onboarding),
  products: new ProductServiceImpl(repositories.products),
  public: {
    catalog: new PublicCatalogServiceImpl(repositories.public.catalog)
  }
})
