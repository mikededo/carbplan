import type { AppServices } from '$bootstrap/services'

import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { Elysia, StatusMap } from 'elysia'

import { loadRuntimeConfig } from '$bootstrap/config'
import { createInfra } from '$bootstrap/infra'
import { createLoggerModule } from '$bootstrap/logger'
import { createServices } from '$bootstrap/services'
import { authModule } from '$modules/auth'
import { publicModule } from '$modules/public'
import { ApiErrorModel } from '$modules/public/model'

type CreateAppOptions = {
  corsOrigins: string[]
  nodeEnv?: string
  services: AppServices
}

const normalizeStatus = (status: number): number => status >= StatusMap['Bad Request'] ? status : StatusMap['Internal Server Error']

export const createApp = ({ corsOrigins, services }: CreateAppOptions) =>
  new Elysia({ name: 'carbplan-api', prefix: '/api' })
    .model({ ApiError: ApiErrorModel })
    .use(createLoggerModule())
    .use(cors({
      allowedHeaders: ['Content-Type', 'If-None-Match', 'X-Request-Id'],
      credentials: false,
      exposeHeaders: ['ETag', 'X-Request-Id'],
      maxAge: 300,
      methods: ['GET', 'OPTIONS'],
      origin: corsOrigins
    }))
    .use(openapi({
      documentation: {
        info: {
          title: 'Carbplan API',
          version: '1.0.0'
        }
      },
      path: '/docs',
      specPath: '/openapi'
    }))
    .onError(({ code, request, set }) => {
      const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()
      set.headers['x-request-id'] = requestId

      if (code === 'NOT_FOUND') {
        set.status = StatusMap['Not Found']
        return {
          code: 'NOT_FOUND',
          message: 'Route not found',
          requestId
        }
      }

      if (code === 'VALIDATION') {
        set.status = StatusMap['Bad Request']
        return {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          requestId
        }
      }

      const currentStatus = typeof set.status === 'number' ? set.status : StatusMap['Internal Server Error']
      set.status = normalizeStatus(currentStatus)

      return {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        requestId
      }
    })
    .use(authModule({ auth: services.auth }))
    .use(publicModule({ services: services.public }))

export const createAppFromEnv = () => {
  const runtimeConfig = loadRuntimeConfig()
  const infra = createInfra({
    authBasePath: '/auth',
    authBaseUrl: runtimeConfig.authBaseUrl,
    authSecret: runtimeConfig.authSecret,
    authTrustedOrigins: runtimeConfig.authTrustedOrigins,
    databaseUrl: runtimeConfig.databaseUrl
  })
  const services = createServices(infra)

  const app = createApp({
    corsOrigins: runtimeConfig.corsOrigins,
    nodeEnv: runtimeConfig.nodeEnv,
    services
  })

  return { app, runtimeConfig, services }
}
