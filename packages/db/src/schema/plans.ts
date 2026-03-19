import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core'

import { athletes } from './athletes'
import { products } from './catalog'
import { workouts } from './workouts'

export const nutritionPlans = pgTable('nutrition_plans', {
  athleteId: uuid('athlete_id').notNull().references(() => athletes.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  date: date('date').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  id: uuid('id').defaultRandom().primaryKey(),
  isActive: boolean('is_active').default(true).notNull(),
  name: text('name').notNull(),
  notes: text('notes'),
  targetCarbsPerHour: integer('target_carbs_per_hour'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  workoutId: uuid('workout_id').references(() => workouts.id, { onDelete: 'set null' }),
  workoutSnapshot: jsonb('workout_snapshot')
}, (table) => [
  index('nutrition_plans_athlete_idx').on(table.athleteId),
  index('nutrition_plans_date_idx').on(table.date),
  index('nutrition_plans_is_active_idx').on(table.isActive),
  index('nutrition_plans_workout_idx').on(table.workoutId)
])

export const planGroups = pgTable('plan_groups', {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  endOffsetMinutes: integer('end_offset_minutes'),
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  notes: text('notes'),
  planId: uuid('plan_id').notNull().references(() => nutritionPlans.id, { onDelete: 'cascade' }),
  sortOrder: integer('sort_order').default(0).notNull(),
  startOffsetMinutes: integer('start_offset_minutes').default(0).notNull(),
  targetCaffeineMgPerHr: integer('target_caffeine_mg_per_hr'),
  targetCarbsGPerHr: integer('target_carbs_g_per_hr'),
  targetSodiumMgPerHr: integer('target_sodium_mg_per_hr'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  index('plan_groups_plan_idx').on(table.planId),
  index('plan_groups_sort_idx').on(table.planId, table.sortOrder)
])

export const planItems = pgTable('plan_items', {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  groupId: uuid('group_id').references(() => planGroups.id, { onDelete: 'set null' }),
  id: uuid('id').defaultRandom().primaryKey(),
  notes: text('notes'),
  planId: uuid('plan_id').notNull().references(() => nutritionPlans.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'restrict' }),
  servings: numeric('servings', { mode: 'number', precision: 4, scale: 2 }).default(1).notNull(),
  timingMinutes: integer('timing_minutes').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  index('plan_items_plan_idx').on(table.planId),
  index('plan_items_product_idx').on(table.productId),
  index('plan_items_timing_idx').on(table.timingMinutes),
  index('plan_items_group_idx').on(table.groupId)
])
