import type { PageServerLoad } from './$types'

import { redirect } from '@sveltejs/kit'

import { ROUTES } from '$lib/constants/routes'
import { isSessionExpired } from '$lib/domain/auth/utils'

export const load: PageServerLoad = async ({ parent }) => {
  const { session, user } = await parent()

  redirect(303, !user || !session || isSessionExpired(session) ? ROUTES.auth.signin : ROUTES.dashboard)
}
