import type { AthleteId } from '@carbplan/db'
import type { HRZonesData } from '@carbplan/domain/hr'
import type { ResultAsync } from 'neverthrow'

import type { MeRepository } from '$modules/me/repository'
import type { DatabaseQueryError } from '$utils/db-error'

export type MeService = {
  updateHRZones: (id: AthleteId, data: HRZonesData) => ResultAsync<boolean, DatabaseQueryError>
}

export class MeServiceImpl implements MeService {
  constructor(private readonly repository: MeRepository) { }

  updateHRZones(id: AthleteId, data: HRZonesData): ResultAsync<boolean, DatabaseQueryError> {
    return this.repository.updateHRZones(id, data)
  }
}
