import type { AthleteId } from '@carbplan/db'

import type { OnboardingStatus, SaveAthleteOnboardingData } from '$modules/onboarding/model'
import type { OnboardingRepository } from '$modules/onboarding/repository'

import { ResultAsync } from 'neverthrow'

export type OnboardingService = {
  hasCompletedOnboarding: (id: AthleteId) => ResultAsync<OnboardingStatus, unknown>
  saveAthleteOnboarding: (data: SaveAthleteOnboardingData) => ResultAsync<null, unknown>
}

export class OnboardingServiceImpl implements OnboardingService {
  constructor(private readonly repository: OnboardingRepository) { }

  hasCompletedOnboarding(id: AthleteId): ResultAsync<OnboardingStatus, unknown> {
    return ResultAsync.fromPromise(
      this.repository.findCompletionByAthleteId(id),
      (error) => error
    ).map((value) => value ?? { completed: false })
  }

  saveAthleteOnboarding(data: SaveAthleteOnboardingData): ResultAsync<null, null> {
    return ResultAsync.fromPromise(
      this.repository.saveAthleteOnboarding(data),
      (error) => error
    ).map(() => null).mapErr(() => null)
  }
}
