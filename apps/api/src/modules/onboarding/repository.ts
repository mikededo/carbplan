import type { AthleteId, Db } from '@carbplan/db'

import type { OnboardingStatus, SaveAthleteOnboardingData } from '$modules/onboarding/model'
import type { DatabaseQueryError } from '$utils/db-error'

import { athletes } from '@carbplan/db'
import { f } from '@carbplan/utils/function'
import { eq } from 'drizzle-orm'
import { ResultAsync } from 'neverthrow'

import { mapDbError } from '$utils/db-error'

export type OnboardingRepository = {
  findCompletionByAthleteId: (id: AthleteId) => ResultAsync<OnboardingStatus, DatabaseQueryError>
  saveAthleteOnboarding: (data: SaveAthleteOnboardingData) => ResultAsync<void, DatabaseQueryError>
}

export class DbOnboardingRepository implements OnboardingRepository {
  constructor(private readonly db: Db) { }

  findCompletionByAthleteId(id: AthleteId): ResultAsync<OnboardingStatus, DatabaseQueryError> {
    return ResultAsync.fromPromise(
      this.db
        .select({ completed: athletes.onboardingCompleted })
        .from(athletes)
        .where(eq(athletes.id, id)),
      mapDbError
    ).map(([value]) => value)
  }

  saveAthleteOnboarding({ id, ...data }: SaveAthleteOnboardingData): ResultAsync<void, DatabaseQueryError> {
    return ResultAsync.fromPromise(
      this.db
        .update(athletes)
        .set({ ...data, onboardingCompleted: true })
        .where(eq(athletes.id, id)),
      mapDbError
    ).map(f.noop)
  }
}
