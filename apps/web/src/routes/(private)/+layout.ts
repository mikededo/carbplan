import type { LayoutLoad } from './$types'

import { createApiClient } from '$lib/api/eden'
import { createPrivateServices } from '$lib/domain/services/helpers'

export const prerender = false

export const load: LayoutLoad = async ({ fetch }) => {
  const api = createApiClient({ fetch })

  return {
    privateServices: createPrivateServices(api)
  }
}
