import type { SavedOnboardingFormData } from '$lib/domain/onboarding'

import type { Actions, PageServerLoad } from './$types'

import { fail, redirect } from '@sveltejs/kit'
import * as v from 'valibot'

import { ROUTES } from '$lib/constants/routes'
import { SavedOnboardingSchema } from '$lib/domain/onboarding'

const ONBOARDING_COOKIE = 'onboarding_data'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

const OnboardingSchema = v.object({
  ftp: v.optional(v.pipe(v.number(), v.minValue(50), v.maxValue(750))),
  fullName: v.pipe(v.string(), v.minLength(1, 'Full name is required')),
  heightCm: v.pipe(
    v.number(),
    v.minValue(100, 'Height must be at least 100cm'),
    v.maxValue(250, 'Height must be at most 250cm')
  ),
  hrMax: v.optional(v.pipe(v.number(), v.minValue(100), v.maxValue(220))),
  hrRest: v.optional(v.pipe(v.number(), v.minValue(30), v.maxValue(200))),
  maxCarbIntake: v.optional(v.pipe(v.number(), v.minValue(20), v.maxValue(150))),
  sex: v.picklist(['male', 'female'], 'Please select your sex'),
  weightKg: v.pipe(
    v.number(),
    v.minValue(30, 'Weight must be at least 30kg'),
    v.maxValue(200, 'Weight must be at most 200kg')
  )
})

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
      heightCm: rawData.heightCm ? Number(rawData.heightCm) : undefined,
      hrMax: rawData.hrMax ? Number(rawData.hrMax) : undefined,
      hrRest: rawData.hrRest ? Number(rawData.hrRest) : undefined,
      maxCarbIntake: rawData.maxCarbIntake ? Number(rawData.maxCarbIntake) : undefined,
      sex: rawData.sex,
      weightKg: rawData.weightKg ? Number(rawData.weightKg) : undefined
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
        height_cm: result.output.heightCm,
        hr_max: result.output.hrMax,
        hr_rest: result.output.hrRest,
        max_carb_intake_g_per_hr: result.output.maxCarbIntake,
        sex: result.output.sex,
        weight_kg: result.output.weightKg
      })
      .eq('id', user.id)

    if (error) {
      return fail(400, { message: error.message })
    }

    cookies.delete(ONBOARDING_COOKIE, { path: '/' })
    redirect(303, ROUTES.home)
  }
} satisfies Actions

