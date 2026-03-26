import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgView,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core'

import { sexEnum } from './athletes'
import { productFormEnum } from './catalog'

export const currentAthlete = pgView('current_athlete', {
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }),
  email: text('email'),
  ftp: integer('ftp'),
  fullName: text('full_name'),
  heightCm: numeric('height_cm', { mode: 'number', precision: 5, scale: 1 }),
  hrMax: integer('hr_max'),
  hrRest: integer('hr_rest'),
  hrZones: jsonb('hr_zones'),
  id: uuid('id'),
  maxCarbIntakeGPerHr: integer('max_carb_intake_g_per_hr'),
  powerZones: jsonb('power_zones'),
  sex: sexEnum('sex'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  weightKg: numeric('weight_kg', { mode: 'number', precision: 5, scale: 2 })
}).existing()

export const catalogProducts = pgView('catalog_products', {
  brandId: uuid('brand_id'),
  brandLogoUrl: text('brand_logo_url'),
  brandName: text('brand_name'),
  brandSlug: text('brand_slug'),
  caffeineMg: integer('caffeine_mg'),
  calories: integer('calories'),
  carbsG: numeric('carbs_g', { mode: 'number', precision: 5, scale: 1 }),
  createdAt: timestamp('created_at', { withTimezone: true }),
  fatG: numeric('fat_g', { mode: 'number', precision: 5, scale: 1 }),
  flavor: text('flavor'),
  form: productFormEnum('form'),
  id: uuid('id'),
  isActive: boolean('is_active'),
  isFavorite: boolean('is_favorite'),
  name: text('name'),
  notes: text('notes'),
  proteinG: numeric('protein_g', { mode: 'number', precision: 5, scale: 1 }),
  servingSize: numeric('serving_size', { mode: 'number', precision: 6, scale: 2 }),
  servingsPerPackage: integer('servings_per_package'),
  servingUnit: text('serving_unit'),
  slug: text('slug'),
  sodiumMg: integer('sodium_mg'),
  sugarG: numeric('sugar_g', { mode: 'number', precision: 5, scale: 1 }),
  updatedAt: timestamp('updated_at', { withTimezone: true })
}).existing()

export const catalogBrands = pgView('catalog_brands', {
  createdAt: timestamp('created_at', { withTimezone: true }),
  description: text('description'),
  id: uuid('id'),
  isActive: boolean('is_active'),
  isFavorite: boolean('is_favorite'),
  logoUrl: text('logo_url'),
  name: text('name'),
  productCount: integer('product_count'),
  slug: text('slug'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  website: text('website')
}).existing()

export const plansWithSummary = pgView('plans_with_summary', {
  athleteId: uuid('athlete_id'),
  createdAt: timestamp('created_at', { withTimezone: true }),
  date: date('date'),
  durationMinutes: integer('duration_minutes'),
  id: uuid('id'),
  isActive: boolean('is_active'),
  itemCount: integer('item_count'),
  name: text('name'),
  notes: text('notes'),
  targetCarbsPerHour: integer('target_carbs_per_hour'),
  totalCaffeineMg: numeric('total_caffeine_mg', { mode: 'number', precision: 14, scale: 2 }),
  totalCarbsG: numeric('total_carbs_g', { mode: 'number', precision: 14, scale: 2 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  workoutId: uuid('workout_id'),
  workoutSnapshot: jsonb('workout_snapshot')
}).existing()
