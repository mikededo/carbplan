import type { PowerZone } from './schemas'

import { describe, expect, it } from 'vitest'

import { calculatePowerZones, formatPowerRange, recalculatePowerZones } from './utils'

const createPowerZone = (overrides?: Partial<PowerZone>): PowerZone => ({
  color: '#22c55e',
  maxPercent: 75,
  maxWatts: 210,
  minPercent: 55,
  minWatts: 154,
  name: 'Endurance',
  ...overrides
})

describe('calculatePowerZones', () => {
  describe('coggan model', () => {
    it('calculates 7 zones for FTP 280', () => {
      const result = calculatePowerZones({ ftp: 280, model: 'coggan' })

      expect(result.model).toBe('coggan')
      expect(result.zones).toHaveLength(7)
    })

    it('calculates correct watts for each zone', () => {
      const result = calculatePowerZones({ ftp: 280, model: 'coggan' })

      expect(result.zones[0].minWatts).toBe(0)
      expect(result.zones[0].maxWatts).toBe(154) // 280 * 0.55
      expect(result.zones[1].minWatts).toBe(154) // 280 * 0.55
      expect(result.zones[1].maxWatts).toBe(210) // 280 * 0.75
      expect(result.zones[3].minWatts).toBe(252) // 280 * 0.90
      expect(result.zones[3].maxWatts).toBe(294) // 280 * 1.05
      expect(result.zones[6].minWatts).toBe(420) // 280 * 1.50
      expect(result.zones[6].maxWatts).toBeNull()
    })

    it('preserves zone names and colors', () => {
      const result = calculatePowerZones({ ftp: 280, model: 'coggan' })

      expect(result.zones[0].name).toBe('Active Recovery')
      expect(result.zones[0].color).toBe('#94a3b8')
      expect(result.zones[3].name).toBe('Threshold')
      expect(result.zones[6].name).toBe('Neuromuscular')
    })
  })

  describe('polarized model', () => {
    it('calculates 3 zones', () => {
      const result = calculatePowerZones({ ftp: 300, model: 'polarized' })

      expect(result.model).toBe('polarized')
      expect(result.zones).toHaveLength(3)
    })

    it('calculates correct watts', () => {
      const result = calculatePowerZones({ ftp: 300, model: 'polarized' })

      expect(result.zones[0].minWatts).toBe(0)
      expect(result.zones[0].maxWatts).toBe(240)
      expect(result.zones[1].minWatts).toBe(240)
      expect(result.zones[1].maxWatts).toBe(300)
      expect(result.zones[2].minWatts).toBe(300)
      expect(result.zones[2].maxWatts).toBeNull()
    })
  })

  describe('sweet-spot model', () => {
    it('calculates 5 zones', () => {
      const result = calculatePowerZones({ ftp: 250, model: 'sweet-spot' })

      expect(result.model).toBe('sweet-spot')
      expect(result.zones).toHaveLength(5)
    })

    it('includes sweet spot zone at 84-97%', () => {
      const result = calculatePowerZones({ ftp: 250, model: 'sweet-spot' })

      const sweetSpotZone = result.zones.find((z) => z.name === 'Sweet Spot')
      expect(sweetSpotZone).toBeDefined()
      expect(sweetSpotZone?.minPercent).toBe(84)
      expect(sweetSpotZone?.maxPercent).toBe(97)
      expect(sweetSpotZone?.minWatts).toBe(210) // 250 * 0.84
      expect(sweetSpotZone?.maxWatts).toBe(243) // 250 * 0.97 = 242.5 rounded
    })
  })

  it('rounds watts to integers', () => {
    const result = calculatePowerZones({ ftp: 275, model: 'coggan' })

    // 275 * 0.55 = 151.25 -> 151
    expect(result.zones[0].maxWatts).toBe(151)
    // 275 * 0.75 = 206.25 -> 206
    expect(result.zones[1].maxWatts).toBe(206)
  })
})

describe('recalculatePowerZones', () => {
  it('updates watts when FTP changes', () => {
    const original = calculatePowerZones({ ftp: 280, model: 'coggan' })
    const recalculated = recalculatePowerZones({ ftp: 300, zones: original })

    expect(recalculated.model).toBe('coggan')
    expect(recalculated.zones).toHaveLength(7)
    expect(recalculated.zones[0].minWatts).toBe(0)
    expect(recalculated.zones[0].maxWatts).toBe(165) // 300 * 0.55
    expect(recalculated.zones[1].minWatts).toBe(165)
    expect(recalculated.zones[1].maxWatts).toBe(225) // 300 * 0.75
  })

  it('preserves percentages and metadata', () => {
    const original = calculatePowerZones({ ftp: 280, model: 'coggan' })
    const recalculated = recalculatePowerZones({ ftp: 300, zones: original })

    expect(recalculated.zones[0].minPercent).toBe(0)
    expect(recalculated.zones[0].maxPercent).toBe(55)
    expect(recalculated.zones[0].name).toBe('Active Recovery')
    expect(recalculated.zones[0].color).toBe('#94a3b8')
  })

  it('handles top zone with null maxWatts', () => {
    const original = calculatePowerZones({ ftp: 280, model: 'coggan' })
    const recalculated = recalculatePowerZones({ ftp: 300, zones: original })

    const topZone = recalculated.zones[6]
    expect(topZone.maxWatts).toBeNull()
    expect(topZone.minWatts).toBe(450) // 300 * 1.50
  })
})

describe('formatPowerRange', () => {
  it('formats a zone with both min and max watts', () => {
    expect(formatPowerRange(createPowerZone())).toBe('154-210w')
  })

  it('formats a zone with null maxWatts as open-ended', () => {
    const zone = createPowerZone({ maxWatts: null, minWatts: 420 })
    expect(formatPowerRange(zone)).toBe('420w+')
  })

  it('handles zero minWatts', () => {
    const zone = createPowerZone({ maxWatts: 154, minWatts: 0 })
    expect(formatPowerRange(zone)).toBe('0-154w')
  })
})
