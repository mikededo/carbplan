import type { AuthServer } from '@carbplan/auth'

import type { AppRepositories } from '$bootstrap/repositories'
import type { CatalogService } from '$modules/catalog/services'
import type { AthleteFavoritesService } from '$modules/favorites/service'
import type { MeService } from '$modules/me/service'
import type { NutritionPlansService } from '$modules/nutrition-plans/service'
import type { OnboardingService } from '$modules/onboarding/service'
import type { PublicCatalogService } from '$modules/public/catalog/service'

import { CatalogServiceImpl } from '$modules/catalog/services'
import { AthletesFavoritesServiceImpl } from '$modules/favorites/service'
import { MeServiceImpl } from '$modules/me/service'
import { NutritionPlanServiceImpl } from '$modules/nutrition-plans/service'
import { OnboardingServiceImpl } from '$modules/onboarding/service'
import { PublicCatalogServiceImpl } from '$modules/public/catalog/service'

export type PublicServices = {
  catalog: PublicCatalogService
}

export type AppServices = {
  auth: AuthServer
  me: MeService
  public: PublicServices
  onboarding: OnboardingService
  favorites: AthleteFavoritesService
  catalog: CatalogService
  nutritionPlans: NutritionPlansService
}

type CreateServicesOptions = {
  auth: AuthServer
  repositories: AppRepositories
}

export const createServices = ({ auth, repositories }: CreateServicesOptions): AppServices => ({
  auth,
  catalog: new CatalogServiceImpl(repositories.catalog, repositories.user),
  favorites: new AthletesFavoritesServiceImpl(repositories.favorites),
  me: new MeServiceImpl(repositories.me),
  nutritionPlans: new NutritionPlanServiceImpl(repositories.nutritionPlans),
  onboarding: new OnboardingServiceImpl(repositories.onboarding),
  public: {
    catalog: new PublicCatalogServiceImpl(repositories.public.catalog)
  }
})
