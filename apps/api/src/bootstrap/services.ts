import type { Infra } from '$bootstrap/infra'
import type { PublicCatalogService } from '$modules/public/catalog/service'

import { DbPublicCatalogService } from '$modules/public/catalog/service'

export type PublicServices = {
  catalog: PublicCatalogService
}

export type AppServices = {
  public: PublicServices
}

export const createServices = (infra: Infra): AppServices => ({
  public: {
    catalog: new DbPublicCatalogService(infra.db)
  }
})
