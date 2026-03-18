import type { Client } from '$lib/database/types'
import type { Athlete } from '$lib/database/types.g'

export const isOnboardingComplete = async (supabase: Client, id: Athlete['id']) => {
  const { data: athlete } = await supabase
    .from('athletes')
    .select('full_name')
    .eq('id', id)
    .single()
  return !!athlete?.full_name
}
