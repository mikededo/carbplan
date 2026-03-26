import type { ParsedWorkoutStep } from './types'

import * as z from 'zod'

export const ParseWorkoutRequestSchema = z.object({
  text: z.string().trim().min(1, 'Workout text is required')
})

export const WorkoutTargetUnitsSchema = z.enum([
  'cadence_rpm',
  'percent_ftp',
  'percent_hr',
  'percent_lthr',
  'power_zone',
  'watts'
])
export const WorkoutTargetUnitsEnum = WorkoutTargetUnitsSchema.enum

export const ParsedWorkoutTargetSchema = z.object({
  max: z.number().optional(),
  min: z.number().optional(),
  units: WorkoutTargetUnitsSchema,
  value: z.union([z.number(), z.string().trim()])
})

export const ParsedWorkoutStepSchema: z.ZodType<ParsedWorkoutStep> = z.lazy(() =>
  z.object({
    duration_seconds: z.number().min(0),
    is_ramp: z.boolean().optional(),
    reps: z.number().min(1).optional(),
    steps: z.array(ParsedWorkoutStepSchema).optional(),
    target: ParsedWorkoutTargetSchema.optional(),
    text: z.string().trim().optional()
  })
)

export const ParsedWorkoutDocSchema = z.object({
  duration_seconds: z.number().min(0),
  steps: z.array(ParsedWorkoutStepSchema),
  warnings: z.array(z.string().trim())
})
