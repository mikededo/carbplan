import type { AuthServer } from '@carbplan/auth'

import type { MeService } from '$modules/me/service'
import type { ProductService } from '$modules/products/service'

import * as MeContracts from '@carbplan/contracts/me'
import * as ProductsContracts from '@carbplan/contracts/products'
import { Elysia } from 'elysia'

import { authModule } from '$modules/auth'
import {
  apiErrorFactory,
  ForbiddenErrorModel,
  InternalServerErrorModel,
  NotFoundErrorModel,
  UnauthorizedErrorModel
} from '$modules/public/model'
import { StatusMap } from '$utils/codes'
import { EntityNotFound } from '$utils/db-error'

export type MeModuleOptions = {
  auth: AuthServer
  services: {
    me: MeService
    product: ProductService
  }
}

export const meModule = ({ auth, services }: MeModuleOptions) => new Elysia({
  detail: {
    security: [{ bearerAuth: [] }],
    tags: ['Me']
  },
  name: 'me',
  prefix: '/v1/me'
})
  .use(authModule({ auth }))
  .guard({ auth: true })
  .get(
    '',
    ({ status, user }) => services.me.getCurrentAthlete(user.id)
      .match(
        (result) => status(StatusMap.OK, result),
        (error) => {
          if (error instanceof EntityNotFound) {
            return status(StatusMap.NotFound, apiErrorFactory.notFound({ message: error.message }))
          }

          return status(StatusMap.InternalServerError, apiErrorFactory.internal())
        }
      ),
    {
      detail: {
        description: 'Returns current session athlete data',
        summary: 'Current athlete'
      },
      response: {
        [StatusMap.Forbidden]: ForbiddenErrorModel,
        [StatusMap.InternalServerError]: InternalServerErrorModel,
        [StatusMap.NotFound]: NotFoundErrorModel,
        [StatusMap.OK]: MeContracts.GetCurrentAthleteResponseSchema,
        [StatusMap.Unauthorized]: UnauthorizedErrorModel
      }
    }
  )
  .patch(
    '',
    ({ body, status, user }) => services.me.updateCurrentAthlete(user.id, body)
      .match(
        () => status(StatusMap.NoContent, undefined),
        (error) => {
          if (error instanceof EntityNotFound) {
            return status(StatusMap.NotFound, apiErrorFactory.notFound({ message: error.message }))
          }

          return status(StatusMap.InternalServerError, apiErrorFactory.internal())
        }
      ),
    {
      body: MeContracts.UpdateCurrentAthleteRequestSchema,
      detail: {
        description: 'Returns current session athlete data',
        summary: 'Current athlete'
      },
      response: {
        [StatusMap.Forbidden]: ForbiddenErrorModel,
        [StatusMap.InternalServerError]: InternalServerErrorModel,
        [StatusMap.NoContent]: MeContracts.UpdateCurrentAthleteResponseSchema,
        [StatusMap.NotFound]: NotFoundErrorModel,
        [StatusMap.Unauthorized]: UnauthorizedErrorModel
      }
    }
  )
  .patch(
    '/hr',
    async ({ body, status, user }) => await services.me.updateHRZones(user.id, body)
      .match(
        () => status(StatusMap.NoContent, undefined),
        () => status(StatusMap.InternalServerError, apiErrorFactory.internal())
      ),
    {
      body: MeContracts.UpdateHRZonesRequestSchema,
      detail: {
        description: 'Updates HR settings for the current user',
        summary: 'Update HR'
      },
      response: {
        [StatusMap.Forbidden]: ForbiddenErrorModel,
        [StatusMap.InternalServerError]: InternalServerErrorModel,
        [StatusMap.NoContent]: MeContracts.UpdateHRZonesResponseSchema,
        [StatusMap.Unauthorized]: UnauthorizedErrorModel
      }
    }
  )
  .patch(
    '/power',
    ({ body, status, user }) => services.me.updatePowerZones(user.id, body)
      .match(
        () => status(StatusMap.NoContent, undefined),
        () => status(StatusMap.InternalServerError, apiErrorFactory.internal())
      ),
    {
      body: MeContracts.UpdatePowerZonesRequestSchema,
      detail: {
        description: 'Updates power settings for the current user',
        summary: 'Update power'
      },
      response: {
        [StatusMap.Forbidden]: ForbiddenErrorModel,
        [StatusMap.InternalServerError]: InternalServerErrorModel,
        [StatusMap.NoContent]: MeContracts.UpdatePowerZonesResponseSchema,
        [StatusMap.Unauthorized]: UnauthorizedErrorModel
      }
    }
  )
  .group(
    '/favorites',
    (app) => app.get(
      '/products',
      ({ status, user }) => services.product.getAllFavoriteProducts(user.id)
        .match(
          (value) => status(StatusMap.OK, value),
          () => status(StatusMap.InternalServerError, apiErrorFactory.internal())
        ),
      {
        detail: {
          description: 'Return the favorite products of the user',
          summary: 'Favorite products'
        },
        response: {
          [StatusMap.Forbidden]: ForbiddenErrorModel,
          [StatusMap.InternalServerError]: InternalServerErrorModel,
          [StatusMap.OK]: ProductsContracts.FavoriteProductsListResponseSchema,
          [StatusMap.Unauthorized]: UnauthorizedErrorModel
        }
      }
    )
  )
