import * as z from 'zod'

export const HRZoneModelSchema = z.enum(['5-zone', 'friel', 'karvonen', 'custom'])
export const HRZoneModelEnum = HRZoneModelSchema.enum
export type HRZoneModel = z.infer<typeof HRZoneModelSchema>

export const HRZoneSchema = z.object({
  color: z.string().trim(),
  maxBpm: z.number().min(0).nullable(),
  maxPercent: z.number().min(0).max(100).nullable(),
  minBpm: z.number().min(0),
  minPercent: z.number().min(0).max(100),
  name: z.string().trim()
})
export type HRZone = z.infer<typeof HRZoneSchema>

export const HRZonesDataSchema = z.object({
  model: HRZoneModelSchema,
  zones: z.array(HRZoneSchema)
})
export type HRZonesData = z.infer<typeof HRZonesDataSchema>

export const isHRPresetZoneModel = (value: unknown): value is HRZoneModel => HRZoneModelSchema.safeParse(value).success
export const parseHRZones = (data: unknown) => HRZonesDataSchema.safeParse(data)

