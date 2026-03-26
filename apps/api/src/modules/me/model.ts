import type { HRZonesData } from '@carbplan/domain/hr'
import type { PowerZonesData } from '@carbplan/domain/power'
import type { Sex } from '@carbplan/domain/profile'

import type { DatabaseQueryError, EntityNotFound } from '$utils/db-error'

export type CurrentAthleteData = {
  avatarUrl: null | string
  createdAt: Date
  email: string
  ftp: null | number
  fullName: null | string
  heightCm: null | number
  hrMax: null | number
  hrRest: null | number
  hrZones: HRZonesData | null
  id: string
  updatedAt: Date
  maxCarbIntakeGPerHr: null | number
  onboardingCompleted: boolean
  powerZones: null | PowerZonesData
  sex: null | Sex
  weightKg: null | number
}
export type GetCurrentAthleteError = DatabaseQueryError | EntityNotFound

export type UpdateCurrentAthlete = {
  avatarUrl?: string
  ftp?: number
  fullName?: string
  heightCm?: number
  hrMax?: number
  hrRest?: number
  maxCarbIntakeGPerHr?: number
  sex?: Sex
  weightKg?: number
}
export type UpdateCurrentAthleteError = DatabaseQueryError | EntityNotFound
