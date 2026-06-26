import type { LayoutServerLoad } from './$types'

import { noop } from '@carbplan/utils/noop'
import { redirect } from '@sveltejs/kit'

import { isOnboardingRoute, ROUTES } from '$lib/constants/routes'
import { isSessionExpired } from '$lib/domain/auth/utils'

export const load: LayoutServerLoad = async ({ locals, parent, url }) => {
  const { session, user } = await parent()
  if (!user || !session || isSessionExpired(session)) {
    redirect(303, ROUTES.auth.signup)
  }

  await locals.athletes.hasCompletedOnboarding().match(
    ({ completed }) => {
      const onboardingRoute = isOnboardingRoute(url.pathname)
      if (onboardingRoute === completed) {
        redirect(303, onboardingRoute ? ROUTES.dashboard : ROUTES.onboarding)
      }
    },
    noop
  )
}
