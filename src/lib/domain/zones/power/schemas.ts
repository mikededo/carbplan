import * as v from 'valibot'

export const PowerZoneModelSchema = v.picklist(['coggan', 'friel', 'polarized', 'sweet-spot', 'custom'])
export type PowerZoneModel = v.InferOutput<typeof PowerZoneModelSchema>

export const PowerZoneSchema = v.object({
  color: v.string(),
  maxPercent: v.nullable(v.pipe(v.number(), v.minValue(0))),
  maxWatts: v.nullable(v.pipe(v.number(), v.minValue(0))),
  minPercent: v.pipe(v.number(), v.minValue(0)),
  minWatts: v.pipe(v.number(), v.minValue(0)),
  name: v.string()
})
export type PowerZone = v.InferOutput<typeof PowerZoneSchema>

export const PowerZonesDataSchema = v.object({
  model: PowerZoneModelSchema,
  zones: v.array(PowerZoneSchema)
})
export type PowerZonesData = v.InferOutput<typeof PowerZonesDataSchema>

export const isPowerPresetZoneModel = (value: unknown): value is PowerZoneModel =>
  v.safeParse(PowerZoneModelSchema, value).success
export const parsePowerZones = (data: unknown) => v.safeParse(PowerZonesDataSchema, data)

