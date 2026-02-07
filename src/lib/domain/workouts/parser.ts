import type { ParsedWorkoutDoc, ParsedWorkoutStep, ParsedWorkoutTarget, WorkoutTargetUnits } from './types'

const isGroupHeader = (line: string) => /^(\d+)x\b/i.exec(line.trim())

const parseDurationToken = (token: string) => {
  const compactMatch = /^(\d+)m(\d+)$/.exec(token)
  if (compactMatch) {
    const minutes = Number(compactMatch[1])
    const seconds = Number(compactMatch[2])
    return minutes * 60 + seconds
  }

  const match = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i.exec(token)
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
    return 'percent_lthr'
  }
  if (normalized.includes('hr')) {
    return 'percent_hr'
  }
  return 'percent_ftp'
}

const parseTarget = (text: string): ParsedWorkoutTarget | undefined => {
  if (!text) {
    return undefined
  }

  const rangeMatch = /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*(w|%|rpm)?/i.exec(text)
  if (rangeMatch) {
    const min = Number(rangeMatch[1])
    const max = Number(rangeMatch[2])
    const unit = rangeMatch[3]?.toLowerCase()

    if (unit === 'w') {
      return { max, min, units: 'watts', value: min }
    }
    if (unit === 'rpm') {
      return { max, min, units: 'cadence_rpm', value: min }
    }
    if (unit === '%' || text.includes('%')) {
      return { max, min, units: getPercentUnits(text), value: min }
    }
  }

  const zoneMatch = /\b(Z[1-7]|SS)\b/i.exec(text)
  if (zoneMatch) {
    return { units: 'power_zone', value: zoneMatch[1].toUpperCase() }
  }

  const percentMatch = /(\d+(?:\.\d+)?)\s*%/.exec(text)
  if (percentMatch) {
    return { units: getPercentUnits(text), value: Number(percentMatch[1]) }
  }

  const wattsMatch = /(\d+(?:\.\d+)?)\s*w\b/i.exec(text)
  if (wattsMatch) {
    return { units: 'watts', value: Number(wattsMatch[1]) }
  }

  const cadenceMatch = /(\d+(?:\.\d+)?)\s*rpm\b/i.exec(text)
  if (cadenceMatch) {
    return { units: 'cadence_rpm', value: Number(cadenceMatch[1]) }
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
  if (/^ramp\b/i.test(content)) {
    isRamp = true
    content = content.replace(/^ramp\b/i, '').trim()
  }

  const [durationToken] = content.split(/\s+/)
  const durationSeconds = durationToken ? parseDurationToken(durationToken) : null
  let remainder = durationToken ? content.slice(durationToken.length).trim() : content

  if (/^ramp\b/i.test(remainder)) {
    isRamp = true
    remainder = remainder.replace(/^ramp\b/i, '').trim()
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
  const lines = text.split(/\r?\n/)
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
