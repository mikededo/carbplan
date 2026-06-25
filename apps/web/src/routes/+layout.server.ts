import type { LayoutServerLoad } from './$types'

import * as AuthContracts from '@carbplan/contracts/auth'

import { PRIVATE_API_ORIGIN } from '$env/static/private'
import { AUTH_SESSION_COOKIE_NAME } from '$lib/domain/auth/constants'

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
  const sessionToken = cookies.get(AUTH_SESSION_COOKIE_NAME)
  const response = sessionToken
    ? await fetch(`${PRIVATE_API_ORIGIN}/api/v1/auth/get-session`, {
        headers: { Cookie: `${AUTH_SESSION_COOKIE_NAME}=${sessionToken}` }
      })
    : null
  const auth = response?.ok
    ? AuthContracts.GetSessionResponseSchema.safeParse(await response.json()).data
    : null

  return {
    cookies: cookies.getAll(),
    session: auth?.session ?? null,
    user: auth?.user ?? null
  }
}
