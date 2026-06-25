import type { Handle } from '@sveltejs/kit'

import { normalizeURL } from '@carbplan/utils/url'

import { PRIVATE_API_ORIGIN } from '$env/static/private'
import { createApiClient } from '$lib/api/eden'
import { createTransport } from '$lib/api/transport'
import { createAthletesService } from '$lib/domain/athletes/service'
import { AUTH_SESSION_COOKIE_NAME, AUTH_TOKEN_COOKIE_NAME } from '$lib/domain/auth/constants'
import { createAuthService } from '$lib/domain/auth/service'

export const handle: Handle = async ({ event, resolve }) => {
  const serverTransport = createTransport({
    baseUrl: PRIVATE_API_ORIGIN,
    fetch: event.fetch,
    getHeaders: () => {
      const sessionToken = event.cookies.get(AUTH_SESSION_COOKIE_NAME)
      const authToken = event.cookies.get(AUTH_TOKEN_COOKIE_NAME)

      if (!sessionToken && !authToken) {
        return undefined
      }

      const headers: Record<string, string> = {}
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`
      }
      if (sessionToken) {
        headers.Cookie = `${AUTH_SESSION_COOKIE_NAME}=${sessionToken}`
      }

      return headers
    }
  })
  event.locals.authService = createAuthService(serverTransport)
  const api = createApiClient({
    baseUrl: `${normalizeURL(PRIVATE_API_ORIGIN)}/api`,
    fetch: event.fetch,
    getHeaders: () => {
      const sessionToken = event.cookies.get(AUTH_SESSION_COOKIE_NAME)
      const authToken = event.cookies.get(AUTH_TOKEN_COOKIE_NAME)

      if (!sessionToken && !authToken) {
        return undefined
      }

      const headers: Record<string, string> = {}
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`
      }
      if (sessionToken) {
        headers.Cookie = `${AUTH_SESSION_COOKIE_NAME}=${sessionToken}`
      }

      return headers
    }
  })
  event.locals.services = {
    athletes: createAthletesService(api)
  }

  const theme = event.cookies.get('theme') ?? 'light'

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%theme%', theme)
  })
}
