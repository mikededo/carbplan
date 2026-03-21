import type { AuthServer } from '@carbplan/auth'

import type { OnboardingService } from '$modules/onboarding/service'

import * as OnboardingContracts from '@carbplan/contracts/onboarding'
import { Elysia, status, StatusMap } from 'elysia'

import { getMeAthletesPath } from '$modules/athletes/routes'
import { authModule } from '$modules/auth'
import { apiErrorFactory, ForbiddenErrorModel, InternalServerErrorModel, UnauthorizedErrorModel } from '$modules/public/model'

export type OnboardingModuleOptions = {
  auth: AuthServer
  service: OnboardingService
}

export const onboardingModule = ({ auth, service }: OnboardingModuleOptions) => new Elysia({ name: 'onboarding' })
  .use(authModule({ auth }))
  .post(
    getMeAthletesPath('/onboarding'),
    async ({ request, user }) => {
      const parsed = OnboardingContracts.OnboardingRequestSchema.safeParse(await request.json())
      if (parsed.error) {
        return status(StatusMap['Bad Request'], apiErrorFactory.badRequest())
      }

      const result = await service.saveAthleteOnboarding({
        id: user.id,
        ...parsed.data
      })

      if (result.isErr()) {
        return status(StatusMap['Internal Server Error'], apiErrorFactory.internal())
      }

      return status(StatusMap['No Content'])
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
        204: OnboardingContracts.OnboardingResponseSchema,
        401: ForbiddenErrorModel,
        403: UnauthorizedErrorModel,
        500: InternalServerErrorModel
      }
    }
  )
