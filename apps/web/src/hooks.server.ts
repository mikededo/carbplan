import type { Handle } from '@sveltejs/kit'

import { PUBLIC_API_URL } from '$env/static/public'
import { createTransport } from '$lib/api/transport'
import { createAthletesService } from '$lib/domain/athletes/service'
import { AUTH_SESSION_COOKIE_NAME, AUTH_TOKEN_COOKIE_NAME } from '$lib/domain/auth/constants'
import { createAuthService } from '$lib/domain/auth/service'

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.serverTransport = createTransport({
    baseUrl: PUBLIC_API_URL,
    fetch: event.fetch,
    getHeaders: () => {
      const sessionToken = event.cookies.get(AUTH_SESSION_COOKIE_NAME)
      const authToken = event.cookies.get(AUTH_TOKEN_COOKIE_NAME)

      if (!sessionToken || !authToken) {
        return undefined
      }

      return {
        Authorization: authToken,
        Cookie: `better-auth.session_token=${sessionToken}`
      }
    }
  })
  event.locals.authService = createAuthService(event.locals.serverTransport)
  event.locals.services = {
    athletes: createAthletesService(event.locals.serverTransport)
  }

  const theme = event.cookies.get('theme') ?? 'light'

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%theme%', theme)
  })
}
