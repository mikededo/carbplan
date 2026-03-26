import * as z from 'zod'

import { PROFILE_VALUES } from '$lib/domain/settings/constants'

export const SexSchema = z.enum(['male', 'female'])
export const SexEnum = SexSchema.enum

export const ProfileSchema = z.object({
  ftp: z.number()
    .min(PROFILE_VALUES.ftp.min)
    .max(PROFILE_VALUES.ftp.max)
    .optional(),
  fullName: z.string().trim().min(1, 'Full name is required'),
  height: z.number()
    .min(PROFILE_VALUES.height.min)
    .max(PROFILE_VALUES.height.max)
    .optional(),
  hrMax: z.number()
    .min(PROFILE_VALUES.hrMax.min)
    .max(PROFILE_VALUES.hrMax.max)
    .optional(),
  hrRest: z.number()
    .min(PROFILE_VALUES.hrRest.min)
    .max(PROFILE_VALUES.hrRest.max)
    .optional(),
  maxCarbIntake: z.number()
    .min(PROFILE_VALUES.maxCarbIntake.min)
    .max(PROFILE_VALUES.maxCarbIntake.max)
    .optional(),
  sex: SexSchema.optional(),
  weight: z.number()
    .min(PROFILE_VALUES.weight.min)
    .max(PROFILE_VALUES.weight.max)
    .optional()
})

export type ProfileSchemaOutput = z.infer<typeof ProfileSchema>

