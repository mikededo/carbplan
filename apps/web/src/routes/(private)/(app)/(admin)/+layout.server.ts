import type { LayoutServerLoad } from './$types'

import { redirect } from '@sveltejs/kit'

import { ROUTES } from '../../../../lib/constants/routes'

export const load: LayoutServerLoad = async ({ parent }) => {
  const { user } = await parent()

  if (!user?.isAdmin) {
    redirect(303, ROUTES.dashboard)
  }
}
