import { describe, expect, it } from 'vitest'

import { parseWorkoutText } from './parser'

describe('parseWorkoutText', () => {
  it('parses intervals.icu style groups', () => {
    const text = '- 2h Z2\n\n4x\n- 10m Z4\n- 5m Z1\n\n- 2h Z2'
    const result = parseWorkoutText(text)

    expect(result.duration_seconds).toBe(18000)
    expect(result.steps).toHaveLength(3)
    expect(result.steps[0]?.target?.units).toBe('power_zone')
    expect(result.steps[0]?.target?.value).toBe('Z2')

    const group = result.steps[1]
    expect(group?.reps).toBe(4)
    expect(group?.steps).toHaveLength(2)
    expect(group?.steps?.[0]?.target?.value).toBe('Z4')
  })

  it('parses ramps and ranges', () => {
    const text = '- 5m Ramp 100-200w'
    const result = parseWorkoutText(text)
    const step = result.steps[0]

    expect(step?.duration_seconds).toBe(300)
    expect(step?.is_ramp).toBe(true)
    expect(step?.target?.units).toBe('watts')
    expect(step?.target?.min).toBe(100)
    expect(step?.target?.max).toBe(200)
  })

  it('parses percent targets with HR units', () => {
    const text = '- 10m 80% HR'
    const result = parseWorkoutText(text)
    const step = result.steps[0]

    expect(step?.target?.units).toBe('percent_hr')
    expect(step?.target?.value).toBe(80)
  })
})
