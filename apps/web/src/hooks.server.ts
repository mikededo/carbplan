import type { Handle } from '@sveltejs/kit'

import { PRIVATE_API_ORIGIN } from '$env/static/private'
import { createTransport } from '$lib/api/transport'
import { createAthletesService } from '$lib/domain/athletes/service'
import { AUTH_SESSION_COOKIE_NAME, AUTH_TOKEN_COOKIE_NAME } from '$lib/domain/auth/constants'
import { createAuthService } from '$lib/domain/auth/service'

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.serverTransport = createTransport({
    baseUrl: PRIVATE_API_ORIGIN,
    fetch: event.fetch,
    getHeaders: () => {
      const sessionToken = event.cookies.get(AUTH_SESSION_COOKIE_NAME)
      const authToken = event.cookies.get(AUTH_TOKEN_COOKIE_NAME)

      if (!sessionToken || !authToken) {
        return undefined
      }

      return {
        Authorization: `Bearer ${authToken}`,
        Cookie: `${AUTH_SESSION_COOKIE_NAME}=${sessionToken}`
      }
    }
  })
  event.locals.authService = createAuthService(event.locals.serverTransport)
  // TODO: Remove since we are using private services
  event.locals.services = {
    athletes: createAthletesService(event.locals.serverTransport)
  }

  const theme = event.cookies.get('theme') ?? 'light'

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%theme%', theme)
  })
}
