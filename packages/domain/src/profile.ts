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
export const FTPFieldSchema = z.number().min(PROFILE_FIELD_CONSTRAINTS.ftp.min).max(PROFILE_FIELD_CONSTRAINTS.ftp.max)
export const HRMaxFieldSchema = z.number().min(PROFILE_FIELD_CONSTRAINTS.hrMax.min).max(PROFILE_FIELD_CONSTRAINTS.hrMax.max)
export const HRRestFieldSchema = z.number().min(PROFILE_FIELD_CONSTRAINTS.hrRest.min).max(PROFILE_FIELD_CONSTRAINTS.hrRest.max)
export const HeightSchema = z.number().min(PROFILE_FIELD_CONSTRAINTS.height.min).max(PROFILE_FIELD_CONSTRAINTS.height.max)
export const MaxCarbIntakeFieldSchema = z.number().min(PROFILE_FIELD_CONSTRAINTS.maxCarbIntake.min).max(PROFILE_FIELD_CONSTRAINTS.maxCarbIntake.max)
export const WeightSchema = z.number().min(PROFILE_FIELD_CONSTRAINTS.weight.min).max(PROFILE_FIELD_CONSTRAINTS.weight.max)

