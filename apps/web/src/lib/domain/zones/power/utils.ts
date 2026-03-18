import type { PowerZone, PowerZoneModel, PowerZonesData } from './schemas'

import { POWER_ZONE_PRESETS } from './presets'

type CalculatePowerZonesParams = {
  ftp: number
  model: Exclude<PowerZoneModel, 'custom'>
}
export const calculatePowerZones = ({ ftp, model }: CalculatePowerZonesParams): PowerZonesData => {
  const preset = POWER_ZONE_PRESETS[model]
  const zones: PowerZone[] = preset.map((zone) => ({
    color: zone.color,
    maxPercent: zone.maxPercent,
    maxWatts: zone.maxPercent ? Math.round((zone.maxPercent / 100) * ftp) : null,
    minPercent: zone.minPercent,
    minWatts: Math.round((zone.minPercent / 100) * ftp),
    name: zone.name
  }))

  return { model, zones }
}

type RecalculatePowerZonesParams = {
  ftp: number
  zones: PowerZonesData
}
export const recalculatePowerZones = ({
  ftp,
  zones
}: RecalculatePowerZonesParams): PowerZonesData => ({
  model: zones.model,
  zones: zones.zones.map((zone) => ({
    ...zone,
    maxWatts: zone.maxPercent ? Math.round((zone.maxPercent / 100) * ftp) : null,
    minWatts: Math.round((zone.minPercent / 100) * ftp)
  }))
})

export const formatPowerRange = (zone: PowerZone): string => {
  if (zone.maxWatts === null) {
    return `${zone.minWatts}w+`
  }

  return `${zone.minWatts}-${zone.maxWatts}w`
}

