import type { LayoutLoad } from './$types'

import { createPrivateServices } from '$lib/domain/services/helpers'

export const prerender = false

export const load: LayoutLoad = async ({ parent }) => {
  const { api } = await parent()

  return {
    privateServices: createPrivateServices(api)
  }
}
