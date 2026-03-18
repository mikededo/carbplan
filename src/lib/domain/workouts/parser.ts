import type { ParsedWorkoutDoc, ParsedWorkoutStep, ParsedWorkoutTarget, WorkoutTargetUnits } from './types'

import { WorkoutTargetUnitsEnum } from './schemas'

const GROUP_HEADER_REGEX = /^(\d+)x\b/i
const COMPACT_DURATION_REGEX = /^(\d+)m(\d+)$/
const DURATION_TOKEN_REGEX = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i
const TARGET_RANGE_REGEX = /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*(w|%|rpm)?/i
const ZONE_REGEX = /\b(Z[1-7]|SS)\b/i
const PERCENT_REGEX = /(\d+(?:\.\d+)?)\s*%/
const WATTS_REGEX = /(\d+(?:\.\d+)?)\s*w\b/i
const CADENCE_REGEX = /(\d+(?:\.\d+)?)\s*rpm\b/i
const RAMP_PREFIX_REGEX = /^ramp\b/i
const WHITESPACE_REGEX = /\s+/
const LINE_SPLIT_REGEX = /\r?\n/

const isGroupHeader = (line: string) => GROUP_HEADER_REGEX.exec(line.trim())

const parseDurationToken = (token: string) => {
  const compactMatch = COMPACT_DURATION_REGEX.exec(token)
  if (compactMatch) {
    const minutes = Number(compactMatch[1])
    const seconds = Number(compactMatch[2])
    return minutes * 60 + seconds
  }

  const match = DURATION_TOKEN_REGEX.exec(token)
  if (!match) {
    return null
  }

  const [hours, minutes, seconds] = match.slice(1).map((value) => Number(value ?? 0))
  if (hours === 0 && minutes === 0 && seconds === 0) {
    return null
  }

  return hours * 3600 + minutes * 60 + seconds
}

const getPercentUnits = (text: string): WorkoutTargetUnits => {
  const normalized = text.toLowerCase()
  if (normalized.includes('lthr')) {
    return WorkoutTargetUnitsEnum.percent_lthr
  }
  if (normalized.includes('hr')) {
    return WorkoutTargetUnitsEnum.percent_hr
  }
  return WorkoutTargetUnitsEnum.percent_ftp
}

const parseTarget = (text: string): ParsedWorkoutTarget | undefined => {
  if (!text) {
    return undefined
  }

  const rangeMatch = TARGET_RANGE_REGEX.exec(text)
  if (rangeMatch) {
    const min = Number(rangeMatch[1])
    const max = Number(rangeMatch[2])
    const unit = rangeMatch[3]?.toLowerCase()

    if (unit === 'w') {
      return { max, min, units: WorkoutTargetUnitsEnum.watts, value: min }
    }
    if (unit === 'rpm') {
      return { max, min, units: WorkoutTargetUnitsEnum.cadence_rpm, value: min }
    }
    if (unit === '%' || text.includes('%')) {
      return { max, min, units: getPercentUnits(text), value: min }
    }
  }

  const zoneMatch = ZONE_REGEX.exec(text)
  if (zoneMatch) {
    return { units: WorkoutTargetUnitsEnum.power_zone, value: zoneMatch[1].toUpperCase() }
  }

  const percentMatch = PERCENT_REGEX.exec(text)
  if (percentMatch) {
    return { units: getPercentUnits(text), value: Number(percentMatch[1]) }
  }

  const wattsMatch = WATTS_REGEX.exec(text)
  if (wattsMatch) {
    return { units: WorkoutTargetUnitsEnum.watts, value: Number(wattsMatch[1]) }
  }

  const cadenceMatch = CADENCE_REGEX.exec(text)
  if (cadenceMatch) {
    return { units: WorkoutTargetUnitsEnum.cadence_rpm, value: Number(cadenceMatch[1]) }
  }

  return undefined
}

const parseStepLine = (line: string, warnings: string[]): null | ParsedWorkoutStep => {
  let content = line.trim()
  if (!content) {
    return null
  }

  if (content.startsWith('-')) {
    content = content.slice(1).trim()
  }

  let isRamp = false
  if (RAMP_PREFIX_REGEX.test(content)) {
    isRamp = true
    content = content.replace(RAMP_PREFIX_REGEX, '').trim()
  }

  const [durationToken] = content.split(WHITESPACE_REGEX)
  const durationSeconds = durationToken ? parseDurationToken(durationToken) : null
  let remainder = durationToken ? content.slice(durationToken.length).trim() : content

  if (RAMP_PREFIX_REGEX.test(remainder)) {
    isRamp = true
    remainder = remainder.replace(RAMP_PREFIX_REGEX, '').trim()
  }

  if (durationSeconds === null) {
    warnings.push(`Unable to parse duration from "${line}"`)
  }

  return {
    duration_seconds: durationSeconds ?? 0,
    is_ramp: isRamp || undefined,
    target: parseTarget(remainder),
    text: content
  }
}

const sumDuration = (steps: ParsedWorkoutStep[]) =>
  steps.reduce((total, step) => total + step.duration_seconds, 0)

export const parseWorkoutText = (text: string): ParsedWorkoutDoc => {
  const lines = text.split(LINE_SPLIT_REGEX)
  const warnings: string[] = []
  const steps: ParsedWorkoutStep[] = []

  let index = 0
  while (index < lines.length) {
    const rawLine = lines[index]?.trim() ?? ''

    if (!rawLine) {
      index += 1
      continue
    }

    const groupMatch = isGroupHeader(rawLine)
    if (groupMatch) {
      const reps = Number(groupMatch[1])
      const groupSteps: ParsedWorkoutStep[] = []
      index += 1

      while (index < lines.length) {
        const groupLine = lines[index]?.trim() ?? ''
        if (!groupLine) {
          break
        }

        const step = parseStepLine(groupLine, warnings)
        if (step) {
          groupSteps.push(step)
        }

        index += 1
      }

      if (groupSteps.length === 0) {
        warnings.push(`Group "${rawLine}" has no steps`)
      }

      const groupDuration = sumDuration(groupSteps) * reps
      steps.push({
        duration_seconds: groupDuration,
        reps,
        steps: groupSteps,
        text: rawLine
      })

      index += 1
      continue
    }

    const step = parseStepLine(rawLine, warnings)
    if (step) {
      steps.push(step)
    }

    index += 1
  }

  return {
    duration_seconds: sumDuration(steps),
    steps,
    warnings
  }
}
