import type { QueryData, SupabaseClient } from '@supabase/supabase-js'

// TODO: Generate types
// import type { Database } from './types.g.ts'

type Database = any

export type Client = SupabaseClient<Database>
export type Result<T extends (...args: any) => any> = QueryData<ReturnType<T>>

// Set of types that are here to simplify usage across the code
type DatabaseEnums = Database['public']['Enums']
export type PatternDifficulty = DatabaseEnums['difficulty_level']
export type YarnWeight = DatabaseEnums['yarn_weight']
