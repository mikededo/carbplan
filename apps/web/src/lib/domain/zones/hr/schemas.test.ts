import type { HRZone } from './schemas'

import { describe, expect, it } from 'vitest'

import { HRZoneModelEnum, HRZoneModelSchema, HRZoneSchema, HRZonesDataSchema, parseHRZones } from './schemas'

const createHRZone = (overrides?: Partial<HRZone>): HRZone => ({
  color: '#22c55e',
  maxBpm: 130,
  maxPercent: 70,
  minBpm: 111,
  minPercent: 60,
  name: 'Zone 2 - Endurance',
  ...overrides
})

describe('hRZoneModelSchema', () => {
  it('accepts valid HR zone models', () => {
    expect(HRZoneModelSchema.safeParse(HRZoneModelEnum['5-zone']).success).toBe(true)
    expect(HRZoneModelSchema.safeParse(HRZoneModelEnum.karvonen).success).toBe(true)
    expect(HRZoneModelSchema.safeParse(HRZoneModelEnum.custom).success).toBe(true)
  })

  it('rejects invalid HR zone models', () => {
    expect(HRZoneModelSchema.safeParse('invalid').success).toBe(false)
    expect(HRZoneModelSchema.safeParse('coggan').success).toBe(false)
    expect(HRZoneModelSchema.safeParse('').success).toBe(false)
  })
})

describe('hRZoneSchema', () => {
  it('accepts a valid HR zone', () => {
    expect(HRZoneSchema.safeParse(createHRZone()).success).toBe(true)
  })

  it('accepts null for maxBpm and maxPercent (top zone)', () => {
    const zone = createHRZone({
      color: '#ef4444',
      maxBpm: null,
      maxPercent: 100,
      minBpm: 167,
      minPercent: 90,
      name: 'Zone 5 - VO2max'
    })
    expect(HRZoneSchema.safeParse(zone).success).toBe(true)
  })

  it('rejects minPercent over 100', () => {
    const zone = createHRZone({ minPercent: 110 })
    expect(HRZoneSchema.safeParse(zone).success).toBe(false)
  })

  it('rejects maxPercent over 100', () => {
    const zone = createHRZone({ maxPercent: 110 })
    expect(HRZoneSchema.safeParse(zone).success).toBe(false)
  })

  it('rejects negative minBpm', () => {
    const zone = createHRZone({ minBpm: -10 })
    expect(HRZoneSchema.safeParse(zone).success).toBe(false)
  })
})

describe('hRZonesDataSchema', () => {
  it('accepts valid HR zones data', () => {
    const data = {
      model: HRZoneModelEnum['5-zone'],
      zones: [
        createHRZone({ maxBpm: 111, maxPercent: 60, minBpm: 93, minPercent: 50, name: 'Zone 1' }),
        createHRZone({ name: 'Zone 2' })
      ]
    }
    expect(HRZonesDataSchema.safeParse(data).success).toBe(true)
  })

  it('accepts empty zones array', () => {
    const data = { model: HRZoneModelEnum.custom, zones: [] }
    expect(HRZonesDataSchema.safeParse(data).success).toBe(true)
  })

  it('rejects invalid model', () => {
    const data = { model: 'coggan', zones: [] }
    expect(HRZonesDataSchema.safeParse(data).success).toBe(false)
  })
})

describe('parseHRZones', () => {
  it('returns success for valid data', () => {
    const data = {
      model: HRZoneModelEnum.karvonen,
      zones: [createHRZone({ maxBpm: 118, minBpm: 105, minPercent: 50, name: 'Recovery' })]
    }
    const result = parseHRZones(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.model).toBe(HRZoneModelEnum.karvonen)
      expect(result.data.zones).toHaveLength(1)
    }
  })

  it('returns failure for invalid data', () => {
    const result = parseHRZones({ model: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('returns failure for non-object input', () => {
    expect(parseHRZones(null).success).toBe(false)
    expect(parseHRZones(undefined).success).toBe(false)
    expect(parseHRZones([]).success).toBe(false)
  })
})
