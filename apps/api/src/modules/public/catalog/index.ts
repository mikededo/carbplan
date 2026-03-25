import type { PublicCatalogService } from '$modules/public/catalog/service'
import type { EndpointHeaderPolicy } from '$modules/public/utils/headers'
import type { EndpointRateLimiter, EndpointRateLimitPolicy } from '$modules/public/utils/rate-limit'

import * as CatalogContracts from '@carbplan/contracts/catalog'
import { Elysia } from 'elysia'

import { CatalogQueryValidationError } from '$modules/public/catalog/model'
import { apiErrorFactory, BadRequestErrorModel, InternalServerErrorModel, PreconditionFailedErrorModel } from '$modules/public/model'
import { applyEndpointHeaders } from '$modules/public/utils/headers'
import { resolveRateLimitClientKey } from '$modules/public/utils/rate-limit'
import { StatusMap } from '$utils/codes'

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
  .get('/catalog', async ({ query, request, server, set, status }) => {
    const clientKey = resolveRateLimitClientKey(request, server)
    const isAllowed = limiter.consume({
      clientKey,
      endpointKey: CATALOG_ENDPOINT_KEY,
      policy: CATALOG_RATE_LIMIT_POLICY
    })

    if (!isAllowed) {
      return status(StatusMap.PreconditionFailed, apiErrorFactory.preconditionFailed())
    }

    return service.getCatalogProducts(query).match(
      (result) => {
        const { notModified } = applyEndpointHeaders({
          payload: JSON.stringify(result),
          policy: CATALOG_HEADER_POLICY,
          request,
          set
        })

        if (notModified) {
          return status(StatusMap.NotModified, undefined)
        }

        return status(StatusMap.OK, result)
      },
      (error) => {
        if (error instanceof CatalogQueryValidationError) {
          return status(StatusMap.BadRequest, apiErrorFactory.badRequest({ message: error.message }))
        }

        return status(StatusMap.InternalServerError, apiErrorFactory.internal())
      }
    )
  }, {
    detail: {
      summary: 'Get public catalog',
      tags: ['Public Catalog']
    },
    query: CatalogContracts.CatalogProductsListQuerySchema,
    response: {
      [StatusMap.BadRequest]: BadRequestErrorModel,
      [StatusMap.InternalServerError]: InternalServerErrorModel,
      [StatusMap.NotModified]: CatalogContracts.CatalogProductListCachedResponseSchema,
      [StatusMap.OK]: CatalogContracts.CatalogProductsListResponseSchema,
      [StatusMap.PreconditionFailed]: PreconditionFailedErrorModel
    }
  })
