import type { SavedOnboardingFormData } from '$lib/domain/onboarding'

import type { Actions, PageServerLoad } from './$types'

import { fail, redirect } from '@sveltejs/kit'
import * as v from 'valibot'

import { ROUTES } from '$lib/constants/routes'
import { OnboardingSchema, SavedOnboardingSchema } from '$lib/domain/onboarding'

const ONBOARDING_COOKIE = 'onboarding_data'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export const load: PageServerLoad = async ({ cookies }) => {
  // TODO: enable auth checks when athletes table exists
  // const { user } = await safeGetSession()
  // if (!user) {
  //   redirect(303, ROUTES.auth.signup)
  // }
  //
  // const { data: athlete } = await supabase
  //   .from('athletes')
  //   .select('full_name')
  //   .eq('id', user.id)
  //   .single()
  //
  // if (athlete?.full_name) {
  //   redirect(303, ROUTES.home)
  // }

  const maybeData = v.safeParse(
    SavedOnboardingSchema,
    JSON.parse(cookies.get(ONBOARDING_COOKIE) ?? '{}')
  )
  const previous: SavedOnboardingFormData = {
    step: 0,
    ...(maybeData.success ? maybeData.output : {})
  }
  return { previous }
}

export const actions = {
  save: async ({ cookies, request }) => {
    const formData = await request.formData()
    const step = Number(formData.get('step'))
    const data = JSON.parse(formData.get('data')?.toString() ?? '{}')

    const savedData = cookies.get(ONBOARDING_COOKIE)
    const existing = savedData ? JSON.parse(savedData) : {}

    cookies.set(ONBOARDING_COOKIE, JSON.stringify({ ...existing, ...data, step }), {
      httpOnly: true,
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax'
    })

    return { success: true }
  },

  complete: async ({ cookies, locals: { safeGetSession, supabase }, request }) => {
    const { user } = await safeGetSession()
    if (!user) {
      redirect(303, ROUTES.auth.signup)
    }

    const formData = await request.formData()
    const rawData = JSON.parse(formData.get('data')?.toString() ?? '{}')

    const result = v.safeParse(OnboardingSchema, {
      ftp: rawData.ftp ? Number(rawData.ftp) : undefined,
      fullName: rawData.fullName,
      height: rawData.height ? Number(rawData.height) : undefined,
      hrMax: rawData.hrMax ? Number(rawData.hrMax) : undefined,
      hrRest: rawData.hrRest ? Number(rawData.hrRest) : undefined,
      maxCarbIntake: rawData.maxCarbIntake ? Number(rawData.maxCarbIntake) : undefined,
      sex: rawData.sex,
      weight: rawData.weight ? Number(rawData.weight) : undefined
    })

    if (!result.success) {
      const errors = v.flatten(result.issues)
      return fail(400, { errors: errors.nested })
    }

    const { error } = await supabase
      .from('athletes')
      .update({
        ftp: result.output.ftp,
        full_name: result.output.fullName,
        height_cm: result.output.height,
        hr_max: result.output.hrMax,
        hr_rest: result.output.hrRest,
        max_carb_intake_g_per_hr: result.output.maxCarbIntake,
        sex: result.output.sex,
        weight_kg: result.output.weight
      })
      .eq('id', user.id)

    if (error) {
      return fail(400, { message: error.message })
    }

    cookies.delete(ONBOARDING_COOKIE, { path: '/' })
    redirect(303, ROUTES.home)
  }
} satisfies Actions

