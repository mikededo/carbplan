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
