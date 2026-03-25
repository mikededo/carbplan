import { z } from 'zod'

export const createFilterArraySchema = <T extends z.ZodType>(
  itemSchema: T
) => z.union([itemSchema.transform((item) => [item]), z.array(itemSchema).min(2)])

export const StringFilterArraySchema = createFilterArraySchema(z.string().trim())

