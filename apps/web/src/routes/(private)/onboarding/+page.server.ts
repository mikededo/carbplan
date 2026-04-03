import type { SavedOnboardingFormData } from '$lib/domain/onboarding/types'

import type { Actions, PageServerLoad } from './$types'

import { fail, redirect } from '@sveltejs/kit'
import * as z from 'zod'

import { ROUTES } from '$lib/constants/routes'
import { OnboardingSchema, SavedOnboardingSchema } from '$lib/domain/onboarding/schemas'

const ONBOARDING_COOKIE = 'onboarding_data'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export const load: PageServerLoad = async ({ cookies, locals }) => await locals.services.athletes
  .hasCompletedOnboarding()
  .match(
    ({ completed }) => {
      if (completed) {
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
    },
    () => redirect(303, ROUTES.auth.signup)
  )

export const actions = {
  complete: async ({ cookies, locals, request }) => {
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
      const errors = z.flattenError(result.error)
      return fail(400, { errors: errors.fieldErrors })
    }

    return await locals.services.athletes.saveOnboarding(result.data)
      .match(
        () => {
          cookies.delete(ONBOARDING_COOKIE, { path: '/' })
          redirect(303, ROUTES.dashboard)
        },
        (error) => fail(400, { message: error.message })
      )
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

