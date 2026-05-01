import { createQuery } from '@tanstack/svelte-query'
import { err, ok } from 'neverthrow'

import { getPrivateServicesContext } from '$lib/domain/services/context'

import { catalogOptions } from './catalog'

export const useCatalogQuery = () => {
  const privateServices = getPrivateServicesContext()

  return createQuery(() => catalogOptions(
    privateServices.isOk() ? ok(privateServices.value.catalog) : err()
  ))
}
