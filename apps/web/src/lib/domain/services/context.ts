import type { Result } from 'neverthrow'

import type { createPrivateServices, createPublicServices } from '$lib/domain/services/helpers'

import { err, ok } from 'neverthrow'
import { getContext, setContext } from 'svelte'

const PRIVATE_SERVICES_CONTEXT_KEY = Symbol.for('kilo:private-services')

export type PrivateServices = ReturnType<typeof createPrivateServices>

export const createPrivateServicesContext = (getter: () => PrivateServices) => {
  setContext(PRIVATE_SERVICES_CONTEXT_KEY, getter())
}

export const getPrivateServicesContext = (): Result<PrivateServices, void> => {
  const context = getContext<PrivateServices | undefined>(PRIVATE_SERVICES_CONTEXT_KEY)
  if (typeof context === 'undefined') {
    console.error(
      'Unable to find private services on tree. Make sure to use `setPrivateServicesContext` on private layout.'
    )
    return err()
  }

  return ok(context)
}

const PUBLIC_SERVICES_CONTEXT_KEY = Symbol.for('kilo:public-services')
export type PublicServices = ReturnType<typeof createPublicServices>

export const createPublicServicesContext = (getter: () => PublicServices) => {
  setContext(PUBLIC_SERVICES_CONTEXT_KEY, getter())
}

export const getPublicServicesContext = (): Result<PublicServices, void> => {
  const context = getContext<PublicServices | undefined>(PUBLIC_SERVICES_CONTEXT_KEY)
  if (typeof context === 'undefined') {
    console.error(
      'Unable to find public services on tree. Make sure to use `setPublicServicesContext` on root layout.'
    )
    return err()
  }

  return ok(context)
}
