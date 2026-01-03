import * as v from 'valibot'

import { ONBOARDING_VALUES } from '$lib/domain/onboarding/constants'

export const StepOneSchema = v.object({
  fullName: v.pipe(v.string(), v.minLength(1, 'Full name is required')),
  heightCm: v.pipe(
    v.number(),
    v.minValue(ONBOARDING_VALUES.heightCm.min, `Height must be at least ${ONBOARDING_VALUES.heightCm.min}cm`),
    v.maxValue(ONBOARDING_VALUES.heightCm.max, `Height must be at most ${ONBOARDING_VALUES.heightCm.max}cm`)
  ),
  sex: v.picklist(['male', 'female'], 'Please select your sex'),
  weightKg: v.pipe(
    v.number(),
    v.minValue(ONBOARDING_VALUES.weightKg.min, `Weight must be at least ${ONBOARDING_VALUES.weightKg.min}kg`),
    v.maxValue(ONBOARDING_VALUES.weightKg.max, `Weight must be at most ${ONBOARDING_VALUES.weightKg.max}kg`)
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
