import type { Handle } from '@sveltejs/kit'

import { normalizeURL } from '@carbplan/utils/url'

import { PRIVATE_API_ORIGIN } from '$env/static/private'
import { createApiClient } from '$lib/api/eden'
import { createAthletesService } from '$lib/domain/athletes/service'
import { AUTH_SESSION_COOKIE_NAME } from '$lib/domain/auth/constants'

export const handle: Handle = async ({ event, resolve }) => {
  const api = createApiClient({
    baseUrl: `${normalizeURL(PRIVATE_API_ORIGIN)}/api`,
    fetch: event.fetch,
    getHeaders: () => {
      const sessionToken = event.cookies.get(AUTH_SESSION_COOKIE_NAME)

      if (!sessionToken) {
        return undefined
      }

      return { Cookie: `${AUTH_SESSION_COOKIE_NAME}=${sessionToken}` }
    }
  })
  event.locals.athletes = createAthletesService(api)

  const theme = event.cookies.get('theme') ?? 'light'

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%theme%', theme)
  })
}
