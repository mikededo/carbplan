import * as z from 'zod'

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
export const FTPFieldSchema = z.number()
  .min(PROFILE_FIELD_CONSTRAINTS.ftp.min, `FTP muist be at least ${PROFILE_FIELD_CONSTRAINTS.ftp.min} watts`)
  .max(PROFILE_FIELD_CONSTRAINTS.ftp.max, `FTP must be at most ${PROFILE_FIELD_CONSTRAINTS.ftp.max} watts`)
export const HRMaxFieldSchema = z.number()
  .min(PROFILE_FIELD_CONSTRAINTS.hrMax.min, `HR max must be at least ${PROFILE_FIELD_CONSTRAINTS.hrMax.min} bpm`)
  .max(PROFILE_FIELD_CONSTRAINTS.hrMax.max, `HR max must be at most ${PROFILE_FIELD_CONSTRAINTS.hrMax.max} bpm`)
export const HRRestFieldSchema = z.number()
  .min(PROFILE_FIELD_CONSTRAINTS.hrRest.min, `HR rest must be at least ${PROFILE_FIELD_CONSTRAINTS.hrRest.min} bpm`)
  .max(PROFILE_FIELD_CONSTRAINTS.hrRest.max, `HR rest must be at most ${PROFILE_FIELD_CONSTRAINTS.hrRest.max} bpm`)
export const HeightSchema = z.number()
  .min(PROFILE_FIELD_CONSTRAINTS.height.min, `Height must be at least ${PROFILE_FIELD_CONSTRAINTS.height.min}cm`)
  .max(PROFILE_FIELD_CONSTRAINTS.height.max, `Height must be at most ${PROFILE_FIELD_CONSTRAINTS.height.max}cm`)
export const MaxCarbIntakeFieldSchema = z.number()
  .min(PROFILE_FIELD_CONSTRAINTS.maxCarbIntake.min, `Max carb intake must be at least ${PROFILE_FIELD_CONSTRAINTS.maxCarbIntake.min}g/h`)
  .max(PROFILE_FIELD_CONSTRAINTS.maxCarbIntake.max, `Max carb intake must be at most ${PROFILE_FIELD_CONSTRAINTS.maxCarbIntake.max}g/h`)
export const WeightSchema = z.number()
  .min(PROFILE_FIELD_CONSTRAINTS.weight.min, `Weight must be at least ${PROFILE_FIELD_CONSTRAINTS.weight.min}kg`)
  .max(PROFILE_FIELD_CONSTRAINTS.weight.max, `Weight must be at most ${PROFILE_FIELD_CONSTRAINTS.weight.max}kg`)

