import type { PublicCatalogService } from './catalog/service'

import { Elysia } from 'elysia'

import { publicCatalogModule } from './catalog'
import { createEndpointRateLimiter } from './utils/rate-limit'

export type PublicModuleOptions = {
  services: {
    catalog: PublicCatalogService
  }
}

export const publicModule = ({ services }: PublicModuleOptions) => {
  const limiter = createEndpointRateLimiter()

  return new Elysia({ name: 'public', prefix: '/v1/public' })
    .use(
      publicCatalogModule({ limiter, service: services.catalog })
    )
}
