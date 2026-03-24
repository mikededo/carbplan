import type { AthleteId, Db } from '@carbplan/db'
import type { HRZonesData } from '@carbplan/domain/hr'

import { athletes } from '@carbplan/db'
import { eq } from 'drizzle-orm'
import { ResultAsync } from 'neverthrow'

export type MeRepository = {
  updateHRZones: (id: AthleteId, data: HRZonesData) => ResultAsync<boolean, null>
}

export class DbMeRepository implements MeRepository {
  constructor(private readonly db: Db) { }

  updateHRZones(id: AthleteId, data: HRZonesData): ResultAsync<boolean, null> {
    return ResultAsync.fromPromise(
      this.execUpdateHrZones(id, data),
      (error) => error
    ).mapErr(() => null)
  }

  private async execUpdateHrZones(id: AthleteId, data: HRZonesData): Promise<boolean> {
    await this.db.update(athletes).set({ hrZones: data }).where(eq(athletes.id, id))
    return true
  }
}
