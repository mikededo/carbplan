import type { AuthServer } from '@carbplan/auth'

import { Elysia } from 'elysia'

import { createLoggerModule } from '$bootstrap/logger'
import { apiErrorFactory } from '$modules/public/model'
import { StatusMap } from '$utils/codes'

type AuthModuleOptions = {
  auth: AuthServer
}

export const authModule = ({ auth }: AuthModuleOptions) => new Elysia({
  name: 'auth-module',
  prefix: '/v1'
})
  .use(createLoggerModule())
  // Map all authentication routes to better auth equivalent, and also hide
  // them from the docs, as we are using the better auth openapi spec
  .all('/auth/*', ({ request }) => auth.handler(request), { detail: { hide: true } })
  .macro({
    auth: {
      async resolve({ request: { headers }, status }) {
        const authSession = await auth.api.getSession({ headers })
        if (!authSession) {
          return status(StatusMap.Unauthorized, apiErrorFactory.unauthorized())
        }

        return {
          session: authSession.session,
          user: authSession.user
        }
      }
    }
  })
