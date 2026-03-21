import type { AppServices } from '$bootstrap/services'

import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import z from 'zod'

import { loadRuntimeConfig } from '$bootstrap/config'
import { createInfra } from '$bootstrap/infra'
import { createLoggerModule } from '$bootstrap/logger'
import { createServices } from '$bootstrap/services'
import { authModule } from '$modules/auth'
import { OpenAPI } from '$modules/auth/openapi'
import { onboardingModule } from '$modules/onboarding'
import { publicModule } from '$modules/public'
import { apiErrorFactory, ApiErrorModel } from '$modules/public/model'
import { StatusMap } from '$utils/codes'

type CreateAppOptions = {
  corsOrigins: string[]
  nodeEnv?: string
  services: AppServices
}

const normalizeStatus = (status: number): number => status >= StatusMap.BadRequest ? status : StatusMap.InternalServerError

export const createApp = async ({ corsOrigins, services }: CreateAppOptions) =>
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
        components: await OpenAPI.components(services.auth),
        info: {
          title: 'Carbplan API',
          version: '1.0.0'
        },
        paths: await OpenAPI.getPaths(services.auth)
      },
      mapJsonSchema: { zod: z.toJSONSchema },
      path: '/docs',
      // @ts-expect-error This is correct, to overwrite elysiajs styles
      scalar: {
        customCss: ''
      },
      specPath: '/openapi'
    }))
    .onError(({ code, request, set, status }) => {
      const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()
      set.headers['x-request-id'] = requestId

      if (code === 'NOT_FOUND') {
        return status(StatusMap.NotFound, apiErrorFactory.notFound({ requestId }))
      }

      if (code === 'VALIDATION') {
        return status(StatusMap.BadRequest, apiErrorFactory.validation({ requestId }))
      }

      const currentStatus = normalizeStatus(typeof set.status === 'number' ? set.status : StatusMap.InternalServerError)
      return status(currentStatus, apiErrorFactory.internal({ requestId }))
    })
    .use(authModule({ auth: services.auth }))
    .use(publicModule({ services: services.public }))
    .use(onboardingModule({ auth: services.auth, service: services.onboarding }))

export const createAppFromEnv = async () => {
  const runtimeConfig = loadRuntimeConfig()
  const infra = createInfra({
    authBasePath: '/auth',
    authBaseUrl: runtimeConfig.authBaseUrl,
    authSecret: runtimeConfig.authSecret,
    authTrustedOrigins: runtimeConfig.authTrustedOrigins,
    databaseUrl: runtimeConfig.databaseUrl
  })
  const services = createServices(infra)

  const app = await createApp({
    corsOrigins: runtimeConfig.corsOrigins,
    nodeEnv: runtimeConfig.nodeEnv,
    services
  })

  return { app, runtimeConfig, services }
}
