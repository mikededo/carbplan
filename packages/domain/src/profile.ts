export const SEX_VALUES = ['male', 'female'] as const
export type Sex = (typeof SEX_VALUES)[number]

export const PROFILE_FIELD_CONSTRAINTS = {
  ftp: { max: 750, min: 50 },
  height: { max: 250, min: 100 },
  hrMax: { max: 220, min: 100 },
  hrRest: { max: 200, min: 30 },
  maxCarbIntake: { default: 60, max: 210, min: 30, step: 5 },
  weight: { max: 200, min: 30 }
} as const
