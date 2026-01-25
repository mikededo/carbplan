export type NutritionPlan = {
  date: string
  durationMinutes: number
  id: string
  name: string
  targetCarbsPerHour: number
}

export type ScheduledEvent = {
  durationMinutes: number
  id: string
  name: string
  targetCarbsPerHour: number
  time: string
}
