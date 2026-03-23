import type { AthleteId, Db } from '@carbplan/db'

import type { OnboardingStatus, SaveAthleteOnboardingData } from '$modules/onboarding/model'

import { athletes } from '@carbplan/db'
import { eq } from 'drizzle-orm'

export type OnboardingRepository = {
  findCompletionByAthleteId: (id: AthleteId) => Promise<null | OnboardingStatus>
  saveAthleteOnboarding: (data: SaveAthleteOnboardingData) => Promise<void>
}

export class DbOnboardingRepository implements OnboardingRepository {
  constructor(private readonly db: Db) { }

  async findCompletionByAthleteId(id: AthleteId): Promise<null | OnboardingStatus> {
    const [value] = await this.db
      .select({ completed: athletes.onboardingCompleted })
      .from(athletes)
      .where(eq(athletes.id, id))

    return value ?? null
  }

  async saveAthleteOnboarding({ id, ...data }: SaveAthleteOnboardingData): Promise<void> {
    await this.db
      .update(athletes)
      .set({ ...data, onboardingCompleted: true })
      .where(eq(athletes.id, id))
  }
}
