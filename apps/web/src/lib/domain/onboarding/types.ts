import type * as z from 'zod'

import type {
  OnboardingSchema,
  SavedOnboardingSchema,
  StepOneSchema,
  StepThreeSchema,
  StepTwoSchema
} from './schemas'

export type StepOneData = z.infer<typeof StepOneSchema>
export type StepTwoData = z.infer<typeof StepTwoSchema>
export type StepThreeData = z.infer<typeof StepThreeSchema>
export type OnboardingFormData = z.infer<typeof OnboardingSchema>
export type SavedOnboardingFormData = z.infer<typeof SavedOnboardingSchema>

export type OnboardingStep = 0 | 1 | 2

export const ONBOARDING_STEPS = ['About you', 'Training metrics', 'Nutrition'] as const

