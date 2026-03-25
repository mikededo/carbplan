import type { AthleteId, Db } from '@carbplan/db'
import type { HRZonesData } from '@carbplan/domain/hr'
import type { PowerZonesData } from '@carbplan/domain/power'

import type { CurrentAthleteData, GetCurrentAthleteError } from '$modules/me/model'
import type { DatabaseQueryError } from '$utils/db-error'

import { athletes } from '@carbplan/db'
import { eq } from 'drizzle-orm'
import { head } from 'es-toolkit'
import { err, ok, ResultAsync } from 'neverthrow'

import { EntityNotFound, mapDbError } from '$utils/db-error'

export type MeRepository = {
  getCurrentAthlete: (id: AthleteId) => ResultAsync<CurrentAthleteData, GetCurrentAthleteError>
  updateHRZones: (id: AthleteId, data: HRZonesData) => ResultAsync<boolean, DatabaseQueryError>
  updatePowerZones: (id: AthleteId, data: PowerZonesData) => ResultAsync<boolean, DatabaseQueryError>
}

export class DbMeRepository implements MeRepository {
  constructor(private readonly db: Db) { }

  getCurrentAthlete(id: AthleteId): ResultAsync<CurrentAthleteData, GetCurrentAthleteError> {
    return ResultAsync.fromPromise(
      this.db.select().from(athletes).limit(1).where(eq(athletes.id, id)),
      mapDbError
    )
      .map((items) => head(items))
      .andThen((result) => result ? ok(result) : err(EntityNotFound.withEntityName('Athlete')))
  }

  updateHRZones(id: AthleteId, data: HRZonesData): ResultAsync<boolean, DatabaseQueryError> {
    return ResultAsync.fromPromise(
      this.execUpdateHrZones(id, data),
      mapDbError
    )
  }

  updatePowerZones(id: AthleteId, data: PowerZonesData): ResultAsync<boolean, DatabaseQueryError> {
    return ResultAsync.fromPromise(
      this.execUpdatePowerZones(id, data),
      mapDbError
    )
  }

  private async execUpdateHrZones(id: AthleteId, hrZones: HRZonesData): Promise<boolean> {
    await this.db.update(athletes).set({ hrZones }).where(eq(athletes.id, id))
    return true
  }

  private async execUpdatePowerZones(id: AthleteId, powerZones: PowerZonesData): Promise<boolean> {
    await this.db.update(athletes).set({ powerZones }).where(eq(athletes.id, id))
    return true
  }
}
