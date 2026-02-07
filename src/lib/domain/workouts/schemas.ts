import * as v from 'valibot'

export const ParseWorkoutRequestSchema = v.object({
  text: v.pipe(v.string(), v.minLength(1, 'Workout text is required'))
})

export const WorkoutTargetUnitsSchema = v.picklist([
  'cadence_rpm',
  'percent_ftp',
  'percent_hr',
  'percent_lthr',
  'power_zone',
  'watts'
])

export const ParsedWorkoutTargetSchema = v.object({
  max: v.optional(v.number()),
  min: v.optional(v.number()),
  units: WorkoutTargetUnitsSchema,
  value: v.union([v.number(), v.string()])
})

export const ParsedWorkoutStepSchema = v.lazy(() =>
  v.object({
    duration_seconds: v.pipe(v.number(), v.minValue(0)),
    is_ramp: v.optional(v.boolean()),
    reps: v.optional(v.pipe(v.number(), v.minValue(1))),
    steps: v.optional(v.array(ParsedWorkoutStepSchema)),
    target: v.optional(ParsedWorkoutTargetSchema),
    text: v.optional(v.string())
  })
)

export const ParsedWorkoutDocSchema = v.object({
  duration_seconds: v.pipe(v.number(), v.minValue(0)),
  steps: v.array(ParsedWorkoutStepSchema),
  warnings: v.array(v.string())
})
