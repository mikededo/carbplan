import type { LayoutLoad } from './$types'

import { createTransport } from '$lib/api/transport'
import { createPrivateServices } from '$lib/domain/services/helpers'

export const prerender = false

export const load: LayoutLoad = async ({ fetch }) => {
  const transport = createTransport({ fetch })

  return {
    privateServices: createPrivateServices(transport),
    transport
  }
}
