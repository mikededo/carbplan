import type { AuthServer } from '@carbplan/auth'

import type { OnboardingService } from '$modules/onboarding/service'

import * as OnboardingContracts from '@carbplan/contracts/onboarding'
import { Elysia } from 'elysia'

import { getMeAthletesPath } from '$modules/athletes/routes'
import { authModule } from '$modules/auth'
import {
  apiErrorFactory,
  BadRequestErrorModel,
  ForbiddenErrorModel,
  InternalServerErrorModel,
  UnauthorizedErrorModel
} from '$modules/public/model'
import { StatusMap } from '$utils/codes'

export type OnboardingModuleOptions = {
  auth: AuthServer
  service: OnboardingService
}

export const onboardingModule = ({ auth, service }: OnboardingModuleOptions) => new Elysia({
  detail: {
    security: [{ bearerAuth: [] }],
    tags: ['Athletes']
  },
  name: 'onboarding',
  prefix: getMeAthletesPath('/onboarding')
})
  .use(authModule({ auth }))
  .guard({ auth: true })
  .get(
    '',
    async ({ status, user }) => {
      const result = await service.hasCompletedOnboarding(user.id)
      if (result.isErr()) {
        return status(StatusMap.InternalServerError, apiErrorFactory.internal())
      }

      return status(StatusMap.OK, result.value)
    },
    {
      detail: {
        description: 'Returns whether the current user has completed onboarding or not',
        summary: 'Has completed onboarding'
      },
      response: {
        [StatusMap.Forbidden]: ForbiddenErrorModel,
        [StatusMap.InternalServerError]: InternalServerErrorModel,
        [StatusMap.OK]: OnboardingContracts.HasCompletedOnboardingResponseSchema,
        [StatusMap.Unauthorized]: UnauthorizedErrorModel
      }
    }
  )
  .post(
    '',
    async ({ request, status, user }) => {
      const parsed = OnboardingContracts.SaveOnboardingRequestSchema.safeParse(await request.json())
      if (parsed.error) {
        return status(StatusMap.BadRequest, apiErrorFactory.badRequest())
      }

      const result = await service.saveAthleteOnboarding({
        id: user.id,
        ...parsed.data
      })

      if (result.isErr()) {
        return status(StatusMap.InternalServerError, apiErrorFactory.internal())
      }

      return status(StatusMap.NoContent, null)
    },
    {
      body: OnboardingContracts.SaveOnboardingRequestSchema,
      detail: {
        description: 'Fills athlete fields on completing onboarding',
        summary: 'Complete onboarding',
        tags: ['Athletes']
      },
      response: {
        [StatusMap.BadRequest]: BadRequestErrorModel,
        [StatusMap.Forbidden]: ForbiddenErrorModel,
        [StatusMap.InternalServerError]: InternalServerErrorModel,
        [StatusMap.NoContent]: OnboardingContracts.SaveOnboardingResponseSchema,
        [StatusMap.Unauthorized]: UnauthorizedErrorModel
      }
    }
  )
