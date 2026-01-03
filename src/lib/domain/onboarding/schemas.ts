import * as v from 'valibot'

import { ONBOARDING_VALUES } from '$lib/domain/onboarding/constants'

export const StepOneSchema = v.object({
  fullName: v.pipe(v.string(), v.minLength(1, 'Full name is required')),
  height: v.pipe(
    v.number(),
    v.minValue(ONBOARDING_VALUES.height.min, `Height must be at least ${ONBOARDING_VALUES.height.min}cm`),
    v.maxValue(ONBOARDING_VALUES.height.max, `Height must be at most ${ONBOARDING_VALUES.height.max}cm`)
  ),
  sex: v.picklist(['male', 'female'], 'Please select your sex'),
  weight: v.pipe(
    v.number(),
    v.minValue(ONBOARDING_VALUES.weight.min, `Weight must be at least ${ONBOARDING_VALUES.weight.min}kg`),
    v.maxValue(ONBOARDING_VALUES.weight.max, `Weight must be at most ${ONBOARDING_VALUES.weight.max}kg`)
  )
})
export const StepTwoSchema = v.object({
  ftp: v.optional(v.pipe(
    v.number(),
    v.minValue(ONBOARDING_VALUES.ftp.min),
    v.maxValue(ONBOARDING_VALUES.ftp.max)
  )),
  hrMax: v.optional(v.pipe(
    v.number(),
    v.minValue(ONBOARDING_VALUES.hrMax.min),
    v.maxValue(ONBOARDING_VALUES.hrMax.max)
  )),
  hrRest: v.optional(v.pipe(
    v.number(),
    v.minValue(ONBOARDING_VALUES.hrRest.min),
    v.maxValue(ONBOARDING_VALUES.hrRest.max)
  ))
})
export const StepThreeSchema = v.object({
  maxCarbIntake: v.optional(v.pipe(
    v.number(),
    v.minValue(ONBOARDING_VALUES.maxCarbIntake.min),
    v.maxValue(ONBOARDING_VALUES.maxCarbIntake.max)
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
