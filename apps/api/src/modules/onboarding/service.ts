import type { AthleteId } from '@carbplan/db'

import type { OnboardingStatus, SaveAthleteOnboardingData } from '$modules/onboarding/model'
import type { OnboardingRepository } from '$modules/onboarding/repository'
import type { DatabaseQueryError } from '$utils/db-error'

import { ResultAsync } from 'neverthrow'

import { mapDbError } from '$utils/db-error'

export type OnboardingService = {
  hasCompletedOnboarding: (id: AthleteId) => ResultAsync<OnboardingStatus, DatabaseQueryError>
  saveAthleteOnboarding: (data: SaveAthleteOnboardingData) => ResultAsync<null, DatabaseQueryError>
}

export class OnboardingServiceImpl implements OnboardingService {
  constructor(private readonly repository: OnboardingRepository) { }

  hasCompletedOnboarding(id: AthleteId): ResultAsync<OnboardingStatus, DatabaseQueryError> {
    return ResultAsync.fromPromise(
      this.repository.findCompletionByAthleteId(id),
      mapDbError
    ).map((value) => value ?? { completed: false })
  }

  saveAthleteOnboarding(data: SaveAthleteOnboardingData): ResultAsync<null, DatabaseQueryError> {
    return ResultAsync.fromPromise(
      this.repository.saveAthleteOnboarding(data),
      mapDbError
    ).map(() => null)
  }
}
