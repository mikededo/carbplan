import type z from 'zod'

import { HRZonesDataSchema } from '@carbplan/domain/hr'

import { ApiEmptyResponse } from '../api'

export const UpdateHRZonesRequestSchema = HRZonesDataSchema
export type UpdateHRZonesRequest = z.infer<typeof HRZonesDataSchema>
export const UpdateHRZonesResponseSchema = ApiEmptyResponse

