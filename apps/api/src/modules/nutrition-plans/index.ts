import type { AuthServer } from '@carbplan/auth'

import type { NutritionPlansService } from '$modules/nutrition-plans/service'

import * as NutritionPlansContracts from '@carbplan/contracts/nutrition-plans'
import Elysia from 'elysia'

import { authModule } from '$modules/auth'
import { StatusMap } from '$utils/codes'
import { apiErrorFactory, ConflictErrorSchema, ForbiddenErrorSchema, InternalServerErrorSchema, UnauthorizedErrorSchema } from '$utils/error'

type PlanModuleOptions = {
  auth: AuthServer
  services: {
    nutritionPlans: NutritionPlansService
  }
}

export const nutritionPlansModule = ({ auth, services }: PlanModuleOptions) => new Elysia({
  detail: {
    security: [{ bearerAuth: [] }],
    tags: ['Plans']
  },
  name: 'nutrition-plans',
  prefix: '/v1/nutrition-plans'
})
  .use(authModule({ auth }))
  .guard({ auth: true })
  .get(
    '/me',
    ({ query, status, user }) => services.nutritionPlans.listAthleteNutritionPlans(user.id, query)
      .match(
        (response) => status(StatusMap.OK, response),
        (error) => status(StatusMap.InternalServerError, apiErrorFactory.internal({ message: error.message }))
      ),
    {
      detail: {
        description: 'Allows admin users to create a product',
        summary: 'Create product'
      },
      query: NutritionPlansContracts.NutritionPlansListQuerySchema,
      response: {
        [StatusMap.Conflict]: ConflictErrorSchema,
        [StatusMap.Forbidden]: ForbiddenErrorSchema,
        [StatusMap.InternalServerError]: InternalServerErrorSchema,
        [StatusMap.OK]: NutritionPlansContracts.NutritionPlansListResultSchema,
        [StatusMap.Unauthorized]: UnauthorizedErrorSchema
      }
    }
  )
