import * as z from 'zod'

import { createPaginationSuccessSchema, PaginationApiMeta } from '../api'
import { createSortSchema, OffsetPaginationQuerySchema } from './pagination'

const DateOnlySchema = z.iso.date()
export const NutritionPlansSortFields = ['date'] as const
export type NutritionPlansSortField = (typeof NutritionPlansSortFields)[number]

export const NutritionPlansListQuerySchema = OffsetPaginationQuerySchema.extend({
  date: DateOnlySchema.optional(),
  dateGte: DateOnlySchema.optional(),
  dateLte: DateOnlySchema.optional(),
  sort: createSortSchema({
    defaultSort: 'date:desc',
    fields: NutritionPlansSortFields
  })
}).refine(
  (value) => value.dateGte === undefined || value.dateLte === undefined || value.dateGte <= value.dateLte,
  { error: 'dateGte must be less than or equal to dateLte' }
)
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
