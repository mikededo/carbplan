import type { Maybe } from '@carbplan/domain/utils'

import type { Transport } from '$lib/api/transport'
import type { PrivateServices } from '$lib/domain/services/context'

import { createCatalogService, createPublicCatalogService } from '$lib/domain/catalog/service'
import { createDashboardService } from '$lib/domain/dashboard/service'
import { createMeService } from '$lib/domain/me/service'

export const createPrivateServices = (transport: Transport) => ({
  catalog: createCatalogService(transport),
  dashboard: createDashboardService(transport),
  me: createMeService(transport),
  publicCatalog: createPublicCatalogService(transport)
})

export const createPublicServices = (transport: Transport) => ({
  catalog: createPublicCatalogService(transport)
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
