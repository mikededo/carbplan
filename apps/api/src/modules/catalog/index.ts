import type { AuthServer } from '@carbplan/auth'

import type { CatalogService } from '$modules/catalog/services'

import * as CatalogContracts from '@carbplan/contracts/catalog'
import Elysia from 'elysia'

import { authModule } from '$modules/auth'
import { StatusMap } from '$utils/codes'
import { DatabaseErrorCodeEnum, DatabaseQueryError, EntityNotFound } from '$utils/db-error'
import {
  apiErrorFactory,
  ConflictErrorSchema,
  ForbiddenErrorSchema,
  InternalServerErrorSchema,
  NotFoundErrorSchema,
  UnauthorizedErrorSchema
} from '$utils/error'

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
    '/products',
    { admin: true },
    (app) => app
      .post(
        '',
        ({ body, status, user }) => services.catalog.createProduct({ data: body, userId: user.id })
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
          body: CatalogContracts.CreateProductRequestSchema,
          detail: {
            description: 'Allows admin users to create a product',
            summary: 'Create product'
          },
          response: {
            [StatusMap.Conflict]: ConflictErrorSchema,
            [StatusMap.Forbidden]: ForbiddenErrorSchema,
            [StatusMap.InternalServerError]: InternalServerErrorSchema,
            [StatusMap.OK]: CatalogContracts.CreateProductResponseSchema,
            [StatusMap.Unauthorized]: UnauthorizedErrorSchema
          }
        }
      )
      .patch(
        '/:productId',
        ({ body, params, status, user }) => services.catalog
          .updateProduct({ data: body, productId: params.productId, userId: user.id })
          .match(
            () => status(StatusMap.NoContent, undefined),
            (error) => {
              if (error instanceof EntityNotFound) {
                return status(StatusMap.NotFound, apiErrorFactory.notFound({ message: `Product not found: ${params.productId}` }))
              }

              return status(StatusMap.InternalServerError, apiErrorFactory.internal())
            }
          ),
        {
          body: CatalogContracts.UpdateProductRequestSchema,
          detail: {
            description: 'Allows admin users to update a product',
            summary: 'Update product'
          },
          params: CatalogContracts.UpdateProductRequestParamsSchema,
          response: {
            [StatusMap.Conflict]: ConflictErrorSchema,
            [StatusMap.Forbidden]: ForbiddenErrorSchema,
            [StatusMap.InternalServerError]: InternalServerErrorSchema,
            [StatusMap.NoContent]: CatalogContracts.UpdateProductResponseSchema,
            [StatusMap.NotFound]: NotFoundErrorSchema,
            [StatusMap.Unauthorized]: UnauthorizedErrorSchema
          }
        }
      )
      .patch(
        '/:productId/deactivate',
        ({ params, status, user }) => services.catalog.deactivateProduct({ data: params.productId, userId: user.id })
          .match(
            () => status(StatusMap.NoContent, undefined),
            (error) => {
              if (error instanceof EntityNotFound) {
                return status(StatusMap.NotFound, apiErrorFactory.notFound({ message: `Product not found: ${params.productId}` }))
              }

              return status(StatusMap.InternalServerError, apiErrorFactory.internal())
            }
          ),
        {
          detail: {
            description: 'Allows admin users to deactivate a product. Deactivated products will not be available for selection when logging consumption, but historical consumption records will not be affected.',
            summary: 'Deactivate product'
          },
          params: CatalogContracts.DeactivateProductRequestParamsSchema,
          response: {
            [StatusMap.Conflict]: ConflictErrorSchema,
            [StatusMap.Forbidden]: ForbiddenErrorSchema,
            [StatusMap.InternalServerError]: InternalServerErrorSchema,
            [StatusMap.NoContent]: CatalogContracts.DeactivateProductResponseSchema,
            [StatusMap.NotFound]: NotFoundErrorSchema,
            [StatusMap.Unauthorized]: UnauthorizedErrorSchema
          }
        }
      )
  )
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
            [StatusMap.Conflict]: ConflictErrorSchema,
            [StatusMap.Forbidden]: ForbiddenErrorSchema,
            [StatusMap.InternalServerError]: InternalServerErrorSchema,
            [StatusMap.OK]: CatalogContracts.CreateBrandResponseSchema,
            [StatusMap.Unauthorized]: UnauthorizedErrorSchema
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
                return status(StatusMap.NotFound, apiErrorFactory.notFound({ message: `Brand not found: ${params.brandId}` }))
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
            [StatusMap.Conflict]: ConflictErrorSchema,
            [StatusMap.Forbidden]: ForbiddenErrorSchema,
            [StatusMap.InternalServerError]: InternalServerErrorSchema,
            [StatusMap.NoContent]: CatalogContracts.UpdateBrandResponseSchema,
            [StatusMap.NotFound]: NotFoundErrorSchema,
            [StatusMap.Unauthorized]: UnauthorizedErrorSchema
          }
        }
      )
  )
