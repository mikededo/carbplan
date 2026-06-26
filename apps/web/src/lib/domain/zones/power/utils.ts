import type { PowerZone, PowerZoneModel, PowerZonesData } from '@kilo/domain/power'

import { POWER_ZONE_PRESETS, PowerZoneModelSchema, PowerZonesDataSchema } from '@kilo/domain/power'

export const isPowerPresetZoneModel = (value: unknown): value is PowerZoneModel =>
  PowerZoneModelSchema.safeParse(value).success
export const parsePowerZones = (data: unknown) => PowerZonesDataSchema.safeParse(data)

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

