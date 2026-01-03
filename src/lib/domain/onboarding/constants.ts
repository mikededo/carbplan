export const ONBOARDING_VALUES = {
  ftp: { max: 750, min: 50 },
  heightCm: { max: 250, min: 100 },
  hrMax: { max: 220, min: 100 },
  hrRest: { max: 200, min: 30 },
  maxCarbIntake: { default: 60, max: 210, min: 30, step: 5 },
  weightKg: { max: 200, min: 30 }
} as const

