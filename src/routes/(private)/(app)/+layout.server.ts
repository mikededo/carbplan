import type { LayoutServerLoad } from './$types'

import { redirect } from '@sveltejs/kit'

import { ROUTES } from '$lib/constants/routes'

export const load: LayoutServerLoad = async ({ locals: { supabase } }) => {
  const { data: athlete } = await supabase
    .from('current_athlete')
    .select('*')
    .single()

  if (!athlete) {
    redirect(303, ROUTES.auth.login)
  }

  return { athlete }
}

