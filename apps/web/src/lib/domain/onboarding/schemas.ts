import * as z from 'zod'

import { PROFILE_VALUES } from '$lib/domain/settings/constants'

export const SexSchema = z.enum(['male', 'female'], 'Please select your sex')
export const SexEnum = SexSchema.enum

export const StepOneSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  height: z.number()
    .min(PROFILE_VALUES.height.min, `Height must be at least ${PROFILE_VALUES.height.min}cm`)
    .max(PROFILE_VALUES.height.max, `Height must be at most ${PROFILE_VALUES.height.max}cm`),
  sex: SexSchema,
  weight: z.number()
    .min(PROFILE_VALUES.weight.min, `Weight must be at least ${PROFILE_VALUES.weight.min}kg`)
    .max(PROFILE_VALUES.weight.max, `Weight must be at most ${PROFILE_VALUES.weight.max}kg`)
})
export const StepTwoSchema = z.object({
  ftp: z.number()
    .min(PROFILE_VALUES.ftp.min)
    .max(PROFILE_VALUES.ftp.max)
    .optional(),
  hrMax: z.number()
    .min(PROFILE_VALUES.hrMax.min)
    .max(PROFILE_VALUES.hrMax.max)
    .optional(),
  hrRest: z.number()
    .min(PROFILE_VALUES.hrRest.min)
    .max(PROFILE_VALUES.hrRest.max)
    .optional()
})
export const StepThreeSchema = z.object({
  maxCarbIntake: z.number()
    .min(PROFILE_VALUES.maxCarbIntake.min)
    .max(PROFILE_VALUES.maxCarbIntake.max)
    .optional()
})

export const OnboardingSchema = StepOneSchema.merge(StepTwoSchema).merge(StepThreeSchema)
export const SavedOnboardingSchema = OnboardingSchema.partial().extend({
  step: z.number().optional()
})

export type OnboardingSchemaOutput = z.infer<typeof OnboardingSchema>
