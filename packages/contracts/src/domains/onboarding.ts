import {
  FTPFieldSchema,
  HeightSchema,
  HRMaxFieldSchema,
  HRRestFieldSchema,
  MaxCarbIntakeFieldSchema,
  SexSchema,
  WeightSchema
} from '@carbplan/domain/profile'
import * as z from 'zod'

import { ApiEmptyResponseSchema } from '../api'

export const SaveOnboardingRequestSchema = z.object({
  ftp: FTPFieldSchema
    .optional(),
  fullName: z.string().trim().min(1, 'Full name is required'),
  height: HeightSchema,
  hrMax: HRMaxFieldSchema.optional(),
  hrRest: HRRestFieldSchema.optional(),
  maxCarbIntake: MaxCarbIntakeFieldSchema.optional(),
  sex: SexSchema,
  weight: WeightSchema
})
export type SaveOnboardingRequest = z.infer<typeof SaveOnboardingRequestSchema>
export const SaveOnboardingResponseSchema = ApiEmptyResponseSchema
export type SaveOnboardingResponse = z.infer<typeof SaveOnboardingResponseSchema>

export const HasCompletedOnboardingResponseSchema = z.object({ completed: z.boolean() })
export type HasCompletedOnboardingResponse = z.infer<typeof HasCompletedOnboardingResponseSchema>
