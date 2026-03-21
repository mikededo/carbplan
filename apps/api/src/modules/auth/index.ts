import type { AuthServer } from '@carbplan/auth'

import { Elysia } from 'elysia'

import { apiErrorFactory } from '$modules/public/model'
import { StatusMap } from '$utils/codes'

type AuthModuleOptions = {
  auth: AuthServer
}

export const authModule = ({ auth }: AuthModuleOptions) => new Elysia({
  name: 'auth-module',
  prefix: '/v1'
}).mount(auth.handler).macro({
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
