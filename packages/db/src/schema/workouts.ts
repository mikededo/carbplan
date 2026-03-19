import {
  bigint,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from 'drizzle-orm/pg-core'

import { athletes } from './athletes'

export const workoutSourceEnum = pgEnum('workout_source', ['manual', 'intervals_icu'])

export const workouts = pgTable('workouts', {
  athleteId: uuid('athlete_id').notNull().references(() => athletes.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  endDateLocal: timestamp('end_date_local', { withTimezone: true }),
  externalId: text('external_id'),
  id: uuid('id').defaultRandom().primaryKey(),
  joules: bigint('joules', { mode: 'number' }),
  movingTimeSeconds: integer('moving_time_seconds'),
  name: text('name').notNull(),
  parsedDoc: jsonb('parsed_doc'),
  rawPayload: jsonb('raw_payload'),
  rawText: text('raw_text'),
  source: workoutSourceEnum('source').default('manual').notNull(),
  startDateLocal: timestamp('start_date_local', { withTimezone: true }),
  tss: numeric('tss', { mode: 'number', precision: 7, scale: 2 }),
  type: text('type'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  index('workouts_athlete_idx').on(table.athleteId),
  index('workouts_start_date_idx').on(table.startDateLocal),
  uniqueIndex('workouts_source_external_idx').on(table.athleteId, table.source, table.externalId)
])
