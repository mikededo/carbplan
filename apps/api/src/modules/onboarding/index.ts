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

export const onboardingModule = ({ auth, service }: OnboardingModuleOptions) => new Elysia({ name: 'onboarding' })
  .use(authModule({ auth }))
  .post(
    getMeAthletesPath('/onboarding'),
    async ({ request, status, user }) => {
      const parsed = OnboardingContracts.OnboardingRequestSchema.safeParse(await request.json())
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
      auth: true,
      body: OnboardingContracts.OnboardingRequestSchema,
      detail: {
        description: 'Fills athlete fields on completing onboarding',
        summary: 'Complete onboarding',
        tags: ['Athletes']
      },
      response: {
        [StatusMap.BadRequest]: BadRequestErrorModel,
        [StatusMap.Forbidden]: ForbiddenErrorModel,
        [StatusMap.InternalServerError]: InternalServerErrorModel,
        [StatusMap.NoContent]: OnboardingContracts.OnboardingResponseSchema,
        [StatusMap.Unauthorized]: UnauthorizedErrorModel
      }
    }
  )
