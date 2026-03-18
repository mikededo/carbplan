import type { HRZone } from './schemas'

import { describe, expect, it } from 'vitest'

import { calculateHRZones, formatHRRange, recalculateHRZones } from './utils'

const createHRZone = (overrides?: Partial<HRZone>): HRZone => ({
  color: '#22c55e',
  maxBpm: 130,
  maxPercent: 70,
  minBpm: 111,
  minPercent: 60,
  name: 'Zone 2 - Endurance',
  ...overrides
})

describe('calculateHRZones', () => {
  describe('5-zone model (% of HRmax)', () => {
    it('calculates 5 zones for HRmax 185', () => {
      const result = calculateHRZones({ hrMax: 185, model: '5-zone' })

      expect(result.model).toBe('5-zone')
      expect(result.zones).toHaveLength(5)
    })

    it('calculates correct BPM values', () => {
      const result = calculateHRZones({ hrMax: 185, model: '5-zone' })

      expect(result.zones[0].minBpm).toBe(93) // 185 * 0.50 = 92.5 -> 93
      expect(result.zones[0].maxBpm).toBe(111) // 185 * 0.60
      expect(result.zones[1].minBpm).toBe(111)
      expect(result.zones[1].maxBpm).toBe(130) // 185 * 0.70 = 129.5 -> 130
      expect(result.zones[4].minBpm).toBe(167) // 185 * 0.90 = 166.5 -> 167
      expect(result.zones[4].maxBpm).toBe(185)
    })

    it('preserves zone names and colors', () => {
      const result = calculateHRZones({ hrMax: 185, model: '5-zone' })

      expect(result.zones[0].name).toBe('Zone 1 - Recovery')
      expect(result.zones[0].color).toBe('#94a3b8')
      expect(result.zones[4].name).toBe('Zone 5 - VO2max')
    })

    it('ignores hrRest when using 5-zone model', () => {
      const withRest = calculateHRZones({ hrMax: 185, hrRest: 50, model: '5-zone' })
      const withoutRest = calculateHRZones({ hrMax: 185, model: '5-zone' })

      expect(withRest.zones[0].minBpm).toBe(withoutRest.zones[0].minBpm)
      expect(withRest.zones[0].maxBpm).toBe(withoutRest.zones[0].maxBpm)
    })
  })

  describe('karvonen model (HR Reserve)', () => {
    it('calculates 5 zones using Karvonen formula', () => {
      const result = calculateHRZones({ hrMax: 185, hrRest: 50, model: 'karvonen' })

      expect(result.model).toBe('karvonen')
      expect(result.zones).toHaveLength(5)
    })

    it('calculates correct BPM using HR reserve', () => {
      // HRmax = 185, HRrest = 50, HR Reserve = 135
      // Karvonen: Target HR = (HRreserve × %intensity) + HRrest
      const result = calculateHRZones({ hrMax: 185, hrRest: 50, model: 'karvonen' })

      // Min: (135 * 0.50) + 50 = 117.5 -> 118
      // Max: (135 * 0.60) + 50 = 131
      expect(result.zones[0].minBpm).toBe(118)
      expect(result.zones[0].maxBpm).toBe(131)

      // Min: (135 * 0.90) + 50 = 171.5 -> 172
      // Max: (135 * 1.00) + 50 = 185
      expect(result.zones[4].minBpm).toBe(172)
      expect(result.zones[4].maxBpm).toBe(185)
    })

    it('falls back to % HRmax when hrRest is not provided', () => {
      const result = calculateHRZones({ hrMax: 185, model: 'karvonen' })
      expect(result.zones[0].minBpm).toBe(93) // 185 * 0.50
      expect(result.zones[0].maxBpm).toBe(111) // 185 * 0.60
    })

    it('has different zone names than 5-zone', () => {
      const result = calculateHRZones({ hrMax: 185, hrRest: 50, model: 'karvonen' })

      expect(result.zones[0].name).toBe('Recovery')
      expect(result.zones[1].name).toBe('Aerobic')
      expect(result.zones[3].name).toBe('Lactate Threshold')
    })
  })

  it('rounds BPM to integers', () => {
    const result = calculateHRZones({ hrMax: 183, model: '5-zone' })
    expect(result.zones[0].minBpm).toBe(92)
  })
})

describe('recalculateHRZones', () => {
  it('updates BPM when HRmax changes (5-zone)', () => {
    const original = calculateHRZones({ hrMax: 185, model: '5-zone' })
    const recalculated = recalculateHRZones({ hrMax: 190, zones: original })

    expect(recalculated.model).toBe('5-zone')
    expect(recalculated.zones[0].minBpm).toBe(95) // 190 * 0.50
    expect(recalculated.zones[0].maxBpm).toBe(114) // 190 * 0.60
  })

  it('updates BPM when HRmax/HRrest change (karvonen)', () => {
    const original = calculateHRZones({ hrMax: 185, hrRest: 50, model: 'karvonen' })
    const recalculated = recalculateHRZones({ hrMax: 190, hrRest: 45, zones: original })

    // New HR Reserve = 190 - 45 = 145
    expect(recalculated.zones[0].minBpm).toBe(118)
    // (145 * 0.60) + 45 = 132
    expect(recalculated.zones[0].maxBpm).toBe(132)
  })

  it('preserves percentages and metadata', () => {
    const original = calculateHRZones({ hrMax: 185, model: '5-zone' })
    const recalculated = recalculateHRZones({ hrMax: 190, zones: original })

    expect(recalculated.zones[0].minPercent).toBe(50)
    expect(recalculated.zones[0].maxPercent).toBe(60)
    expect(recalculated.zones[0].name).toBe('Zone 1 - Recovery')
    expect(recalculated.zones[0].color).toBe('#94a3b8')
  })

  it('falls back to % HRmax when hrRest not provided for karvonen', () => {
    const original = calculateHRZones({ hrMax: 185, hrRest: 50, model: 'karvonen' })
    const recalculated = recalculateHRZones({ hrMax: 190, zones: original })

    expect(recalculated.zones[0].minBpm).toBe(95) // 190 * 0.50
    expect(recalculated.zones[0].maxBpm).toBe(114) // 190 * 0.60
  })
})

describe('formatHRRange', () => {
  it('formats a zone with both min and max BPM', () => {
    expect(formatHRRange(createHRZone())).toBe('111-130 bpm')
  })

  it('formats a zone with null maxBpm as open-ended', () => {
    const zone = createHRZone({ maxBpm: null, minBpm: 167 })
    expect(formatHRRange(zone)).toBe('167+ bpm')
  })

  it('handles low BPM values', () => {
    const zone = createHRZone({ maxBpm: 100, minBpm: 80 })
    expect(formatHRRange(zone)).toBe('80-100 bpm')
  })
})
