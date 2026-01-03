import type { Actions, PageServerLoad } from './$types'

import { fail } from '@sveltejs/kit'
import * as v from 'valibot'

import { ProfileSchema } from '$lib/domain/settings/schemas'

export const load: PageServerLoad = async ({ parent }) => {
  const { athlete } = await parent()
  return { athlete }
}

const parseNumber = (value: FormDataEntryValue | null) => {
  if (!value || value === '') {
    return undefined
  }
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

export const actions = {
  default: async ({ locals: { safeGetSession, supabase }, request }) => {
    const { user } = await safeGetSession()
    if (!user) {
      return fail(401, { message: 'Unauthorized' })
    }

    const formData = await request.formData()
    const result = v.safeParse(ProfileSchema, {
      ftp: parseNumber(formData.get('ftp')),
      fullName: formData.get('fullName')?.toString() ?? '',
      height: parseNumber(formData.get('height')),
      hrMax: parseNumber(formData.get('hrMax')),
      hrRest: parseNumber(formData.get('hrRest')),
      maxCarbIntake: parseNumber(formData.get('maxCarbIntake')),
      sex: formData.get('sex')?.toString() || undefined,
      weight: parseNumber(formData.get('weight'))
    })

    if (!result.success) {
      return fail(400, { message: 'Validation failed' })
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
      return fail(500, { message: 'Failed to update profile' })
    }

    return { success: true }
  }
} satisfies Actions

