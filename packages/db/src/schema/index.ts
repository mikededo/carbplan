import * as athletesSchema from './athletes'
import * as authSchema from './auth'
import * as catalogSchema from './catalog'
import * as plansSchema from './plans'
import * as workoutsSchema from './workouts'

export * from './athletes'
export * from './auth'
export * from './catalog'
export * from './plans'
export * from './relations'
export * from './workouts'

export const schema = {
  ...authSchema,
  ...athletesSchema,
  ...catalogSchema,
  ...workoutsSchema,
  ...plansSchema
}
