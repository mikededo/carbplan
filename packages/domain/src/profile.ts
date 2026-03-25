import { z } from 'zod'

export const SexSchema = z.enum(['male', 'female'])
export const SexEnum = SexSchema.enum
export type Sex = z.infer<typeof SexSchema>

export const PROFILE_FIELD_CONSTRAINTS = {
  ftp: { max: 750, min: 50 },
  height: { max: 250, min: 100 },
  hrMax: { max: 220, min: 100 },
  hrRest: { max: 200, min: 30 },
  maxCarbIntake: { default: 60, max: 210, min: 30, step: 5 },
  weight: { max: 200, min: 30 }
} as const
