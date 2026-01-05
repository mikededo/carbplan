import type { HRZone, HRZoneModel, HRZonesData } from './schemas'

import { HR_ZONE_PRESETS } from './presets'

type CalculateHRZonesParams = {
  hrMax: number
  model: Exclude<HRZoneModel, 'custom'>
  hrRest?: number
}
export const calculateHRZones = ({
  hrMax,
  hrRest,
  model
}: CalculateHRZonesParams): HRZonesData => {
  const preset = HR_ZONE_PRESETS[model]
  const useKarvonen = model === 'karvonen' && hrRest !== undefined

  const zones: HRZone[] = preset.map((zone) => {
    let minBpm: number
    let maxBpm: null | number

    if (useKarvonen) {
      // Karvonen formula: Target HR = ((HRmax - HRrest) × %intensity) + HRrest
      const hrReserve = hrMax - hrRest
      minBpm = Math.round((hrReserve * zone.minPercent / 100) + hrRest)
      maxBpm = zone.maxPercent
        ? Math.round((hrReserve * zone.maxPercent / 100) + hrRest)
        : null
    } else {
      // Simple % of HRmax
      minBpm = Math.round((zone.minPercent / 100) * hrMax)
      maxBpm = zone.maxPercent ? Math.round((zone.maxPercent / 100) * hrMax) : null
    }

    return {
      color: zone.color,
      maxBpm,
      maxPercent: zone.maxPercent,
      minBpm,
      minPercent: zone.minPercent,
      name: zone.name
    }
  })

  return { model, zones }
}

type RecalculateHRZonesParams = {
  hrMax: number
  zones: HRZonesData
  hrRest?: number
}
export const recalculateHRZones = ({
  hrMax,
  hrRest,
  zones
}: RecalculateHRZonesParams): HRZonesData => {
  const useKarvonen = zones.model === 'karvonen' && hrRest !== undefined

  return {
    model: zones.model,
    zones: zones.zones.map((zone) => {
      let minBpm: number
      let maxBpm: null | number

      if (useKarvonen) {
        const hrReserve = hrMax - hrRest
        minBpm = Math.round((hrReserve * zone.minPercent / 100) + hrRest)
        maxBpm = zone.maxPercent
          ? Math.round((hrReserve * zone.maxPercent / 100) + hrRest)
          : null
      } else {
        minBpm = Math.round((zone.minPercent / 100) * hrMax)
        maxBpm = zone.maxPercent ? Math.round((zone.maxPercent / 100) * hrMax) : null
      }

      return { ...zone, maxBpm, minBpm }
    })
  }
}

export const formatHRRange = (zone: HRZone): string => {
  if (zone.maxBpm === null) {
    return `${zone.minBpm}+ bpm`
  }

  return `${zone.minBpm}-${zone.maxBpm} bpm`
}

