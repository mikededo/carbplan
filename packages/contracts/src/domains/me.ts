import { HRZonesDataSchema } from '@carbplan/domain/hr'
import { PowerZonesDataSchema } from '@carbplan/domain/power'
import { SexSchema } from '@carbplan/domain/profile'
import { z } from 'zod'

import { ApiEmptyResponse } from '../api'

export const GetCurrentAthleteResponseSchema = z.object({
  avatarUrl: z.string().nullable(),
  createdAt: z.date(),
  email: z.email(),
  ftp: z.number().nullable(),
  fullName: z.string().nullable(),
  heightCm: z.number().nullable(),
  hrMax: z.number().nullable(),
  hrRest: z.number().nullable(),
  hrZones: HRZonesDataSchema.nullable(),
  id: z.uuid(),
  isAdmin: z.boolean().default(false),
  maxCarbIntakeGPerHr: z.number().nullable(),
  onboardingCompleted: z.boolean().default(false),
  powerZones: PowerZonesDataSchema.nullable(),
  sex: SexSchema.nullable(),
  updatedAt: z.date(),
  weightKg: z.number().nullable()
})
export type GetCurrentAthleteResponse = z.infer<typeof GetCurrentAthleteResponseSchema>

export const UpdateHRZonesRequestSchema = HRZonesDataSchema
export type UpdateHRZonesRequest = z.infer<typeof HRZonesDataSchema>
export const UpdateHRZonesResponseSchema = ApiEmptyResponse

export const UpdatePowerZonesRequestSchema = PowerZonesDataSchema
export type UpdatePowerZonesRequest = z.infer<typeof PowerZonesDataSchema>
export const UpdatePowerZonesResponseSchema = ApiEmptyResponse
