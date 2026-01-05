import * as v from 'valibot'

export const HRZoneModelSchema = v.picklist(['5-zone', 'karvonen', 'custom'])
export type HRZoneModel = v.InferOutput<typeof HRZoneModelSchema>

export const HRZoneSchema = v.object({
  color: v.string(),
  maxBpm: v.nullable(v.pipe(v.number(), v.minValue(0))),
  maxPercent: v.nullable(v.pipe(v.number(), v.minValue(0), v.maxValue(100))),
  minBpm: v.pipe(v.number(), v.minValue(0)),
  minPercent: v.pipe(v.number(), v.minValue(0), v.maxValue(100)),
  name: v.string()
})
export type HRZone = v.InferOutput<typeof HRZoneSchema>

export const HRZonesDataSchema = v.object({
  model: HRZoneModelSchema,
  zones: v.array(HRZoneSchema)
})
export type HRZonesData = v.InferOutput<typeof HRZonesDataSchema>

export const isHRPresetZoneModel = (value: unknown): value is HRZoneModel => v.safeParse(HRZoneModelSchema, value).success
export const parseHRZones = (data: unknown) => v.safeParse(HRZonesDataSchema, data)

