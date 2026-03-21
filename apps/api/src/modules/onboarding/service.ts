import type * as OnboardingContract from '@carbplan/contracts/onboarding'
import type { AthleteId, Db } from '@carbplan/db'

import { athletes } from '@carbplan/db'
import { eq } from 'drizzle-orm'
import { ResultAsync } from 'neverthrow'

type SaveAthleteOnboardingData = { id: AthleteId } & OnboardingContract.OnboardingRequest

export type OnboardingService = {
  saveAthleteOnboarding: (data: SaveAthleteOnboardingData) => ResultAsync<OnboardingContract.OnboardingResponse, unknown>
}

export class DbOnboardingService implements OnboardingService {
  constructor(private readonly db: Db) { }

  saveAthleteOnboarding({ id, ...data }: SaveAthleteOnboardingData): ResultAsync<OnboardingContract.OnboardingResponse, unknown> {
    return ResultAsync.fromPromise(
      this.db.update(athletes).set(data).where(eq(athletes.id, id)),
      (error) => error
    ).map(() => ({}))
  }
}

