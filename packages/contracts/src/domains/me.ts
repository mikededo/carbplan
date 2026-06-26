import { AthleteIdSchema } from '@kilo/domain/athlete'
import { HRZonesDataSchema } from '@kilo/domain/hr'
import { PowerZonesDataSchema } from '@kilo/domain/power'
import {
  FTPFieldSchema,
  HeightSchema,
  HRMaxFieldSchema,
  HRRestFieldSchema,
  MaxCarbIntakeFieldSchema,
  SexSchema,
  WeightSchema
} from '@kilo/domain/profile'
import * as z from 'zod'

import { ApiEmptyResponseSchema } from '../api'
import { DateSchema } from './date'

export const GetCurrentAthleteResponseSchema = z.object({
  avatarUrl: z.string().trim().nullable(),
  createdAt: DateSchema,
  email: z.email(),
  ftp: FTPFieldSchema.nullable(),
  fullName: z.string().trim().nullable(),
  heightCm: HeightSchema.nullable(),
  hrMax: HRMaxFieldSchema.nullable(),
  hrRest: HRRestFieldSchema.nullable(),
  hrZones: HRZonesDataSchema.nullable(),
  id: AthleteIdSchema,
  maxCarbIntakeGPerHr: MaxCarbIntakeFieldSchema.nullable(),
  onboardingCompleted: z.boolean().default(false),
  powerZones: PowerZonesDataSchema.nullable(),
  sex: SexSchema.nullable(),
  updatedAt: DateSchema,
  weightKg: WeightSchema.nullable()
})
export type GetCurrentAthleteResponse = z.infer<typeof GetCurrentAthleteResponseSchema>

export const UpdateCurrentAthleteRequestSchema = z.object({
  ftp: FTPFieldSchema.optional(),
  fullName: z.string().trim().optional(),
  heightCm: HeightSchema.optional(),
  hrMax: HRMaxFieldSchema.optional(),
  hrRest: HRRestFieldSchema.optional(),
  hrZones: HRZonesDataSchema.optional(),
  maxCarbIntakeGPerHr: MaxCarbIntakeFieldSchema.optional(),
  sex: SexSchema.optional(),
  weightKg: WeightSchema.optional()
})
export type UpdateCurrentAthleteRequest = z.infer<typeof UpdateCurrentAthleteRequestSchema>
export const UpdateCurrentAthleteResponseSchema = ApiEmptyResponseSchema
export type UpdateCurrentAthleteResponse = z.infer<typeof UpdateCurrentAthleteResponseSchema>

export const UpdateHRZonesRequestSchema = HRZonesDataSchema
export type UpdateHRZonesRequest = z.infer<typeof HRZonesDataSchema>
export const UpdateHRZonesResponseSchema = ApiEmptyResponseSchema

export const UpdatePowerZonesRequestSchema = PowerZonesDataSchema
export type UpdatePowerZonesRequest = z.infer<typeof PowerZonesDataSchema>
export const UpdatePowerZonesResponseSchema = ApiEmptyResponseSchema
