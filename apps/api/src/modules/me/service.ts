import type { AthleteId } from '@carbplan/db'
import type { HRZonesData } from '@carbplan/domain/hr'
import type { PowerZonesData } from '@carbplan/domain/power'
import type { ResultAsync } from 'neverthrow'

import type { CurrentAthleteData, GetCurrentAthleteError } from '$modules/me/model'
import type { MeRepository } from '$modules/me/repository'
import type { DatabaseQueryError } from '$utils/db-error'

export type MeService = {
  getCurrentAthlete: (id: AthleteId) => ResultAsync<CurrentAthleteData, GetCurrentAthleteError>
  updateHRZones: (id: AthleteId, data: HRZonesData) => ResultAsync<boolean, DatabaseQueryError>
  updatePowerZones: (id: AthleteId, data: PowerZonesData) => ResultAsync<boolean, DatabaseQueryError>
}

export class MeServiceImpl implements MeService {
  constructor(private readonly repository: MeRepository) { }

  getCurrentAthlete(id: AthleteId): ResultAsync<CurrentAthleteData, GetCurrentAthleteError> {
    return this.repository.getCurrentAthlete(id)
  }

  updateHRZones(id: AthleteId, data: HRZonesData): ResultAsync<boolean, DatabaseQueryError> {
    return this.repository.updateHRZones(id, data)
  }

  updatePowerZones(id: AthleteId, data: PowerZonesData): ResultAsync<boolean, DatabaseQueryError> {
    return this.repository.updatePowerZones(id, data)
  }
}
