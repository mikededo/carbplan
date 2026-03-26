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
  UnauthorizedErrorModel
} from '$modules/public/model'
import { StatusMap } from '$utils/codes'
import { DatabaseErrorCodeEnum, DatabaseQueryError } from '$utils/db-error'

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
  prefix: '/v1/catalog'
})
  .use(authModule({ auth }))
  .guard({ auth: true })
  .post(
    '/brand',
    ({ body, status }) => services.catalog.createBrand(body)
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
