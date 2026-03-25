import type { AthleteId } from '@carbplan/db'
import type { ResultAsync } from 'neverthrow'

import type { OnboardingStatus, SaveAthleteOnboardingData } from '$modules/onboarding/model'
import type { OnboardingRepository } from '$modules/onboarding/repository'
import type { DatabaseQueryError } from '$utils/db-error'

export type OnboardingService = {
  hasCompletedOnboarding: (id: AthleteId) => ResultAsync<OnboardingStatus, DatabaseQueryError>
  saveAthleteOnboarding: (data: SaveAthleteOnboardingData) => ResultAsync<void, DatabaseQueryError>
}

export class OnboardingServiceImpl implements OnboardingService {
  constructor(private readonly repository: OnboardingRepository) { }

  hasCompletedOnboarding(id: AthleteId): ResultAsync<OnboardingStatus, DatabaseQueryError> {
    return this.repository.findCompletionByAthleteId(id)
  }

  saveAthleteOnboarding(data: SaveAthleteOnboardingData): ResultAsync<void, DatabaseQueryError> {
    return this.repository.saveAthleteOnboarding(data)
  }
}
