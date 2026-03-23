import type { Athlete, AthleteId } from '@carbplan/db'

export type OnboardingStatus = {
  completed: Athlete['onboardingCompleted']
}

export type SaveAthleteOnboardingData = {
  ftp?: NonNullable<Athlete['ftp']>
  fullName: NonNullable<Athlete['fullName']>
  height: NonNullable<Athlete['heightCm']>
  hrMax?: NonNullable<Athlete['hrMax']>
  hrRest?: NonNullable<Athlete['hrRest']>
  id: AthleteId
  maxCarbIntake?: NonNullable<Athlete['maxCarbIntakeGPerHr']>
  sex: NonNullable<Athlete['sex']>
  weight: NonNullable<Athlete['weightKg']>
}

