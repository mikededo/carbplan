import type { Transport } from '$lib/api/transport'

import * as AuthContracts from '@carbplan/contracts/auth'

import { getApiRoute } from '$lib/api/routes'

const getAuthRoute = getApiRoute.prefixed('/auth')

export const createAuthService = (transport: Transport) => ({
  getSession: () => transport.get({
    path: getAuthRoute('/get-session'),
    schema: AuthContracts.GetSessionResponseSchema
  }),
  signIn: (body: AuthContracts.SignInRequest) => transport.post({
    body,
    includeMeta: true,
    path: getAuthRoute('/sign-in/email'),
    schema: AuthContracts.SignInResponseSchema
  }),
  signOut: () => transport.post({
    path: getAuthRoute('/sign-out'),
    schema: AuthContracts.SignOutResponseSchema
  }),
  signUp: (body: AuthContracts.SignUpRequest) => transport.post({
    body,
    includeMeta: true,
    path: getAuthRoute('/sign-up/email'),
    schema: AuthContracts.SignInResponseSchema
  })
})

export type AuthService = ReturnType<typeof createAuthService>
