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
  isAdmin: boolean
  maxCarbIntakeGPerHr: null | number
  onboardingCompleted: boolean
  powerZones: null | PowerZonesData
  sex: null | Sex
  weightKg: null | number
}

export type GetCurrentAthleteError = DatabaseQueryError | EntityNotFound
