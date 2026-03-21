import { SEX_VALUES } from '@carbplan/domain/profile'
import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
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

import { users } from './auth'

export const sexEnum = pgEnum('sex', [...SEX_VALUES] as [string, ...string[]])

export const athletes = pgTable('athletes', {
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  email: text('email').notNull(),
  ftp: integer('ftp'),
  fullName: text('full_name'),
  heightCm: numeric('height_cm', { mode: 'number', precision: 5, scale: 1 }),
  hrMax: integer('hr_max'),
  hrRest: integer('hr_rest'),
  hrZones: jsonb('hr_zones'),
  id: uuid('id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  isAdmin: boolean('is_admin').default(false).notNull(),
  maxCarbIntakeGPerHr: integer('max_carb_intake_g_per_hr'),
  powerZones: jsonb('power_zones'),
  sex: sexEnum('sex'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  weightKg: numeric('weight_kg', { mode: 'number', precision: 5, scale: 2 })
}, (table) => [
  index('athletes_email_idx').on(table.email),
  index('athletes_is_admin_idx').on(table.isAdmin)
])
export type AthleteId = typeof athletes.$inferSelect.id

export const coachingRelationships = pgTable('coaching_relationships', {
  acceptedAt: timestamp('accepted_at', { withTimezone: true }),
  athleteId: uuid('athlete_id').notNull().references(() => athletes.id, { onDelete: 'cascade' }),
  coachId: uuid('coach_id').notNull().references(() => athletes.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  id: uuid('id').defaultRandom().primaryKey()
}, (table) => [
  uniqueIndex('coaching_relationships_coach_athlete_unique').on(table.coachId, table.athleteId),
  check('coaching_relationships_not_self', sql`${table.coachId} <> ${table.athleteId}`),
  index('coaching_relationships_coach_idx').on(table.coachId),
  index('coaching_relationships_athlete_idx').on(table.athleteId)
])
