import type { LayoutServerLoad } from './$types'

import { redirect } from '@sveltejs/kit'

import { isOnboardingRoute, ROUTES } from '$lib/constants/routes'
import { isOnboardingComplete } from '$lib/domain/onboarding/helpers'

export const load: LayoutServerLoad = async ({ locals: { supabase }, parent, url }) => {
  const { user } = await parent()
  if (!user) {
    return redirect(300, ROUTES.auth.signup)
  }

  const completedOnboarding = await isOnboardingComplete(supabase, user.id)
  const onboardingRoute = isOnboardingRoute(url.pathname)
  if (onboardingRoute === completedOnboarding) {
    redirect(303, onboardingRoute ? ROUTES.dashboard : ROUTES.onboarding)
  }
}
