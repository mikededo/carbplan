import type { AuthServer } from '@carbplan/auth'

import type { AthleteFavoritesService } from '$modules/favorites/service'
import type { MeService } from '$modules/me/service'

import * as MeContracts from '@carbplan/contracts/me'
import * as ProductsContracts from '@carbplan/contracts/products'
import { Elysia } from 'elysia'

import { authModule } from '$modules/auth'
import { StatusMap } from '$utils/codes'
import { EntityNotFound } from '$utils/db-error'
import {
  apiErrorFactory,
  ForbiddenErrorSchema,
  InternalServerErrorSchema,
  NotFoundErrorSchema,
  UnauthorizedErrorSchema
} from '$utils/error'

export type MeModuleOptions = {
  auth: AuthServer
  services: {
    me: MeService
    favorites: AthleteFavoritesService
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
        [StatusMap.Forbidden]: ForbiddenErrorSchema,
        [StatusMap.InternalServerError]: InternalServerErrorSchema,
        [StatusMap.NotFound]: NotFoundErrorSchema,
        [StatusMap.OK]: MeContracts.GetCurrentAthleteResponseSchema,
        [StatusMap.Unauthorized]: UnauthorizedErrorSchema
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
        [StatusMap.Forbidden]: ForbiddenErrorSchema,
        [StatusMap.InternalServerError]: InternalServerErrorSchema,
        [StatusMap.NoContent]: MeContracts.UpdateCurrentAthleteResponseSchema,
        [StatusMap.NotFound]: NotFoundErrorSchema,
        [StatusMap.Unauthorized]: UnauthorizedErrorSchema
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
        [StatusMap.Forbidden]: ForbiddenErrorSchema,
        [StatusMap.InternalServerError]: InternalServerErrorSchema,
        [StatusMap.NoContent]: MeContracts.UpdateHRZonesResponseSchema,
        [StatusMap.Unauthorized]: UnauthorizedErrorSchema
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
        [StatusMap.Forbidden]: ForbiddenErrorSchema,
        [StatusMap.InternalServerError]: InternalServerErrorSchema,
        [StatusMap.NoContent]: MeContracts.UpdatePowerZonesResponseSchema,
        [StatusMap.Unauthorized]: UnauthorizedErrorSchema
      }
    }
  )
  .group(
    '/favorites',
    (app) => app.get(
      '/products',
      ({ status, user }) => services.favorites.getAllFavoriteProducts(user.id)
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
          [StatusMap.Forbidden]: ForbiddenErrorSchema,
          [StatusMap.InternalServerError]: InternalServerErrorSchema,
          [StatusMap.OK]: ProductsContracts.FavoriteProductsListResponseSchema,
          [StatusMap.Unauthorized]: UnauthorizedErrorSchema
        }
      }
    )
  )
