import type { PowerZone } from './schemas'

import * as v from 'valibot'
import { describe, expect, it } from 'vitest'

import { parsePowerZones, PowerZoneModelSchema, PowerZoneSchema, PowerZonesDataSchema } from './schemas'

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
    expect(v.safeParse(PowerZoneModelSchema, 'coggan').success).toBe(true)
    expect(v.safeParse(PowerZoneModelSchema, 'polarized').success).toBe(true)
    expect(v.safeParse(PowerZoneModelSchema, 'sweet-spot').success).toBe(true)
    expect(v.safeParse(PowerZoneModelSchema, 'custom').success).toBe(true)
  })

  it('rejects invalid power zone models', () => {
    expect(v.safeParse(PowerZoneModelSchema, 'invalid').success).toBe(false)
    expect(v.safeParse(PowerZoneModelSchema, '').success).toBe(false)
    expect(v.safeParse(PowerZoneModelSchema, 123).success).toBe(false)
  })
})

describe('powerZoneSchema', () => {
  it('accepts a valid power zone', () => {
    expect(v.safeParse(PowerZoneSchema, createPowerZone()).success).toBe(true)
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
    expect(v.safeParse(PowerZoneSchema, zone).success).toBe(true)
  })

  it('rejects negative minPercent', () => {
    const zone = createPowerZone({ minPercent: -5 })
    expect(v.safeParse(PowerZoneSchema, zone).success).toBe(false)
  })

  it('rejects negative minWatts', () => {
    const zone = createPowerZone({ minWatts: -10 })
    expect(v.safeParse(PowerZoneSchema, zone).success).toBe(false)
  })

  it('rejects missing required fields', () => {
    expect(v.safeParse(PowerZoneSchema, { name: 'Test' }).success).toBe(false)
    expect(v.safeParse(PowerZoneSchema, {}).success).toBe(false)
  })
})

describe('powerZonesDataSchema', () => {
  it('accepts valid power zones data', () => {
    const data = {
      model: 'coggan',
      zones: [
        createPowerZone({ maxPercent: 55, maxWatts: 154, minPercent: 0, minWatts: 0, name: 'Recovery' }),
        createPowerZone({ name: 'Endurance' })
      ]
    }
    expect(v.safeParse(PowerZonesDataSchema, data).success).toBe(true)
  })

  it('accepts empty zones array', () => {
    const data = { model: 'custom', zones: [] }
    expect(v.safeParse(PowerZonesDataSchema, data).success).toBe(true)
  })

  it('rejects invalid model', () => {
    const data = { model: 'invalid', zones: [] }
    expect(v.safeParse(PowerZonesDataSchema, data).success).toBe(false)
  })
})

describe('parsePowerZones', () => {
  it('returns success for valid data', () => {
    const data = {
      model: 'polarized',
      zones: [createPowerZone({ maxPercent: 80, maxWatts: 224, minPercent: 0, minWatts: 0, name: 'Low Intensity' })]
    }
    const result = parsePowerZones(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.output.model).toBe('polarized')
      expect(result.output.zones).toHaveLength(1)
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
