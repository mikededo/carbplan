import * as z from 'zod'

import { createPaginationSuccessSchema, PaginationApiMeta } from '../api'
import { OffsetPaginationQuerySchema } from './pagination'

export const NutritionPlansListQuerySchema = OffsetPaginationQuerySchema
export const NutritionPlansListResultSchema = createPaginationSuccessSchema(
  z.array(
    z.object({
      athleteId: z.uuid(),
      createdAt: z.date(),
      date: z.date(),
      durationMinutes: z.number().nullable(),
      id: z.uuid(),
      isActive: z.boolean(),
      name: z.string().trim(),
      notes: z.string().trim().nullable(),
      nutrition: z.object({
        itemCount: z.number().min(0).default(0),
        totalCaffeineMg: z.number().min(0).default(0),
        totalCarbsG: z.number().min(0).default(0)
      }),
      targetCarbsPerHour: z.number().nullable(),
      updatedAt: z.date(),
      workoutId: z.uuid().nullable(),
      workoutSnapshot: z.unknown().nullable()
    })
  ),
  PaginationApiMeta
)
