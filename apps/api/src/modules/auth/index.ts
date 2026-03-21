import type { AuthServer } from '@carbplan/auth'

import { Elysia, StatusMap } from 'elysia'

type AuthModuleOptions = {
  auth: AuthServer
}

export const authModule = async ({ auth }: AuthModuleOptions) => new Elysia({
  name: 'auth-module',
  prefix: '/v1'
}).mount(auth.handler).macro({
  auth: {
    async resolve({ request: { headers }, status }) {
      const session = await auth.api.getSession({ headers })
      if (!session) {
        return status(StatusMap.Unauthorized)
      }

      return {
        session: session.session,
        user: session.user
      }
    }
  }
})
