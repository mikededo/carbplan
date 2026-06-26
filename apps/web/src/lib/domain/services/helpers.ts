import type { Maybe } from '@kilo/domain/utils'

import type { ApiClient } from '$lib/api/eden'
import type { PrivateServices } from '$lib/domain/services/context'

import { createCatalogService, createPublicCatalogService } from '$lib/domain/catalog/service'
import { createDashboardService } from '$lib/domain/dashboard/service'
import { createMeService } from '$lib/domain/me/service'

export const createPrivateServices = (api: ApiClient) => ({
  catalog: createCatalogService(api),
  dashboard: createDashboardService(api),
  me: createMeService(api),
  publicCatalog: createPublicCatalogService(api)
})

export const createPublicServices = (api: ApiClient) => ({
  catalog: createPublicCatalogService(api)
})

// eslint-disable-next-line func-style
export function requireServicesWith(
  services: Maybe<PrivateServices>,
  condition?: boolean
): asserts services is PrivateServices {
  if (!services || !condition) {
    throw new Error('Private services or athlete ID not available')
  }
}
