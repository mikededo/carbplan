import type * as z from 'zod'

export const atLeastOneProperty = <T extends z.ZodObject>(
  schema: T,
  message = 'At least one field must be defined'
) => schema.refine((data: z.infer<T>) => Object.values(data).some((v) => v !== undefined), message)
