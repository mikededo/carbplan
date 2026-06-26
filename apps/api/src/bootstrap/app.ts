import type { AppServices } from '$bootstrap/services'

import { Elysia } from 'elysia'

import { loadRuntimeConfig } from '$bootstrap/config'
import { createInfra } from '$bootstrap/infra'
import { createApiRoutes } from '$bootstrap/routes'
import { createServices } from '$bootstrap/services'

type CreateAppOptions = {
  corsOrigins: string[]
  nodeEnv?: string
  services: AppServices
}

export const createApp = async (options: CreateAppOptions) => new Elysia({ name: 'kilo-api-root', prefix: '/api' })
  .use(await createApiRoutes(options))

export const createAppFromEnv = async () => {
  const runtimeConfig = loadRuntimeConfig()
  const infra = createInfra({
    authBasePath: '/auth',
    authBaseUrl: runtimeConfig.authBaseUrl,
    authSecret: runtimeConfig.authSecret,
    authTrustedOrigins: runtimeConfig.authTrustedOrigins,
    databaseUrl: runtimeConfig.databaseUrl
  })
  const services = createServices({
    auth: infra.auth,
    repositories: infra.repositories
  })

  const app = await createApp({
    corsOrigins: runtimeConfig.corsOrigins,
    nodeEnv: runtimeConfig.nodeEnv,
    services
  })

  return { app, runtimeConfig, services }
}
