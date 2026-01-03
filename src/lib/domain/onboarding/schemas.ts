import * as v from 'valibot'

import { PROFILE_VALUES } from '$lib/domain/settings/constants'

export const StepOneSchema = v.object({
  fullName: v.pipe(v.string(), v.minLength(1, 'Full name is required')),
  height: v.pipe(
    v.number(),
    v.minValue(PROFILE_VALUES.height.min, `Height must be at least ${PROFILE_VALUES.height.min}cm`),
    v.maxValue(PROFILE_VALUES.height.max, `Height must be at most ${PROFILE_VALUES.height.max}cm`)
  ),
  sex: v.picklist(['male', 'female'], 'Please select your sex'),
  weight: v.pipe(
    v.number(),
    v.minValue(PROFILE_VALUES.weight.min, `Weight must be at least ${PROFILE_VALUES.weight.min}kg`),
    v.maxValue(PROFILE_VALUES.weight.max, `Weight must be at most ${PROFILE_VALUES.weight.max}kg`)
  )
})
export const StepTwoSchema = v.object({
  ftp: v.optional(v.pipe(
    v.number(),
    v.minValue(PROFILE_VALUES.ftp.min),
    v.maxValue(PROFILE_VALUES.ftp.max)
  )),
  hrMax: v.optional(v.pipe(
    v.number(),
    v.minValue(PROFILE_VALUES.hrMax.min),
    v.maxValue(PROFILE_VALUES.hrMax.max)
  )),
  hrRest: v.optional(v.pipe(
    v.number(),
    v.minValue(PROFILE_VALUES.hrRest.min),
    v.maxValue(PROFILE_VALUES.hrRest.max)
  ))
})
export const StepThreeSchema = v.object({
  maxCarbIntake: v.optional(v.pipe(
    v.number(),
    v.minValue(PROFILE_VALUES.maxCarbIntake.min),
    v.maxValue(PROFILE_VALUES.maxCarbIntake.max)
  ))
})

export const OnboardingSchema = v.object({
  ...StepOneSchema.entries,
  ...StepTwoSchema.entries,
  ...StepThreeSchema.entries
})
export const SavedOnboardingSchema = v.object({
  ...v.partial(OnboardingSchema).entries,
  step: v.optional(v.number(), 0)
})

export type OnboardingSchemaOutput = v.InferOutput<typeof OnboardingSchema>
