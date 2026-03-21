import type { PublicCatalogService } from '$modules/public/catalog/service'
import type { EndpointHeaderPolicy } from '$modules/public/utils/headers'
import type { EndpointRateLimiter, EndpointRateLimitPolicy } from '$modules/public/utils/rate-limit'

import { Elysia, t } from 'elysia'

import { CatalogResponseModel } from '$modules/public/catalog/model'
import { apiErrorFactory, ApiErrorModel } from '$modules/public/model'
import { applyEndpointHeaders } from '$modules/public/utils/headers'
import { resolveRateLimitClientKey } from '$modules/public/utils/rate-limit'

const CATALOG_ENDPOINT_KEY = 'catalog'

const CATALOG_RATE_LIMIT_POLICY: EndpointRateLimitPolicy = {
  maxRequests: 60,
  windowMs: 60_000
}

const CATALOG_HEADER_POLICY: EndpointHeaderPolicy = {
  cacheControl: 'public, max-age=60, stale-while-revalidate=300',
  headers: {
    'x-public-endpoint': CATALOG_ENDPOINT_KEY
  }
}

export type PublicCatalogModuleOptions = {
  limiter: EndpointRateLimiter
  service: PublicCatalogService
}

export const publicCatalogModule = ({ limiter, service }: PublicCatalogModuleOptions) => new Elysia({ name: 'public-catalog' })
  .get('/catalog', async ({ request, server, set, status }) => {
    const clientKey = resolveRateLimitClientKey(request, server)
    const isAllowed = limiter.consume({
      clientKey,
      endpointKey: CATALOG_ENDPOINT_KEY,
      policy: CATALOG_RATE_LIMIT_POLICY
    })

    if (!isAllowed) {
      return status(429, apiErrorFactory.tooManyRequests())
    }

    const catalog = await service.getCatalog()
    const payload = JSON.stringify(catalog)
    const { notModified } = applyEndpointHeaders({
      payload,
      policy: CATALOG_HEADER_POLICY,
      request,
      set
    })

    if (notModified) {
      set.status = 304
      return null
    }

    return catalog
  }, {
    detail: {
      summary: 'Get public catalog',
      tags: ['Public Catalog']
    },
    response: {
      200: CatalogResponseModel,
      304: t.Null(),
      429: ApiErrorModel,
      500: ApiErrorModel
    }
  })
