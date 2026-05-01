import type { User } from '@carbplan/contracts/auth'
import type { Result } from 'neverthrow'

import { err, ok } from 'neverthrow'
import { getContext, setContext } from 'svelte'

const CLIENT_CONTEXT_KEY = 'carbplan:auth'

export const setAuthContext = (getter: () => null | User) => {
  setContext(CLIENT_CONTEXT_KEY, getter())
}

export const getAuthContext = (): Result<null | User, void> => {
  const context = getContext<null | User>(CLIENT_CONTEXT_KEY)
  if (typeof context === 'undefined') {
    console.error(
      'Unable to find auth context on the tree. Make sure to use `setAuthContext` on the root component.'
    )
    return err()
  }

  return ok(context)
}

export const getAuthUserOrNull = () => getAuthContext().unwrapOr(null)

export const invalidateAuthContext = () => {
  setContext(CLIENT_CONTEXT_KEY, null)
}
