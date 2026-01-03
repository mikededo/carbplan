import * as v from 'valibot'

import { PROFILE_VALUES } from '$lib/domain/settings/constants'

export const ProfileSchema = v.object({
  ftp: v.optional(v.pipe(
    v.number(),
    v.minValue(PROFILE_VALUES.ftp.min),
    v.maxValue(PROFILE_VALUES.ftp.max)
  )),
  fullName: v.pipe(v.string(), v.minLength(1, 'Full name is required')),
  height: v.optional(v.pipe(
    v.number(),
    v.minValue(PROFILE_VALUES.height.min),
    v.maxValue(PROFILE_VALUES.height.max)
  )),
  hrMax: v.optional(v.pipe(
    v.number(),
    v.minValue(PROFILE_VALUES.hrMax.min),
    v.maxValue(PROFILE_VALUES.hrMax.max)
  )),
  hrRest: v.optional(v.pipe(
    v.number(),
    v.minValue(PROFILE_VALUES.hrRest.min),
    v.maxValue(PROFILE_VALUES.hrRest.max)
  )),
  maxCarbIntake: v.optional(v.pipe(
    v.number(),
    v.minValue(PROFILE_VALUES.maxCarbIntake.min),
    v.maxValue(PROFILE_VALUES.maxCarbIntake.max)
  )),
  sex: v.optional(v.picklist(['male', 'female'])),
  weight: v.optional(v.pipe(
    v.number(),
    v.minValue(PROFILE_VALUES.weight.min),
    v.maxValue(PROFILE_VALUES.weight.max)
  ))
})

export type ProfileSchemaOutput = v.InferOutput<typeof ProfileSchema>

