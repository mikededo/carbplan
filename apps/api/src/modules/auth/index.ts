import type { AuthServer } from '@carbplan/auth'

import { Elysia } from 'elysia'

export type AuthModuleOptions = {
  auth: AuthServer
}

export const authModule = ({ auth }: AuthModuleOptions) => new Elysia({
  name: 'auth-module',
  prefix: '/v1'
})
  .all('/auth', ({ request }) => auth.handler(request), { tags: ['Auth'] })
  .all('/auth/*', ({ request }) => auth.handler(request), { tags: ['Auth'] })
