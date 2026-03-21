import type { AuthServer } from '@carbplan/auth'

import type { ProductService } from '$modules/products/service'

import * as ProductsContracts from '@carbplan/contracts/products'
import { Elysia } from 'elysia'

import { authModule } from '$modules/auth'
import {
  apiErrorFactory,
  ForbiddenErrorModel,
  InternalServerErrorModel,
  UnauthorizedErrorModel
} from '$modules/public/model'
import { StatusMap } from '$utils/codes'

export type MeModuleOptions = {
  auth: AuthServer
  services: {
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
  .group('/favorites', (app) => app.get('/products', async ({ status, user }) => {
    const result = await services.product.getAllFavoriteProducts(user.id)
    if (result.isErr()) {
      return status(StatusMap.InternalServerError, apiErrorFactory.internal())
    }

    return status(StatusMap.OK, result.value)
  }, {
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
  }))
