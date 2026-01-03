import type * as v from 'valibot'

import type {
  OnboardingSchema,
  SavedOnboardingSchema,
  StepOneSchema,
  StepThreeSchema,
  StepTwoSchema
} from './schemas'

export type StepOneData = v.InferOutput<typeof StepOneSchema>
export type StepTwoData = v.InferOutput<typeof StepTwoSchema>
export type StepThreeData = v.InferOutput<typeof StepThreeSchema>
export type OnboardingFormData = v.InferOutput<typeof OnboardingSchema>
export type SavedOnboardingFormData = v.InferOutput<typeof SavedOnboardingSchema>

export type OnboardingStep = 0 | 1 | 2

export const ONBOARDING_STEPS = ['About you', 'Training metrics', 'Nutrition'] as const

