import type { SavedOnboardingFormData } from '$lib/domain/onboarding/types'

import type { Actions, PageServerLoad } from './$types'

import { fail, redirect } from '@sveltejs/kit'

import { ROUTES } from '$lib/constants/routes'
import { isOnboardingComplete } from '$lib/domain/onboarding/helpers'
import { OnboardingSchema, SavedOnboardingSchema } from '$lib/domain/onboarding/schemas'

const ONBOARDING_COOKIE = 'onboarding_data'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export const load: PageServerLoad = async ({ cookies, locals: { safeGetSession, supabase } }) => {
  const { user } = await safeGetSession()
  if (!user) {
    redirect(303, ROUTES.auth.signup)
  }

  if (await isOnboardingComplete(supabase, user.id)) {
    redirect(303, ROUTES.dashboard)
  }

  const maybeData = SavedOnboardingSchema.safeParse(
    JSON.parse(cookies.get(ONBOARDING_COOKIE) ?? '{}')
  )
  const previous: SavedOnboardingFormData = {
    step: 0,
    ...(maybeData.success ? maybeData.data : {})
  }
  return { previous }
}

export const actions = {
  complete: async ({ cookies, locals: { safeGetSession, supabase }, request }) => {
    const { user } = await safeGetSession()
    if (!user) {
      redirect(303, ROUTES.auth.signup)
    }

    const formData = await request.formData()
    const rawData = JSON.parse(formData.get('data')?.toString() ?? '{}')

    const result = OnboardingSchema.safeParse({
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
      const errors = result.error.flatten()
      return fail(400, { errors: errors.fieldErrors })
    }

    const { error } = await supabase
      .from('athletes')
      .update({
        ftp: result.data.ftp,
        full_name: result.data.fullName,
        height_cm: result.data.height,
        hr_max: result.data.hrMax,
        hr_rest: result.data.hrRest,
        max_carb_intake_g_per_hr: result.data.maxCarbIntake,
        sex: result.data.sex,
        weight_kg: result.data.weight
      })
      .eq('id', user.id)

    if (error) {
      return fail(400, { message: error.message })
    }

    cookies.delete(ONBOARDING_COOKIE, { path: '/' })
    redirect(303, ROUTES.dashboard)
  },
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
  }
} satisfies Actions

