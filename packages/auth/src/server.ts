import type { Auth, BetterAuthOptions } from 'better-auth'

import type { Db } from '@carbplan/db'

import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { schema } from '@carbplan/db'
import { betterAuth } from 'better-auth'
import { toNodeHandler } from 'better-auth/node'

export type AuthSessionQuery = {
  disableCookieCache?: boolean
  disableRefresh?: boolean
}

export type GenericAuth = {
  api: {
    getSession: (context: {
      asResponse?: boolean
      headers: Headers
      query?: AuthSessionQuery
      returnHeaders?: boolean
    }) => Promise<any>
  }
}

export const getRequestSession = async <TAuth extends GenericAuth>(
  auth: TAuth,
  request: Request,
  query?: AuthSessionQuery
): Promise<Awaited<ReturnType<TAuth['api']['getSession']>>> => auth.api.getSession({
  headers: request.headers,
  query
})

export type CreateAuthServerOptions = {
  basePath: string
  baseURL: string
  databaseHooks?: BetterAuthOptions['databaseHooks']
  db: Db
  secret: string
  trustedOrigins?: string[]
}

export type AuthServer = ReturnType<typeof createAuthServer>
export const createAuthServer = ({
  basePath,
  baseURL,
  databaseHooks,
  db,
  secret,
  trustedOrigins = []
}: CreateAuthServerOptions) => {
  const auth = betterAuth({
    advanced: {
      database: {
        generateId: 'uuid'
      }
    },
    basePath,
    baseURL,
    database: drizzleAdapter(db, { provider: 'pg', schema, usePlural: true }),
    databaseHooks,
    emailAndPassword: {
      enabled: true
    },
    secret,
    trustedOrigins
  })

  return {
    auth,
    handler: auth.handler,
    nodeHandler: toNodeHandler(auth)
  }
}
