import type { AuthServer } from '@carbplan/auth'

import type { CatalogService } from '$modules/catalog/services'

import * as CatalogContracts from '@carbplan/contracts/catalog'
import Elysia from 'elysia'

import { authModule } from '$modules/auth'
import {
  apiErrorFactory,
  ConflictErrorModel,
  ForbiddenErrorModel,
  InternalServerErrorModel,
  NotFoundErrorModel,
  UnauthorizedErrorModel
} from '$modules/public/model'
import { StatusMap } from '$utils/codes'
import { DatabaseErrorCodeEnum, DatabaseQueryError, EntityNotFound } from '$utils/db-error'

type CatalogModuleOptions = {
  auth: AuthServer
  services: {
    catalog: CatalogService
  }
}

export const catalogModule = ({ auth, services }: CatalogModuleOptions) => new Elysia({
  detail: {
    security: [{ bearerAuth: [] }],
    tags: ['Catalog']
  },
  name: 'catalog',
  prefix: '/v1/catalogs'
})
  .use(authModule({ auth }))
  .guard({ auth: true })
  .group(
    '/brands',
    { admin: true },
    (app) => app
      .post(
        '',
        ({ body, status, user }) => services.catalog.createBrand({ data: body, userId: user.id })
          .match(
            (result) => status(StatusMap.OK, result),
            (error) => {
              if (error instanceof DatabaseQueryError) {
                if (error.code === DatabaseErrorCodeEnum.UNIQUE_VIOLATION) {
                  return status(StatusMap.Conflict, apiErrorFactory.conflict())
                }
              }

              return status(StatusMap.InternalServerError, apiErrorFactory.internal())
            }
          ),
        {
          body: CatalogContracts.CreateBrandRequestSchema,
          detail: {
            description: 'Allows admin users to create a brand',
            summary: 'Create brand'
          },
          response: {
            [StatusMap.Conflict]: ConflictErrorModel,
            [StatusMap.Forbidden]: ForbiddenErrorModel,
            [StatusMap.InternalServerError]: InternalServerErrorModel,
            [StatusMap.OK]: CatalogContracts.CreateBrandResponseSchema,
            [StatusMap.Unauthorized]: UnauthorizedErrorModel
          }
        }
      )
      .patch(
        '/:brandId',
        ({ body, params, status, user }) => services.catalog.updateBrand({ brandId: params.brandId, data: body, userId: user.id })
          .match(
            () => status(StatusMap.NoContent, undefined),
            (error) => {
              if (error instanceof EntityNotFound) {
                return status(StatusMap.NotFound, apiErrorFactory.notFound({ message: `Brand not found${params.brandId}` }))
              }

              return status(StatusMap.InternalServerError, apiErrorFactory.internal())
            }
          ),
        {
          body: CatalogContracts.UpdateBrandRequestSchema,
          detail: {
            description: 'Allows admin users to update a brand',
            summary: 'Update brand'
          },
          params: CatalogContracts.UpdateBrandRequestParamsSchema,
          response: {
            [StatusMap.Conflict]: ConflictErrorModel,
            [StatusMap.Forbidden]: ForbiddenErrorModel,
            [StatusMap.InternalServerError]: InternalServerErrorModel,
            [StatusMap.NoContent]: CatalogContracts.UpdateBrandResponseSchema,
            [StatusMap.NotFound]: NotFoundErrorModel,
            [StatusMap.Unauthorized]: UnauthorizedErrorModel
          }
        }
      )
  )
