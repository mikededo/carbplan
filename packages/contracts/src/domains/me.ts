import type z from 'zod'

import { HRZonesDataSchema } from '@carbplan/domain/hr'
import { PowerZonesDataSchema } from '@carbplan/domain/power'

import { ApiEmptyResponse } from '../api'

export const UpdateHRZonesRequestSchema = HRZonesDataSchema
export type UpdateHRZonesRequest = z.infer<typeof HRZonesDataSchema>
export const UpdateHRZonesResponseSchema = ApiEmptyResponse

export const UpdatePowerZonesRequestSchema = PowerZonesDataSchema
export type UpdatePowerZonesRequest = z.infer<typeof PowerZonesDataSchema>
export const UpdatePowerZonesResponseSchema = ApiEmptyResponse

