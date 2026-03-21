import type { AuthServer } from '@carbplan/auth'

import { Elysia, StatusMap } from 'elysia'

export type AuthModuleOptions = {
  auth: AuthServer
}

export const authModule = ({ auth }: AuthModuleOptions) => new Elysia({
  name: 'auth-module',
  prefix: '/v1'
}).mount(
  auth.handler,
  {
    detail: {
      description: 'Mounted endpoints on a better-auth authentication system',
      tags: ['Auth']
    }
  }
).macro({
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
