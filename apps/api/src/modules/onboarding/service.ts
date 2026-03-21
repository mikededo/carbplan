import type * as OnboardingContract from '@carbplan/contracts/onboarding'
import type { AthleteId, Db } from '@carbplan/db'

import { athletes } from '@carbplan/db'
import { eq } from 'drizzle-orm'
import { ResultAsync } from 'neverthrow'

type SaveAthleteOnboardingData = { id: AthleteId } & OnboardingContract.SaveOnboardingRequest

export type OnboardingService = {
  hasCompletedOnboarding: (id: AthleteId) => ResultAsync<OnboardingContract.HasCompletedOnboardingResponse, unknown>
  saveAthleteOnboarding: (data: SaveAthleteOnboardingData) => ResultAsync<OnboardingContract.SaveOnboardingResponse, unknown>
}

export class DbOnboardingService implements OnboardingService {
  constructor(private readonly db: Db) { }

  hasCompletedOnboarding(id: AthleteId): ResultAsync<OnboardingContract.HasCompletedOnboardingResponse, unknown> {
    return ResultAsync.fromPromise(
      this.db.select({ completed: athletes.onboardingCompleted }).from(athletes).where(eq(athletes.id, id)),
      (error) => error
    ).map(([value]) => value)
  }

  saveAthleteOnboarding({ id, ...data }: SaveAthleteOnboardingData): ResultAsync<OnboardingContract.SaveOnboardingResponse, null> {
    return ResultAsync.fromPromise(
      this.db.update(athletes).set({ ...data, onboardingCompleted: true }).where(eq(athletes.id, id)),
      (error) => error
    ).map(() => null).mapErr(() => null)
  }
}

