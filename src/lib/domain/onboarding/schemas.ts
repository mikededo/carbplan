import * as v from 'valibot'

export const StepOneSchema = v.object({
  fullName: v.pipe(v.string(), v.minLength(1, 'Full name is required')),
  heightCm: v.pipe(
    v.number(),
    v.minValue(100, 'Height must be at least 100cm'),
    v.maxValue(250, 'Height must be at most 250cm')
  ),
  sex: v.picklist(['male', 'female'], 'Please select your sex'),
  weightKg: v.pipe(
    v.number(),
    v.minValue(30, 'Weight must be at least 30kg'),
    v.maxValue(200, 'Weight must be at most 200kg')
  )
})
export const StepTwoSchema = v.object({
  ftp: v.optional(v.pipe(v.number(), v.minValue(50), v.maxValue(750))),
  hrMax: v.optional(v.pipe(v.number(), v.minValue(100), v.maxValue(220))),
  hrRest: v.optional(v.pipe(v.number(), v.minValue(30), v.maxValue(200)))
})
export const StepThreeSchema = v.object({
  maxCarbIntake: v.optional(v.pipe(v.number(), v.minValue(20), v.maxValue(150)))
})

export const OnboardingSchema = v.object({
  ...StepOneSchema.entries,
  ...StepTwoSchema.entries,
  ...StepThreeSchema.entries
})
export const SavedOnboardingSchema = v.object({
  ...v.partial(OnboardingSchema).entries,
  step: v.optional(v.number(), 0)
})

export type OnboardingSchemaOutput = v.InferOutput<typeof OnboardingSchema>

