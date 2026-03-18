export type WorkoutTargetUnits =
  'cadence_rpm' |
  'percent_ftp' |
  'percent_hr' |
  'percent_lthr' |
  'power_zone' |
  'watts'

export type ParsedWorkoutTarget = {
  units: WorkoutTargetUnits
  value: number | string
  max?: number
  min?: number
}

export type ParsedWorkoutStep = {
  duration_seconds: number
  is_ramp?: boolean
  reps?: number
  steps?: ParsedWorkoutStep[]
  target?: ParsedWorkoutTarget
  text?: string
}

export type ParsedWorkoutDoc = {
  duration_seconds: number
  steps: ParsedWorkoutStep[]
  warnings: string[]
}
