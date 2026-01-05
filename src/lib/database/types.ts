import type { QueryData, SupabaseClient } from '@supabase/supabase-js'

import type { HRZonesData } from '$lib/domain/zones/hr/schemas'
import type { PowerZonesData } from '$lib/domain/zones/power/schemas'

import type { Database } from './types.g.ts'

export type Client = SupabaseClient<Database>
export type Result<T extends (...args: any) => any> = QueryData<ReturnType<T>>

/** CurrentAthlete with parsed zone data */
export type ParsedCurrentAthlete = {
  hr_zones: HRZonesData | undefined
  power_zones: PowerZonesData | undefined
} & Omit<
  Database['public']['Views']['current_athlete']['Row'],
  'hr_zones' | 'power_zones'
>
