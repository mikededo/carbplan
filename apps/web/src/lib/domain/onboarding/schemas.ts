import { PROFILE_FIELD_CONSTRAINTS } from '@carbplan/domain/profile'
import * as z from 'zod'

export const SexSchema = z.enum(['male', 'female'], 'Please select your sex')
export const SexEnum = SexSchema.enum

export const StepOneSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  height: z.number()
    .min(PROFILE_FIELD_CONSTRAINTS.height.min, `Height must be at least ${PROFILE_FIELD_CONSTRAINTS.height.min}cm`)
    .max(PROFILE_FIELD_CONSTRAINTS.height.max, `Height must be at most ${PROFILE_FIELD_CONSTRAINTS.height.max}cm`),
  sex: SexSchema,
  weight: z.number()
    .min(PROFILE_FIELD_CONSTRAINTS.weight.min, `Weight must be at least ${PROFILE_FIELD_CONSTRAINTS.weight.min}kg`)
    .max(PROFILE_FIELD_CONSTRAINTS.weight.max, `Weight must be at most ${PROFILE_FIELD_CONSTRAINTS.weight.max}kg`)
})
export const StepTwoSchema = z.object({
  ftp: z.number()
    .min(PROFILE_FIELD_CONSTRAINTS.ftp.min)
    .max(PROFILE_FIELD_CONSTRAINTS.ftp.max)
    .optional(),
  hrMax: z.number()
    .min(PROFILE_FIELD_CONSTRAINTS.hrMax.min)
    .max(PROFILE_FIELD_CONSTRAINTS.hrMax.max)
    .optional(),
  hrRest: z.number()
    .min(PROFILE_FIELD_CONSTRAINTS.hrRest.min)
    .max(PROFILE_FIELD_CONSTRAINTS.hrRest.max)
    .optional()
})
export const StepThreeSchema = z.object({
  maxCarbIntake: z.number()
    .min(PROFILE_FIELD_CONSTRAINTS.maxCarbIntake.min)
    .max(PROFILE_FIELD_CONSTRAINTS.maxCarbIntake.max)
    .optional()
})

export const OnboardingSchema = StepOneSchema.extend(StepTwoSchema.shape).extend(StepThreeSchema.shape)
export const SavedOnboardingSchema = OnboardingSchema.partial().extend({
  step: z.number().optional()
})

export type OnboardingSchemaOutput = z.infer<typeof OnboardingSchema>
