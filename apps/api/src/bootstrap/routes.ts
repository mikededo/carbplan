import type { AppServices } from '$bootstrap/services'

import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import * as z from 'zod'

import { createLogger } from '$bootstrap/logger'
import { authModule } from '$modules/auth'
import { OpenAPI } from '$modules/auth/openapi'
import { catalogModule } from '$modules/catalog'
import { meModule } from '$modules/me'
import { nutritionPlansModule } from '$modules/nutrition-plans'
import { onboardingModule } from '$modules/onboarding'
import { publicModule } from '$modules/public'
import { StatusMap } from '$utils/codes'
import { apiErrorFactory, ApiErrorModelSchema } from '$utils/error'

type CreateApiRoutesOptions = {
  corsOrigins: string[]
  nodeEnv?: string
  services: AppServices
}

const normalizeStatus = (status: number): number => status >= StatusMap.BadRequest ? status : StatusMap.InternalServerError

export const createApiRoutes = async ({ corsOrigins, services }: CreateApiRoutesOptions) => new Elysia({ name: 'carbplan-api' })
  .model({ ApiError: ApiErrorModelSchema })
  .use(await createLogger())
  .use(cors({
    allowedHeaders: ['Authorization', 'Content-Type', 'If-None-Match', 'X-Request-Id'],
    credentials: true,
    exposeHeaders: ['ETag', 'X-Request-Id'],
    maxAge: 300,
    methods: ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
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
    // Passing 'any' in order to be able to treat undefined as some value,
    // otherwise empty responses do not show up in docs
    mapJsonSchema: { zod: (schema: z.ZodType) => z.toJSONSchema(schema, { unrepresentable: 'any' }) },
    path: '/docs',
    scalar: {
      customCss: '',
      persistAuth: true
    },
    specPath: '/openapi'
  }))
  .onError(({ code, error, request, set, status }) => {
    const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()
    set.headers['x-request-id'] = requestId

    if (code === 'NOT_FOUND') {
      return status(StatusMap.NotFound, apiErrorFactory.notFound({ requestId }))
    }

    if (code === 'VALIDATION') {
      return status(StatusMap.BadRequest, apiErrorFactory.validation({
        message: error.valueError?.message,
        requestId
      }))
    }

    const currentStatus = normalizeStatus(typeof set.status === 'number' ? set.status : StatusMap.InternalServerError)
    return status(currentStatus, apiErrorFactory.internal({ requestId }))
  })
  .use(authModule({ auth: services.auth }))
  .use(publicModule({ services: services.public }))
  .use(onboardingModule({ auth: services.auth, service: services.onboarding }))
  .use(meModule({
    auth: services.auth,
    services: { favorites: services.favorites, me: services.me }
  }))
  .use(catalogModule({ auth: services.auth, services: { catalog: services.catalog } }))
  .use(nutritionPlansModule({ auth: services.auth, services: { nutritionPlans: services.nutritionPlans } }))
