import * as z from 'zod'

type WithDefaultsOptional<T extends z.ZodRawShape> = {
  [K in keyof T]: T[K] extends z.ZodDefault<infer _> ? z.ZodOptional<T[K]> : T[K]
}

export const atLeastOneProperty = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  message = 'At least one field must be defined'
) => {
  const newShape = Object.fromEntries(
    Object.entries(schema.shape as T).map(([k, v]) => [
      k,
      v instanceof z.ZodDefault ? v.optional() : v
    ])
  ) as WithDefaultsOptional<T>

  return z.object(newShape).refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    message
  )
}
