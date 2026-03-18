import type { PowerZone } from './schemas'

import { describe, expect, it } from 'vitest'

import { parsePowerZones, PowerZoneModelEnum, PowerZoneModelSchema, PowerZoneSchema, PowerZonesDataSchema } from './schemas'

const createPowerZone = (overrides?: Partial<PowerZone>): PowerZone => ({
  color: '#22c55e',
  maxPercent: 75,
  maxWatts: 210,
  minPercent: 55,
  minWatts: 154,
  name: 'Endurance',
  ...overrides
})

describe('powerZoneModelSchema', () => {
  it('accepts valid power zone models', () => {
    expect(PowerZoneModelSchema.safeParse(PowerZoneModelEnum.coggan).success).toBe(true)
    expect(PowerZoneModelSchema.safeParse(PowerZoneModelEnum.polarized).success).toBe(true)
    expect(PowerZoneModelSchema.safeParse(PowerZoneModelEnum['sweet-spot']).success).toBe(true)
    expect(PowerZoneModelSchema.safeParse(PowerZoneModelEnum.custom).success).toBe(true)
  })

  it('rejects invalid power zone models', () => {
    expect(PowerZoneModelSchema.safeParse('invalid').success).toBe(false)
    expect(PowerZoneModelSchema.safeParse('').success).toBe(false)
    expect(PowerZoneModelSchema.safeParse(123).success).toBe(false)
  })
})

describe('powerZoneSchema', () => {
  it('accepts a valid power zone', () => {
    expect(PowerZoneSchema.safeParse(createPowerZone()).success).toBe(true)
  })

  it('accepts null for maxPercent and maxWatts (top zone)', () => {
    const zone = createPowerZone({
      color: '#7c2d12',
      maxPercent: null,
      maxWatts: null,
      minPercent: 150,
      minWatts: 420,
      name: 'Neuromuscular'
    })
    expect(PowerZoneSchema.safeParse(zone).success).toBe(true)
  })

  it('rejects negative minPercent', () => {
    const zone = createPowerZone({ minPercent: -5 })
    expect(PowerZoneSchema.safeParse(zone).success).toBe(false)
  })

  it('rejects negative minWatts', () => {
    const zone = createPowerZone({ minWatts: -10 })
    expect(PowerZoneSchema.safeParse(zone).success).toBe(false)
  })

  it('rejects missing required fields', () => {
    expect(PowerZoneSchema.safeParse({ name: 'Test' }).success).toBe(false)
    expect(PowerZoneSchema.safeParse({}).success).toBe(false)
  })
})

describe('powerZonesDataSchema', () => {
  it('accepts valid power zones data', () => {
    const data = {
      model: PowerZoneModelEnum.coggan,
      zones: [
        createPowerZone({ maxPercent: 55, maxWatts: 154, minPercent: 0, minWatts: 0, name: 'Recovery' }),
        createPowerZone({ name: 'Endurance' })
      ]
    }
    expect(PowerZonesDataSchema.safeParse(data).success).toBe(true)
  })

  it('accepts empty zones array', () => {
    const data = { model: PowerZoneModelEnum.custom, zones: [] }
    expect(PowerZonesDataSchema.safeParse(data).success).toBe(true)
  })

  it('rejects invalid model', () => {
    const data = { model: 'invalid', zones: [] }
    expect(PowerZonesDataSchema.safeParse(data).success).toBe(false)
  })
})

describe('parsePowerZones', () => {
  it('returns success for valid data', () => {
    const data = {
      model: PowerZoneModelEnum.polarized,
      zones: [createPowerZone({ maxPercent: 80, maxWatts: 224, minPercent: 0, minWatts: 0, name: 'Low Intensity' })]
    }
    const result = parsePowerZones(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.model).toBe(PowerZoneModelEnum.polarized)
      expect(result.data.zones).toHaveLength(1)
    }
  })

  it('returns failure for invalid data', () => {
    const result = parsePowerZones({ model: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('returns failure for non-object input', () => {
    expect(parsePowerZones(null).success).toBe(false)
    expect(parsePowerZones('string').success).toBe(false)
    expect(parsePowerZones(123).success).toBe(false)
  })
})
