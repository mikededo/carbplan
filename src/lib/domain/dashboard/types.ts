/**
 * Dashboard domain types.
 * Note: These types anticipate the plans feature. Once the plans table is created,
 * these should be updated to match the database schema.
 */

export type NutritionPlan = {
  date: string
  id: string
  name: string
  durationMinutes: number
  targetCarbsPerHour: number
}

export type ScheduledEvent = {
  id: string
  name: string
  time: string
  durationMinutes: number
  targetCarbsPerHour: number
}
