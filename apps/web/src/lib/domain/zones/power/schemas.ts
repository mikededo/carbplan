import * as z from 'zod'

export const PowerZoneModelSchema = z.enum(['coggan', 'friel', 'polarized', 'sweet-spot', 'custom'])
export const PowerZoneModelEnum = PowerZoneModelSchema.enum
export type PowerZoneModel = z.infer<typeof PowerZoneModelSchema>

export const PowerZoneSchema = z.object({
  color: z.string().trim(),
  maxPercent: z.number().min(0).nullable(),
  maxWatts: z.number().min(0).nullable(),
  minPercent: z.number().min(0),
  minWatts: z.number().min(0),
  name: z.string().trim()
})
export type PowerZone = z.infer<typeof PowerZoneSchema>

export const PowerZonesDataSchema = z.object({
  model: PowerZoneModelSchema,
  zones: z.array(PowerZoneSchema)
})
export type PowerZonesData = z.infer<typeof PowerZonesDataSchema>

export const isPowerPresetZoneModel = (value: unknown): value is PowerZoneModel =>
  PowerZoneModelSchema.safeParse(value).success
export const parsePowerZones = (data: unknown) => PowerZonesDataSchema.safeParse(data)

