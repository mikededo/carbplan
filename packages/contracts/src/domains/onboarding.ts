import type { ApiEmptyResponse } from '$lib/api'

import { PROFILE_FIELD_CONSTRAINTS, SEX_VALUES } from '@carbplan/domain/profile'
import z from 'zod'

import { ApiEmptyResponseSchema } from '$lib/api'

export const SexSchema = z.enum(SEX_VALUES, 'Invalid sex value')
export const SexEnum = SexSchema.enum

export const OnboardingRequestSchema = z.object({
  ftp: z.number()
    .min(PROFILE_FIELD_CONSTRAINTS.ftp.min)
    .max(PROFILE_FIELD_CONSTRAINTS.ftp.max)
    .optional(),
  fullName: z.string().min(1, 'Full name is required'),
  height: z.number()
    .min(PROFILE_FIELD_CONSTRAINTS.height.min, `Height must be at least ${PROFILE_FIELD_CONSTRAINTS.height.min}cm`)
    .max(PROFILE_FIELD_CONSTRAINTS.height.max, `Height must be at most ${PROFILE_FIELD_CONSTRAINTS.height.max}cm`),
  hrMax: z.number()
    .min(PROFILE_FIELD_CONSTRAINTS.hrMax.min)
    .max(PROFILE_FIELD_CONSTRAINTS.hrMax.max)
    .optional(),
  hrRest: z.number()
    .min(PROFILE_FIELD_CONSTRAINTS.hrRest.min)
    .max(PROFILE_FIELD_CONSTRAINTS.hrRest.max)
    .optional(),
  maxCarbIntake: z.number()
    .min(PROFILE_FIELD_CONSTRAINTS.maxCarbIntake.min)
    .max(PROFILE_FIELD_CONSTRAINTS.maxCarbIntake.max)
    .optional(),
  sex: SexSchema,
  weight: z.number()
    .min(PROFILE_FIELD_CONSTRAINTS.weight.min, `Weight must be at least ${PROFILE_FIELD_CONSTRAINTS.weight.min}kg`)
    .max(PROFILE_FIELD_CONSTRAINTS.weight.max, `Weight must be at most ${PROFILE_FIELD_CONSTRAINTS.weight.max}kg`)
})
export type OnboardingRequest = z.infer<typeof OnboardingRequestSchema>
export const OnboardingResponseSchema = ApiEmptyResponseSchema
export type OnboardingResponse = ApiEmptyResponse
