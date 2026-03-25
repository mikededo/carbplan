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
    ({ status, user }) =>
      service.hasCompletedOnboarding(user.id).match(
        (result) => status(StatusMap.OK, result),
        () => status(StatusMap.InternalServerError, apiErrorFactory.internal())
      ),
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
    ({ body, status, user }) => {
      const parsed = OnboardingContracts.SaveOnboardingRequestSchema.safeParse(body)
      if (parsed.error) {
        return status(StatusMap.BadRequest, apiErrorFactory.badRequest())
      }

      service.saveAthleteOnboarding({
        id: user.id,
        ...parsed.data
      }).match(
        () => status(StatusMap.NoContent, undefined),
        () => status(StatusMap.InternalServerError, apiErrorFactory.internal())
      )
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
